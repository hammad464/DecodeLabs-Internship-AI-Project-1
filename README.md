# DecodeLabs AI Internship - Project 1: Rule-Based AI Chatbot

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Completed-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-Passing-success.svg)]()

---

## 📌 Project Overview

This repository contains **Task 1 (Project 1)** of the **DecodeLabs AI Internship Program**. The goal of this project is to construct a **Deterministic Rule-Based AI Chatbot** implementing fundamental computer science and artificial intelligence principles:
- **IPO Model** (Input -> Process -> Output)
- **Hash-Map Intent Lookup** providing $O(1)$ constant time efficiency
- **Robust Input Sanitization** (whitespace stripping, lowercasing, and trailing punctuation removal)
- **Keyword Search & Substring Fallback Matching**
- **Continuous Loop Control & Guardrails**

---

## 🏗️ Architectural Framework (The IPO Model)

```mermaid
flowchart LR
    A[Raw User Input] --> B[Input Sanitization]
    B --> C{O(1) Dictionary Lookup}
    C -- Match Found --> E[Generate Response]
    C -- No Match --> D{Keyword Substring Search}
    D -- Substring Match --> E
    D -- No Match --> F[Fallback Response]
    E --> G[Output to Terminal]
    F --> G
```

### 1. Input Phase (Sanitization Pipeline)
Raw string input from the user is sanitized via `sanitize_input()`:
- Converts all characters to lowercase.
- Trims leading and trailing whitespace.
- Removes leading and trailing punctuation marks (`?`, `!`, `.`, `,`).

### 2. Process Phase (Intent Matching Engine)
- **Primary Lookup**: $O(1)$ constant-time lookup using Python dictionary hash map.
- **Secondary Lookup**: Substring key matching across predefined intents.
- **Fallback Guardrail**: Returns a structured help recommendation when query is unmapped.

### 3. Output Phase (Response Delivery)
Prints formatted response to the terminal and loops back for user input until exit commands (`exit`, `quit`, `bye`) are triggered.

---

## 🧠 Rule-Based AI vs. LLMs

| Feature | Rule-Based AI (This Project) | Large Language Models (LLMs) |
| :--- | :--- | :--- |
| **Architecture** | Deterministic Hash Map / Explicit Rules | Probabilistic Neural Networks |
| **Predictability** | 100% Deterministic (White Box) | Probabilistic & Generative (Black Box) |
| **Hallucination** | **Zero** Hallucinations | Vulnerable to Hallucinations |
| **Execution Speed** | $O(1)$ Lookup (< 1ms) | GPU Inference Latency |
| **Resource Usage** | Lightweight (Standard Python Library) | High Compute & Memory Footprint |

---

## 📁 Repository Structure

```text
Task 1/
│
├── chatbot.py                 # Main Rule-Based AI Chatbot implementation
├── test_chatbot.py            # Automated Unit Test Suite (6 unit tests)
├── README.md                  # Detailed project documentation & instructions
├── requirements.txt           # Python version prerequisites
├── .gitignore                 # Version control exclusions
└── docs/                      # Documentation assets & logs
    └── execution_logs.txt     # Verified session & unit test execution logs
```

---

## 🚀 Installation & Running Instructions

### Prerequisites
- **Python 3.10** or higher installed on your system.

### Quick Start
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git
   cd DecodeLabs-Internship-AI-Project-1
   ```

2. **Run the Chatbot**:
   ```bash
   python chatbot.py
   ```

3. **Run Automated Unit Tests**:
   ```bash
   python -m unittest test_chatbot.py -v
   ```

---

## 💬 Sample Queries & Interactive Demo

| Category | Example User Query | Chatbot Response |
| :--- | :--- | :--- |
| **Greetings** | `Hello!` | `Hello! Welcome to DecodeLabs AI Assistant. How can I help you today?` |
| **Project Info** | `What is project 1?` | `Project 1 is the foundation phase of the DecodeLabs AI Internship focused on Control Flow, Logic, and Rule-Based Chatbots.` |
| **Organization** | `Tell me about DecodeLabs` | `DecodeLabs is an AI research & industrial training organization empowering future AI Engineers.` |
| **AI Concepts** | `What is IPO model?` | `The IPO Model stands for Input (Sanitization) -> Process (Intent Matching) -> Output (Response Generation).` |
| **Help** | `help` | `You can ask me questions like: 'hello', 'what is project 1', 'what is decodelabs', 'what is rule based ai', 'what is ipo model', or type 'exit' to quit.` |
| **Exit** | `exit` | `Goodbye! Have a great day ahead.` |

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

- [x] **Code is working properly**: Tested interactively and passed all test cases.
- [x] **Project files are complete**: Included `chatbot.py`, `test_chatbot.py`, `requirements.txt`, `.gitignore`, and `docs/`.
- [x] **GitHub Repository created**: Remote initialized at `https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git`.
- [x] **README file added**: Complete technical documentation added.
- [x] **Screenshots/Documentation prepared**: Execution logs and session recordings stored in `docs/`.
- [x] **Final project tested properly**: Verified 100% unit test passing rate.

---

## 👨‍💻 Author & Acknowledgements
- **Author**: AI Engineer Intern
- **Program**: DecodeLabs AI Internship Program
- **Repository**: [DecodeLabs-Internship-AI-Project-1](https://github.com/hammad464/DecodeLabs-Internship-AI-Project-1.git)
