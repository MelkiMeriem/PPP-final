# SecureScan - AI-Powered Web Security Scanner

**SecureScan** is a comprehensive web application security testing tool that combines React frontend with AI capabilities for automated penetration testing. It performs intelligent fuzzing and generates detailed vulnerability reports.

## Key Features

- Automated web scanning interface
- AI-powered vulnerability detection
- Comprehensive PDF report generation
- Terminal-like interface for commands
- Full Attack Types scanning
- Detailed vulnerability analysis

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

## Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone https://github.com/MelkiMeriem/PPP-final.git
cd PPP-final
```

2. Install frontend dependencies:
```bash
cd public
npm install
```

3. Start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Backend Setup

1. Create and activate Python virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

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
└── package.json    # Frontend dependencies