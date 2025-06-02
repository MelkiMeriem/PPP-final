# SecureScan - AI-Powered Web Security Scanner

**SecureScan** is a comprehensive web application security testing tool that combines React frontend with AI capabilities for automated penetration testing. It performs intelligent fuzzing and generates detailed vulnerability reports. It is ideal for penetration testers, security researchers, and developers looking to automate web security testing.

## Key Features

- Automated web scanning interface
- AI-powered vulnerability detection
- Comprehensive PDF report generation
- Terminal-like interface for commands
- Full Attack Types scanning
- Detailed vulnerability analysis
- Intelligent fuzzing capabilities
- Comprehensive vulnerability reporting

## Requirements

- Python 3.8+ (Recommended: Python 3.10+)
- Linux operating system (Ubuntu, Debian, Fedora, etc.)
- Node.js (v14 or higher)
- npm (comes with Node.js)
- `pip` package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MelkiMeriem/PPP-final.git
cd PPP-final
```

### 2. Create a Python Virtual Environment

Creating a virtual environment isolates your project dependencies from system packages.

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Python Dependencies

The required Python packages are listed in requirements.txt. Install them using:

```bash
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd public
npm install
```

## Configuration

Configure your tool before running it. If environment variables or config files are needed, create them now.

For example, create a .env file in the root directory if your fuzzer requires API keys or other secrets:

```bash
touch .env
```

Then add your variables inside .env:

```
API_KEY=your_api_key_here
OTHER_CONFIG=some_value
```

## Usage & Execution

This project consists of two main parts:

1. **AI Web Fuzzer** - Python backend application responsible for performing the fuzzing and vulnerability analysis
2. **React Frontend** - Web application interface built with Create React App to interact with the fuzzer

### Running the Application

1. Start the React development server:
```bash
cd public
npm start
```

The application will be available at `http://localhost:3000`

2. In a separate terminal, run the Python backend fuzzer:
```bash
source venv/bin/activate
```

After completion, view the detailed vulnerability report saved in the reports_output folder.

## Project Structure

```
PPP-final/
├── public/          # React frontend files
│   └── src/         # Frontend source code
│       ├── components/  # React components
│       │   ├── ScannerSection.js
│       │   ├── PresentationSection.js
│       │   └── ResultsSection.js
│       └── App.css     # Main styles
├── aiwebfuzzer/     # Python backend code
│   └── reports_output/ # Vulnerability reports
└── package.json    # Frontend dependencies
```

## Tech Stack

- Frontend:
  - React 19.1.0
  - Node.js
  - npm
  - Libraries:
    - jspdf for PDF generation
    - terminal-in-react for terminal interface
    - Testing libraries (@testing-library/react, @testing-library/jest-dom)

- Backend:
  - Python 3.8+ (Recommended: Python 3.10+)
  - Linux operating system support
  - Virtual environment support

## Additional Information

For React-specific info, see the Create React App documentation.
For Python backend details, refer to the comments and documentation within the aiwebfuzzer/ directory.