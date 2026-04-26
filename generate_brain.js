const fs = require('fs');

const workflow = {
  name: "Sara AI - Omniscient Brain",
  nodes: [
    {
      parameters: {
        mode: "custom",
        expression: "0 8 * * *"
      },
      id: "node-cron",
      name: "Daily Trigger",
      type: "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [0, 300]
    },
    {
      parameters: {
        method: "GET",
        url: "https://api.open-meteo.com/v1/forecast?latitude=37.77&longitude=-122.41&daily=temperature_2m_max,temperature_2m_min&timezone=auto",
        options: {}
      },
      id: "node-weather",
      name: "Open-Meteo Weather",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4,
      position: [200, 300]
    },
    {
      parameters: {
        method: "GET",
        url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd",
        options: {}
      },
      id: "node-crypto",
      name: "CoinGecko Crypto",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4,
      position: [400, 300]
    },
    {
      parameters: {
        method: "GET",
        url: "https://zenquotes.io/api/today",
        options: {}
      },
      id: "node-quote",
      name: "ZenQuotes",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4,
      position: [600, 300]
    },
    {
      parameters: {
        method: "GET",
        url: "https://catfact.ninja/fact",
        options: {}
      },
      id: "node-fact",
      name: "Daily Fact",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4,
      position: [800, 300]
    },
    {
      parameters: {
        jsCode: `
let weather, crypto, quote, fact;

try { weather = $items("Open-Meteo Weather")[0].json; } catch(e) { weather = null; }
if (!weather || !weather.daily) weather = { daily: { temperature_2m_max: [0], temperature_2m_min: [0] } };

try { crypto = $items("CoinGecko Crypto")[0].json; } catch(e) { crypto = null; }
if (!crypto || !crypto.bitcoin) crypto = { bitcoin: { usd: 0 }, ethereum: { usd: 0 } };

try { 
  let qData = $items("ZenQuotes")[0].json; 
  quote = qData.q ? qData : qData[0];
} catch(e) { quote = null; }
if (!quote || !quote.q) quote = { q: "No quote today.", a: "Unknown" };

try { fact = $items("Daily Fact")[0].json.fact; } catch(e) { fact = null; }
if (!fact) fact = "No fact today.";

const prompt = \`System: Your name is Sara AI. You are a highly advanced, intelligent, and incredibly helpful personal AI assistant. You have a warm, professional, and slightly futuristic personality. 

Here is the data you have gathered from the internet today:
- Weather: High of \${weather.daily.temperature_2m_max[0]}°C, Low of \${weather.daily.temperature_2m_min[0]}°C
- Crypto Markets: Bitcoin is $\${crypto.bitcoin.usd}, Ethereum is $\${crypto.ethereum.usd}
- Inspiring Quote: "\${quote.q}" - \${quote.a}
- Random Fact of the Day: \${fact}

Task: Write my comprehensive Morning Briefing in Markdown. 
Start by greeting me warmly as Sara AI. Provide a smooth, narrative summary of the weather and crypto markets. Then, share the random fact and the quote, adding your own brief, insightful commentary on the quote to motivate me for the day ahead.\`;

const ollamaPayload = {
  model: "llama3",
  prompt: prompt,
  stream: false
};

return { json: { payload: ollamaPayload } };`
      },
      id: "node-prepare",
      name: "Prepare Data",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1000, 300]
    },
    {
      parameters: {
        method: "POST",
        url: "http://127.0.0.1:11434/api/generate",
        sendBody: true,
        specifyBody: "json",
        jsonBody: "={{ JSON.stringify($json.payload) }}",
        options: {}
      },
      id: "node-ollama",
      name: "Sara AI Model",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4,
      position: [1200, 300]
    },
    {
      parameters: {
        jsCode: `
const fs = require('fs');
const os = require('os');
const path = require('path');

const raw = $input.item.json.response;
let briefing = raw;
try {
  briefing = JSON.parse(raw).response;
} catch (e) {}

const reportsDir = path.join(os.homedir(), '.n8n_reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const date = new Date().toISOString().split('T')[0];
const filepath = path.join(reportsDir, \`Sara_AI_Briefing_\${date}.md\`);

fs.writeFileSync(filepath, briefing);
return { json: { success: true, file: filepath } };`
      },
      id: "node-save-file",
      name: "Save to File",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1400, 300]
    }
  ],
  connections: {
    "Daily Trigger": { "main": [ [ { "node": "Open-Meteo Weather", "type": "main", "index": 0 } ] ] },
    "Open-Meteo Weather": { "main": [ [ { "node": "CoinGecko Crypto", "type": "main", "index": 0 } ] ] },
    "CoinGecko Crypto": { "main": [ [ { "node": "ZenQuotes", "type": "main", "index": 0 } ] ] },
    "ZenQuotes": { "main": [ [ { "node": "Daily Fact", "type": "main", "index": 0 } ] ] },
    "Daily Fact": { "main": [ [ { "node": "Prepare Data", "type": "main", "index": 0 } ] ] },
    "Prepare Data": { "main": [ [ { "node": "Sara AI Model", "type": "main", "index": 0 } ] ] },
    "Sara AI Model": { "main": [ [ { "node": "Save to File", "type": "main", "index": 0 } ] ] }
  },
  settings: {
    executionOrder: "v1"
  },
  staticData: null,
  active: false
};

fs.writeFileSync('n8n_ultimate_brain.json', JSON.stringify(workflow, null, 2));
console.log('Successfully created Sara AI Omniscient Brain!');
