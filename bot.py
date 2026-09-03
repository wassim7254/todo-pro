import google.generativeai as genai
import os
import sys
import argparse

# 1. Get API Key from System Environment (Safe way)
api_key = os.getenv("AQ.Ab8RN6IBTpW8WLTNOSfqoli95sTyQ_6AfQ2-SAxZ6YIpjj8hKg")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in environment variables.")
    print("Run: export GEMINI_API_KEY='your_key_here'")
    sys.exit(1)
    

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-pro')

def chat_mode():
    chat = model.start_chat(history=[])
    print("\n🤖 Gemini CLI Interactive Mode (Type 'exit' to quit)")
    while True:
        user_input = input("❯ ")
        if user_input.lower() in ["exit", "quit", "bye"]:
            break
        if not user_input.strip():
            continue
        try:
            response = chat.send_message(user_input)
            print(f"\n{response.text}\n" + "-"*30)
        except Exception as e:
            print(f"Error: {e}")

def single_prompt(prompt):
    try:
        response = model.generate_content(prompt)
        print(f"\n{response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gemini AI CLI")
    parser.add_argument("prompt", nargs="?", help="Ask a quick question")
    parser.add_argument("--chat", action="store_true", help="Start interactive chat mode")
    
    args = parser.parse_args()

    if args.chat:
        chat_mode()
    elif args.prompt:
        single_prompt(args.prompt)
    else:
        parser.print_help()