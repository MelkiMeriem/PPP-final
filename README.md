# PPP Final Project

A React-based web application for AI-powered web fuzzing and penetration testing.

## Project Overview

This project is a web application that combines React frontend with AI capabilities for web security testing. It includes components for scanning, presentation of results, and AI-based fuzzing capabilities.

## Features

- Web scanning interface
- Results visualization
- AI-powered fuzzing capabilities
- PDF report generation
- Terminal-like interface for commands

## Tech Stack

- React 19.1.0
- Node.js
- npm
- Additional Libraries:
  - jspdf for PDF generation
  - terminal-in-react for terminal interface
  - Testing libraries (@testing-library/react, @testing-library/jest-dom)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd PPP-master
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
PPP-master/
├── public/          # Static files
├── src/            # Source code
│   ├── components/  # React components
│   │   ├── ScannerSection.js
│   │   ├── PresentationSection.js
│   │   └── ResultsSection.js
│   └── App.css     # Main styles
└── package.json    # Project dependencies
```

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

This will create a `build` folder with the production-ready files.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React and its ecosystem
- All contributors and maintainers of the dependencies used in this project
