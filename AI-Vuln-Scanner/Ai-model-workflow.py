import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    Trainer,
    TrainingArguments,
    TextDataset,
    DataCollatorForLanguageModeling,
    pipeline,
)
import os
from vulnerability import clean_text  # Reuse cleaning function

class CodeGenerator:
    def __init__(self, model_name="deepseek-ai/deepseek-coder-6.7b-base"):
        self.model_name = model_name
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, 
            torch_dtype=torch.float16, 
            device_map="auto"
        )
        
    def preprocess_code(self, code):
        """Clean and prepare code for training"""
        return clean_text(code)
    
    def train(self, train_file, test_file, epochs=1):
        """Fine-tune the model on custom code"""
        train_dataset = TextDataset(
            tokenizer=self.tokenizer,
            file_path=train_file,
            block_size=128
        )
        
        test_dataset = TextDataset(
            tokenizer=self.tokenizer,
            file_path=test_file,
            block_size=128
        )
        
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer, 
            mlm=False
        )
        
        training_args = TrainingArguments(
            output_dir="./results",
            num_train_epochs=epochs,
            per_device_train_batch_size=1,
            save_steps=10,
            save_total_limit=2,
            logging_dir="./logs",
        )
        
        trainer = Trainer(
            model=self.model,
            args=training_args,
            data_collator=data_collator,
            train_dataset=train_dataset,
            eval_dataset=test_dataset,
        )
        
        trainer.train()
        self.save_model()
        
    def save_model(self, path="./finetuned_model"):
        """Save the fine-tuned model"""
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)
        
    def generate_code(self, prompt, max_tokens=100):
        """Generate code from prompt"""
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        output = self.model.generate(
            **inputs,
            max_new_tokens=max_tokens,
            temperature=0.7,
            top_k=50,
            top_p=0.95,
            do_sample=True,
            num_return_sequences=1
        )
        return self.tokenizer.decode(output[0], skip_special_tokens=True)

if __name__ == "__main__":
    generator = CodeGenerator()
    
    if os.path.exists("data/train_code.txt"):
        print("Fine-tuning model...")
        generator.train("data/train_code.txt", "data/test_code.txt")
    
    prompt = "def detect_sqli(payload):"
    print("Generating code...")
    print(generator.generate_code(prompt))