"""
DecodeLabs AI Internship - Project 1: Rule-Based AI Chatbot
Author: AI Engineer Intern
Description: A deterministic, rule-based AI chatbot implementing the IPO model,
             O(1) dictionary-based intent matching, input sanitization, keyword fallback,
             and continuous interactive loop control.
"""

import string

def sanitize_input(user_input: str) -> str:
    """
    Sanitizes raw user input by stripping leading/trailing whitespace,
    converting text to lowercase, and removing leading/trailing punctuation.
    """
    if user_input is None:
        return ""
    cleaned = user_input.strip().lower()
    return cleaned.strip(string.punctuation)


def build_knowledge_base() -> dict:
    """
    Returns a dictionary mapping predefined intent keys (and aliases) to chatbot responses.
    Provides O(1) constant-time hash-map lookup efficiency.
    """
    return {
        # Greetings & Salutations
        "hello": "Hello! Welcome to DecodeLabs AI Assistant. How can I help you today?",
        "hi": "Hi there! How can I assist you with your AI internship task?",
        "hey": "Hey! Great to see you. Ask me anything about our AI program.",
        "greetings": "Greetings! Ready to explore rule-based artificial intelligence.",
        "good morning": "Good morning! How can I assist your learning today?",
        "good evening": "Good evening! Let me know what questions you have about Project 1.",

        # Internship & Project Details
        "what is project 1": "Project 1 is the foundation phase of the DecodeLabs AI Internship focused on Control Flow, Logic, and Rule-Based Chatbots.",
        "project 1": "Project 1 is the foundation phase of the DecodeLabs AI Internship focused on Control Flow, Logic, and Rule-Based Chatbots.",
        "what is decodelabs": "DecodeLabs is an AI research & industrial training organization empowering future AI Engineers.",
        "decodelabs": "DecodeLabs is an AI research & industrial training organization empowering future AI Engineers.",
        "who are you": "I am a deterministic Rule-Based AI Chatbot built for DecodeLabs AI Internship Project 1.",
        "about": "I am a deterministic Rule-Based AI Chatbot built for DecodeLabs AI Internship Project 1.",

        # Technical Concepts & Architecture
        "what is rule based ai": "Rule-Based AI relies on explicit logic, guardrails, and deterministic hash-map rules to deliver 100% predictable responses without hallucinations.",
        "rule based ai": "Rule-Based AI relies on explicit logic, guardrails, and deterministic hash-map rules to deliver 100% predictable responses without hallucinations.",
        "what is ipo model": "The IPO Model stands for Input (Sanitization) -> Process (Intent Matching) -> Output (Response Generation).",
        "ipo model": "The IPO Model stands for Input (Sanitization) -> Process (Intent Matching) -> Output (Response Generation).",
        "what is difference between rule based and llm": "Rule-based systems use deterministic logic (White Box), while LLMs use probabilistic neural networks (Black Box).",
        "rule based vs llm": "Rule-based systems use deterministic logic (White Box), while LLMs use probabilistic neural networks (Black Box).",
        "llm vs rule based": "Rule-based systems use deterministic logic (White Box), while LLMs use probabilistic neural networks (Black Box).",

        # Guidance & Contact Info
        "help": "You can ask me questions like: 'hello', 'what is project 1', 'what is decodelabs', 'what is rule based ai', 'what is ipo model', or type 'exit' to quit.",
        "commands": "Available topics: Greetings, Project 1 info, DecodeLabs mission, Rule-Based AI, IPO Model, LLM comparison, and Contact info.",
        "contact": "You can reach DecodeLabs at decodelabs.tech@gmail.com or visit www.decodelabs.tech.",
        "email": "You can reach DecodeLabs at decodelabs.tech@gmail.com.",
    }


def get_response(raw_input: str, knowledge_base: dict = None) -> str:
    """
    Processes the raw user input using the IPO model:
    Input (Sanitization) -> Process (O(1) Dictionary Lookup / Keyword Search) -> Output (Response string).
    """
    if knowledge_base is None:
        knowledge_base = build_knowledge_base()

    cleaned = sanitize_input(raw_input)
    if not cleaned:
        return ""

    # Direct O(1) Lookup
    if cleaned in knowledge_base:
        return knowledge_base[cleaned]

    # Keyword Substring Fallback Matching
    for key, response in knowledge_base.items():
        if len(key) > 3 and key in cleaned:
            return response

    return "I do not understand. Type 'help' to see available questions."


def run_chatbot():
    """
    Main interactive loop for the Rule-Based AI Chatbot.
    """
    print("=" * 65)
    print("         WELCOME TO DECODELABS RULE-BASED AI CHATBOT         ")
    print("=" * 65)
    print("Type your query below. Type 'exit', 'quit', or 'bye' to end session.\n")

    knowledge_base = build_knowledge_base()
    exit_commands = {"exit", "quit", "bye", "goodbye"}

    while True:
        try:
            raw_input = input("You: ")
        except (EOFError, KeyboardInterrupt):
            print("\nChatbot: Goodbye! Session ended.")
            break

        cleaned_input = sanitize_input(raw_input)

        # Ignore blank lines
        if not cleaned_input:
            continue

        # Exit Condition
        if cleaned_input in exit_commands:
            print("Chatbot: Goodbye! Have a great day ahead.")
            break

        # Process and Output
        response = get_response(raw_input, knowledge_base)
        print(f"Chatbot: {response}\n")


if __name__ == "__main__":
    run_chatbot()
