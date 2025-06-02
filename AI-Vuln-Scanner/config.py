import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    MODEL_ENGINE = "gpt-3.5-turbo"
    TEMPERATURE = 0.5
    TOKEN_LIMIT = 2048
    
    # Nmap
    NMAP_PROFILES = {
        1: '-Pn -sV -T4 -O -F -vvv',
        2: '-Pn -T4 -A -vvv',
        3: '-Pn -sS -sU -T4 -A -vvv',
        4: '-Pn -p- -T4 -A -vvv',
        5: '-Pn -sS -sU -T4 -A -PE -PP -PS80,443 -PA3389 -PU40125 -PY -g 53 --script=vuln -vvv'
    }
    
    # Model Paths
    XGBOOST_MODEL = 'models/xgboost_model.pkl'
    TFIDF_VECTORIZER = 'models/tfidf_vectorizer.pkl'
    BERT_MODEL_DIR = 'models/bert_model/'
    
    # Data Paths
    CVE_DATA = 'data/cve.csv'
    TRAIN_CODE = 'data/train_code.txt'
    TEST_CODE = 'data/test_code.txt'