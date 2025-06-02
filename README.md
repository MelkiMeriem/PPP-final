# AI Web Fuzzer

**AI Web Fuzzer** is a Python-based web application security fuzzer designed to automatically detect common web vulnerabilities by sending crafted requests and analyzing responses. The tool leverages AI techniques for intelligent fuzzing and reports potential vulnerabilities with detailed information. It is ideal for penetration testers, security researchers, and developers looking to automate web security testing.

---

## Requirements

- Python 3.8+ (Recommended: Python 3.10+)
- Linux operating system (Ubuntu, Debian, Fedora, etc.)
- `pip` package manager

---

## Installation & Setup

Follow these steps to prepare your environment and get the AI Web Fuzzer ready to run.

### 1. Clone the Repository

git clone https://github.com/MelkiMeriem/PPP-final.git 

cd PPP-final


## 2. Create a Python Virtual Environment
Creating a virtual environment isolates your project dependencies from system packages.

python3 -m venv venv

source venv/bin/activate

# Your terminal prompt should now show (venv) indicating the virtual environment is active.

## 3. Install Python Dependencies
The required Python packages are listed in requirements.txt. Install them using:

pip install -r requirements.txt


# Configuration
Configure your tool before running it. If environment variables or config files are needed, create them now.

For example, create a .env file in the root directory if your fuzzer requires API keys or other secrets:

touch .env


Then add your variables inside .env:

API_KEY=your_api_key_here
OTHER_CONFIG=some_value


## Usage & Execution
This project consists of two main parts:

AI Web Fuzzer — a Python backend application responsible for performing the fuzzing and vulnerability analysis.

React Frontend — a web application interface built with Create React App to interact with the fuzzer.

## Running the Python AI Web Fuzzer (Backend)
# Activate your Python virtual environment:

source venv/bin/activate

After completion, view the detailed vulnerability report saved in the reports_output folder.

Running the React Frontend Application
The React frontend provides an interactive interface to configure and launch fuzzing scans as well as to view reports.

This React app was bootstrapped with Create React App.

# Runs the app in development mode.

Open http://localhost:3000 in your browser to see the frontend.

The page will reload automatically if you make edits.
You may also see lint errors in the console.

Launches the test runner in interactive watch mode.
See running tests for more info.


Builds the app for production into the build folder.
This bundles React in production mode and optimizes for best performance.


Warning: This is a one-way operation and cannot be undone.
It exposes the build configuration so you can customize it extensively.

Summary: How to Run Both Backend and Frontend on Linux
Clone the repository and navigate into the project.

Set up the Python environment and install dependencies:

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

Install Node.js dependencies for the React frontend:

cd public 

npm install

Start the React development server:

npm start

In a separate terminal, run the Python backend fuzzer:

source ../venv/bin/activate

Use the React frontend to control fuzzing tasks and view reports.

Learn More
For React-specific info, see the Create React App documentation.

For Python backend details, refer to the comments and documentation within the aiwebfuzzer/ directory.



