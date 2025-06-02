#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import nmap
import openai
import argparse
import os
import sys
import json
import time
from jinja2 import Template
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from transformers import BertTokenizer, BertForSequenceClassification
import torch

# Load environment variables from .env file
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    openai.api_key = input("Enter your OpenAI API key: ")
    with open('.env', 'a') as f:
        f.write(f"\nOPENAI_API_KEY={openai.api_key}")

# Configuration
MODEL_ENGINE = "gpt-3.5-turbo"
TEMPERATURE = 0.5
TOKEN_LIMIT = 2048
BERT_MODEL = "bert-base-uncased"

# Initialize Nmap PortScanner
nm = nmap.PortScanner()

def clean_text(text):
    """Clean and preprocess text data"""
    if pd.isna(text):
        return ""
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def load_cve_data(cve_file='data/cve.csv'):
    """Load and preprocess CVE data"""
    df = pd.read_csv(cve_file)
    df['clean_summary'] = df['summary'].apply(clean_text)
    df['label'] = (df['cvss'] >= 7.0).astype(int)
    return df

def train_tfidf_xgboost(df):
    """Train XGBoost model with TF-IDF features"""
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    X = tfidf.fit_transform(df['clean_summary'])
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred))
    return model, tfidf

def train_bert_model(df):
    """Fine-tune BERT model for vulnerability classification"""
    tokenizer = BertTokenizer.from_pretrained(BERT_MODEL)
    model = BertForSequenceClassification.from_pretrained(BERT_MODEL, num_labels=2)
    
    # Tokenize data
    inputs = tokenizer(df['clean_summary'].tolist(), padding=True, truncation=True, max_length=128, return_tensors="pt")
    labels = torch.tensor(df['label'].values)
    
    # Create dataset
    dataset = torch.utils.data.TensorDataset(inputs['input_ids'], inputs['attention_mask'], labels)
    train_size = int(0.8 * len(dataset))
    train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, len(dataset) - train_size])
    
    # Training setup
    training_args = TrainingArguments(
        output_dir='./bert_results',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        logging_dir='./logs',
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )
    
    trainer.train()
    return model, tokenizer

def scan(ip, arguments):
    """Perform Nmap scan and vulnerability analysis"""
    nm.scan(ip, arguments)
    json_data = nm.analyse_nmap_xml_scan()
    analyze = json_data["scan"]
    
    open_ports = extract_open_ports(analyze)
    
    # Generate AI analysis
    prompt = f"""
Analyze these scan results for vulnerabilities:
{analyze}

Open ports: {open_ports}

Provide:
1. Vulnerability description
2. Affected endpoint
3. Evidence
4. OWASP/CWE references as hyperlinks
Return as formatted HTML.
"""
    
    completion = openai.ChatCompletion.create(
        model=MODEL_ENGINE,
        messages=[
            {"role": "system", "content": "You are a cybersecurity expert."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=TOKEN_LIMIT,
        temperature=TEMPERATURE,
    )
    return completion.choices[0].message.content, analyze

# [Rest of the original functions: export_to_csv, export_to_xml, etc.]

def main():
    parser = argparse.ArgumentParser(description='Advanced Vulnerability Scanner')
    parser.add_argument('-t', '--target', required=True, help='Target IP/hostname')
    parser.add_argument('-o', '--output', default='html', help='Output format')
    parser.add_argument('--train', action='store_true', help='Train AI models')
    args = parser.parse_args()
    
    if args.train:
        print("Training AI models...")
        df = load_cve_data()
        print("Training TF-IDF + XGBoost model...")
        xgb_model, tfidf = train_tfidf_xgboost(df)
        print("\nTraining BERT model...")
        bert_model, bert_tokenizer = train_bert_model(df)
        return
    
    # Normal scan mode
    response, scan_data = scan(args.target, profiles[selected_profile])
    export_results(response, args.output)

class VulnerabilityScanner:
    def __init__(self):
        self.tfidf_classifier = VulnerabilityClassifier()
        self.bert_classifier = BERTVulnerabilityClassifier()
        
    def analyze_text(self, text):
        """Analyze text with both models"""
        tfidf_result = self.tfidf_classifier.predict(text)
        bert_result = self.bert_classifier.predict(text)
        
        return {
            'tfidf_xgboost': tfidf_result,
            'bert': bert_result,
            'final_prediction': bert_result['prediction']  # Prefer BERT by default
        }
if __name__ == "__main__":
    main()
