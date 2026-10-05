import dotenv from 'dotenv';
dotenv.config();
const key = process.env.GEMINI_API_KEY;
const models = ['gemini-flash-latest','gemini-pro-latest','gemini-flash-lite-latest','gemini-3.1-flash-lite','gemini-3.5-flash','gemini-3.1-flash-lite-preview'];

console.log('Testing models with generateContent...\n');
for (const m of models) {
  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ contents: [{ parts: [{ text: 'Reply with the single word: TEST' }] }] })
    });
    const body = await resp.json();
    if (resp.ok) {
      console.log(`SUCCESS: ${m} => "${body.candidates?.[0]?.content?.parts?.[0]?.text?.trim()}"`);
    } else {
      console.log(`FAIL ${resp.status}: ${m} => ${body.error?.message?.slice(0,100)}`);
    }
  } catch(e) { 
    console.log(`ERROR: ${m} => ${e.message}`); 
  }
}
