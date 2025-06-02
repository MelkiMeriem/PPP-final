import torch
from transformers import BertTokenizer, BertForSequenceClassification
from config import Config

class BERTVulnerabilityClassifier:
    def __init__(self):
        self.tokenizer = BertTokenizer.from_pretrained(Config.BERT_MODEL_DIR)
        self.model = BertForSequenceClassification.from_pretrained(Config.BERT_MODEL_DIR)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
    
    def predict(self, text):
        """Predict using BERT model"""
        inputs = self.tokenizer(
            text,
            max_length=128,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        probs = torch.softmax(outputs.logits, dim=1)[0]
        return {
            'prediction': int(torch.argmax(probs)),
            'confidence': float(probs[1]),
            'probabilities': probs.cpu().numpy().tolist()
        }