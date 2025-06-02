import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
import torch
from torch.utils.data import Dataset
import os
from config import Config
import joblib
from config import Config


class CVEDataset(Dataset):
    """Custom Dataset for CVE data"""
    def __init__(self, texts, labels, tokenizer, max_length):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
        
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(
            text,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(self.labels[idx], dtype=torch.long)
        }

def clean_text(text):
    """Text cleaning function"""
    text = str(text).lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def train_and_save_models():
    """Train and save all ML models"""
    # Load and preprocess data
    df = pd.read_csv(Config.CVE_DATA)
    df['clean_text'] = df['summary'].apply(clean_text)
    df['label'] = (df['cvss'] >= 7.0).astype(int)  # Binary classification
    
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)
    os.makedirs(Config.BERT_MODEL_DIR, exist_ok=True)
    
    # 1. Train TF-IDF + XGBoost
    print("Training TF-IDF + XGBoost model...")
    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    X_tfidf = tfidf.fit_transform(df['clean_text'])
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_tfidf, y, test_size=0.2, random_state=42
    )
    
    xgb = XGBClassifier(
        objective='binary:logistic',
        eval_metric='logloss',
        use_label_encoder=False
    )
    xgb.fit(X_train, y_train)
    
    # Save models
    joblib.dump(tfidf, Config.TFIDF_VECTORIZER)
    joblib.dump(xgb, Config.XGBOOST_MODEL)
    print(f"Models saved to {Config.TFIDF_VECTORIZER} and {Config.XGBOOST_MODEL}")
    
    # 2. Train BERT model
    print("\nTraining BERT model...")
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertForSequenceClassification.from_pretrained(
        'bert-base-uncased',
        num_labels=2
    )
    
    # Prepare dataset
    dataset = CVEDataset(
        texts=df['clean_text'].values,
        labels=df['label'].values,
        tokenizer=tokenizer,
        max_length=128
    )
    
    # Split dataset
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, [train_size, val_size]
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=Config.BERT_MODEL_DIR,
        num_train_epochs=3,
        per_device_train_batch_size=8,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        logging_dir='./logs',
        load_best_model_at_end=True,
    )
    
    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )
    
    # Train and save
    trainer.train()
    trainer.save_model(Config.BERT_MODEL_DIR)
    tokenizer.save_pretrained(Config.BERT_MODEL_DIR)
    print(f"BERT model saved to {Config.BERT_MODEL_DIR}")


class VulnerabilityClassifier:
    def __init__(self):
        self.tfidf = joblib.load(Config.TFIDF_VECTORIZER)
        self.model = joblib.load(Config.XGBOOST_MODEL)
    
    def predict(self, text):
        """Predict vulnerability probability"""
        cleaned_text = clean_text(text)
        features = self.tfidf.transform([cleaned_text])
        proba = self.model.predict_proba(features)[0][1]
        return {
            'prediction': int(proba >= 0.5),
            'confidence': float(proba),
            'is_critical': proba >= 0.7
        }

if __name__ == "__main__":
    train_and_save_models()