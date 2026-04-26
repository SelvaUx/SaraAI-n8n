<div align="center">
  <img src="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png" alt="n8n Logo" width="100"/>
  <h1>Sara AI 🧠 The Omniscient Brain</h1>
  <p>A 100% free, offline-first personal AI assistant built with <b>n8n</b> and <b>Ollama</b>.</p>

  <p>
    <a href="https://github.com/SelvaUx/SaraAI-n8n/graphs/contributors">
      <img src="https://img.shields.io/github/contributors/SelvaUx/SaraAI-n8n" alt="Contributors" />
    </a>
    <a href="https://github.com/SelvaUx/SaraAI-n8n/network/members">
      <img src="https://img.shields.io/github/forks/SelvaUx/SaraAI-n8n" alt="Forks" />
    </a>
    <a href="https://github.com/SelvaUx/SaraAI-n8n/stargazers">
      <img src="https://img.shields.io/github/stars/SelvaUx/SaraAI-n8n" alt="Stars" />
    </a>
    <a href="https://github.com/SelvaUx/SaraAI-n8n/issues">
      <img src="https://img.shields.io/github/issues/SelvaUx/SaraAI-n8n" alt="Issues" />
    </a>
  </p>
</div>

---

## 🌟 Overview

**Sara AI** is an incredibly powerful, fully automated Morning Briefing generator. Unlike traditional AI chatbots that require expensive API keys (OpenAI, Anthropic), Sara is completely cost-free. She leverages your local hardware via **Ollama (Llama 3)** to synthesize real-time world data pulled from public, open-source APIs into a beautifully formatted Markdown report waiting for you every morning.

Built and maintained by [@SelvaUx](https://github.com/SelvaUx).

### ⚡ What She Knows
Sara aggregates live data sequentially every morning at 8:00 AM:
1. **🌤️ Weather**: Local high/low temperatures via [Open-Meteo](https://open-meteo.com/).
2. **📈 Crypto**: Real-time Bitcoin & Ethereum pricing via [CoinGecko](https://www.coingecko.com/).
3. **💡 Inspiration**: The quote of the day via [ZenQuotes](https://zenquotes.io/).
4. **🐈 Knowledge**: A random interesting fact via [CatFacts API](https://catfact.ninja/).

All of this data is merged and fed to your local LLM, which writes a personalized, narrative briefing directly to your hard drive (`~/.n8n_reports/`).

---

## 🚀 Getting Started

### Prerequisites
- [n8n](https://n8n.io/) installed locally (`npm install -g n8n`)
- [Ollama](https://ollama.com/) installed locally with the `llama3` model downloaded (`ollama run llama3`).

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SelvaUx/SaraAI-n8n.git
   cd SaraAI-n8n
   ```

2. **Start Ollama**
   Ensure your local LLM is running in the background:
   ```bash
   ollama serve
   ```

3. **Start n8n (With Permissions)**
   Sara AI requires permission to write the Markdown file to your local computer's file system. You must start n8n with built-in module allowances.
   
   *For Windows PowerShell:*
   ```powershell
   $env:NODE_FUNCTION_ALLOW_BUILTIN="*"; n8n
   ```
   *For Mac/Linux Bash:*
   ```bash
   export NODE_FUNCTION_ALLOW_BUILTIN="*"
   n8n
   ```

4. **Import the Workflow**
   - Open your n8n dashboard (usually `http://localhost:5678`).
   - Click **Import** in the top right.
   - Select the `n8n_ultimate_brain.json` file from this repository.
   - Toggle the workflow to **Active**!

---

## 🛠️ Architecture

This project is built explicitly to bypass common n8n versioning issues and IPv6 local resolution bugs:
- **Sequential API Chaining**: Bypasses complex `Merge` nodes for universal n8n compatibility.
- **Robust JSON Pre-computation**: Prompts are securely built and stringified inside Code nodes to prevent the dreaded `not valid JSON` errors during HTTP requests.
- **IPv4 Fallback**: Hardcoded to `127.0.0.1` to prevent Node 18+ `localhost` routing failures.

---

## 👤 Author

**SelvaUx**
- GitHub: [@SelvaUx](https://github.com/SelvaUx)

If you found Sara AI useful, please consider giving this repository a ⭐!
