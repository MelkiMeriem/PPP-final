# ai_model_workflow.py

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

# 1. Load Pretrained Model and Tokenizer
model_name = "deepseek-ai/deepseek-coder-6.7b-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

# 2. Optional: Prepare Custom Dataset (Training and Testing)
def load_dataset(file_path, tokenizer, block_size=128):
    return TextDataset(
        tokenizer=tokenizer,
        file_path=file_path,
        block_size=block_size
    )

train_file = "data/train_code.txt"
test_file = "data/test_code.txt"

if os.path.exists(train_file) and os.path.exists(test_file):
    train_dataset = load_dataset(train_file, tokenizer)
    test_dataset = load_dataset(test_file, tokenizer)
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    # 3. Training Setup
    training_args = TrainingArguments(
        output_dir="./results",
        overwrite_output_dir=True,
        num_train_epochs=1,
        per_device_train_batch_size=1,
        save_steps=10,
        save_total_limit=2,
        prediction_loss_only=True,
        logging_dir="./logs",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
    )

    # 4. Fine-Tune Model
    print("[+] Starting fine-tuning...")
    trainer.train()

    # 5. Save Fine-Tuned Model
    print("[+] Saving fine-tuned model...")
    model.save_pretrained("./finetuned_model")
    tokenizer.save_pretrained("./finetuned_model")

# 6. Load and Use the Model for Inference
print("[+] Loading model for inference...")
model = AutoModelForCausalLM.from_pretrained("./finetuned_model" if os.path.exists("./finetuned_model") else model_name, torch_dtype=torch.float16, device_map="auto")
tokenizer = AutoTokenizer.from_pretrained("./finetuned_model" if os.path.exists("./finetuned_model") else model_name)

# 7. Inference / Code Generation
def generate_code(prompt, max_tokens=100):
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    output = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
        temperature=0.7,
        top_k=50,
        top_p=0.95,
        do_sample=True,
        num_return_sequences=1
    )
    return tokenizer.decode(output[0], skip_special_tokens=True)

# Example Prompt
prompt = "def calculate_area(radius):"
result = generate_code(prompt)
print("=== Generated Code ===\n", result)
