/**
 * Gemini API Diagnostic — Lists available models for this API key
 * Run: node gemini-diag.mjs
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const sdkPkg = JSON.parse(readFileSync('./node_modules/@google/generative-ai/package.json', 'utf-8'));
const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

console.log('\n======= GEMINI DIAGNOSTIC =======');
console.log(`key exists : ${!!key}`);
console.log(`key prefix : ${key ? key.slice(0, 3) : 'N/A'}`);
console.log(`SDK        : ${sdkPkg.name} @ ${sdkPkg.version}`);
console.log(`model      : ${model}`);
console.log('=================================\n');

if (!key) { console.error('FATAL: GEMINI_API_KEY not set'); process.exit(1); }

// 1. List models available for this key
console.log('--- Available generateContent models for this key ---');
try {
  const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
  const body = await resp.json();
  if (!resp.ok) {
    console.error(`ListModels FAILED HTTP ${resp.status}: ${JSON.stringify(body.error)}`);
  } else {
    const supported = (body.models || []).filter(m =>
      m.supportedGenerationMethods?.includes('generateContent')
    );
    if (supported.length === 0) {
      console.log('No models found. Key may be blocked or project has no access.');
    } else {
      supported.forEach(m => console.log(` - ${m.name}`));
    }
  }
} catch (e) {
  console.error(`ListModels error: ${e.message}`);
}

// 2. Quick test with configured model
console.log(`\n--- Quick test with model "${model}" ---`);
try {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with the single word: TEST' }] }] })
  });
  const body = await resp.json();
  if (!resp.ok) {
    console.error(`FAILED HTTP ${resp.status}: ${JSON.stringify(body.error)}`);
  } else {
    console.log(`SUCCESS: "${body.candidates?.[0]?.content?.parts?.[0]?.text?.trim()}"`);
  }
} catch (e) {
  console.error(`Test error: ${e.message}`);
}

console.log('\n======= DONE =======\n');
