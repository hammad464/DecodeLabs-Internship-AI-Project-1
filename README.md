# DecodeLabs AI Internship - Project 1: Deterministic Rule-Based AI Chatbot & Web UI

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1%2B-lightgrey.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-100%25%20Passing-success.svg)]()

---

## 📌 Project Overview

This repository contains **Task 1 (Project 1)** of the **DecodeLabs AI Internship Program**. The project implements a high-performance **Deterministic Rule-Based AI Chatbot** coupled with a high-end interactive **Web UI & REST API**:
- **IPO Model Architecture** (Input -> Process -> Output)
- **Hash-Map Intent Lookup** providing $O(1)$ constant time efficiency (< 1ms execution)
- **Robust Input Sanitization** (whitespace stripping, lowercase conversion, and punctuation trimming)
- **Keyword Substring Fallback Matching Engine**
- **Continuous Loop Control & Guardrails**
- **Modern Interactive Web Frontend** featuring real-time IPO telemetry, Web Audio tone synthesis, quick prompt chips, and a Knowledge Base Matrix explorer.

---

## 🏗️ Architectural Framework (The IPO Model)

```mermaid
flowchart LR
    A[Raw User Input] --> B[Input Sanitization]
    B --> C{O(1) Dictionary Lookup}
    C -- Match Found --> E[Generate Response]
    C -- No Match --> D{Keyword Substring Search}
    D -- Substring Match --> E
    D -- No Match --> F[Fallback Response Guardrail]
    E --> G[Output to Web UI / Terminal]
    F --> G
```

### 1. Input Phase (Sanitization Pipeline)
Raw string input from the user is sanitized via `sanitize_input()`:
- Converts all characters to lowercase.
- Trims leading and trailing whitespace.
- Strips leading and trailing punctuation marks (`?`, `!`, `.`, `,`).

### 2. Process Phase (Intent Matching Engine)
- **Primary Lookup**: $O(1)$ constant-time lookup using Python dictionary hash map.
- **Secondary Lookup**: Substring key matching across predefined intents.
- **Fallback Guardrail**: Returns a structured help recommendation when query is unmapped.

### 3. Output Phase (Response Delivery & Telemetry)
- Returns formatted response and execution latency metrics to the Web UI or CLI.

---

## 🧠 Rule-Based AI vs. LLMs

| Feature | Rule-Based AI (This Project) | Large Language Models (LLMs) |
| :--- | :--- | :--- |
| **Architecture** | Deterministic Hash Map / Explicit Rules | Probabilistic Neural Networks |
| **Predictability** | 100% Deterministic (White Box) | Probabilistic & Generative (Black Box) |
| **Hallucination** | **Zero** Hallucinations | Vulnerable to Hallucinations |
| **Execution Speed** | $O(1)$ Lookup (< 1ms) | GPU Inference Latency |
| **Resource Usage** | Lightweight (Standard Python + Flask) | High Compute & Memory Footprint |

---

## 📁 Repository Structure

```text
Task 1/
│
├── chatbot.py                 # Core Deterministic Rule-Based AI Engine
├── app.py                     # Flask Web Application & REST API Server
├── test_chatbot.py            # Automated Unit Test Suite (6 unit tests)
├── README.md                  # Comprehensive documentation & guide
├── requirements.txt           # Python dependencies (Flask, flask-cors)
├── .gitignore                 # Version control exclusions
├── static/                    # High-End Modern Web Frontend
│   ├── index.html             # Single-Page Chat & Telemetry Hub
│   ├── css/
│   │   └── style.css          # Ethereal Glass / Dark-Tech CSS Design System
│   └── js/
│       └── app.js             # Real-time IPO telemetry, Web Audio & UI Controller
└── docs/                      # Documentation assets & logs
    └── execution_logs.txt     # Verified session & unit test execution logs
```

---

## 🚀 Installation & Running Instructions

### 1. Prerequisites
- **Python 3.10** or higher installed on your system.

### 2. Clone the Repository
```bash
git clone https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git
cd DecodeLabs-Internship-AI-Project-1
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Launch the Modern Interactive Web UI
```bash
python app.py
```
Open your browser and navigate to: **`http://127.0.0.1:5000`**

### 5. Run the CLI Version in Terminal
```bash
python chatbot.py
```

### 6. Run the Automated Unit Test Suite
```bash
python -m unittest test_chatbot.py -v
```

---

## 🌐 REST API Endpoints

The Flask backend provides RESTful API endpoints for seamless frontend integration:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/chat` | Processes user query and returns response with full IPO telemetry (`latency_ms`, `match_type`, `sanitized_input`). |
| `GET` | `/api/knowledge-base` | Returns the complete categorized rule and intent matrix. |
| `GET` | `/api/health` | Service health status and metadata check. |

---

## 💬 Sample Queries & Interactive Demo

| Category | Example User Query | Chatbot Response | Match Strategy |
| :--- | :--- | :--- | :--- |
| **Greetings** | `Hello!` | `Hello! Welcome to DecodeLabs AI Assistant. How can I help you today?` | $O(1)$ Direct Hash |
| **Project Info** | `What is project 1?` | `Project 1 is the foundation phase of the DecodeLabs AI Internship focused on Control Flow, Logic, and Rule-Based Chatbots.` | $O(1)$ Direct Hash |
| **Organization** | `Tell me about DecodeLabs` | `DecodeLabs is an AI research & industrial training organization empowering future AI Engineers.` | Keyword Substring |
| **AI Concepts** | `What is IPO model?` | `The IPO Model stands for Input (Sanitization) -> Process (Intent Matching) -> Output (Response Generation).` | $O(1)$ Direct Hash |
| **Comparison** | `Rule based vs LLM` | `Rule-based systems use deterministic logic (White Box), while LLMs use probabilistic neural networks (Black Box).` | $O(1)$ Direct Hash |
| **Help** | `help` | `You can ask me questions like: 'hello', 'what is project 1', 'what is decodelabs', 'what is rule based ai', 'what is ipo model', or type 'exit' to quit.` | $O(1)$ Direct Hash |
| **Exit** | `exit` | `Goodbye! Have a great day ahead.` | Terminal Exit Guard |

---

## 🧪 Unit Test Coverage Results

```text
test_blank_input (test_chatbot.TestRuleBasedChatbot.test_blank_input) ... ok
test_direct_intent_lookup (test_chatbot.TestRuleBasedChatbot.test_direct_intent_lookup) ... ok
test_fallback_response (test_chatbot.TestRuleBasedChatbot.test_fallback_response) ... ok
test_keyword_fallback (test_chatbot.TestRuleBasedChatbot.test_keyword_fallback) ... ok
test_punctuation_handling (test_chatbot.TestRuleBasedChatbot.test_punctuation_handling) ... ok
test_sanitize_input (test_chatbot.TestRuleBasedChatbot.test_sanitize_input) ... ok

----------------------------------------------------------------------
Ran 6 tests in 0.000s

OK
```

---

## 📌 Submission Checklist

- [x] **Code is working properly**: Tested interactively, unit tests passing 100%.
- [x] **Web UI is visually appealing & functional**: Built with Ethereal Glass / Dark Tech responsive design, IPO inspector, Web Audio feedback, and Knowledge Base Matrix.
- [x] **Project files are complete**: Included `chatbot.py`, `app.py`, `static/`, `test_chatbot.py`, `requirements.txt`, `.gitignore`, and `docs/`.
- [x] **GitHub Repository synchronized**: Committed and pushed to `https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git`.
- [x] **README file updated**: Complete technical documentation added.
- [x] **Locally executed & verified**: Live web application running on `http://127.0.0.1:5000`.

---

## 👨‍💻 Author & Acknowledgements
- **Author**: AI Engineer Intern
- **Program**: DecodeLabs AI Internship Program
- **Repository**: [DecodeLabs-Internship-AI-Project-1](https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git)
