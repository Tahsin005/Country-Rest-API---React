import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const API_TOKEN = process.env.VITE_RESTCOUNTRIES_API_TOKEN || 'rc_live_6e4eae1a39b94b3e94ffd666122f47ef';
const BASE_URL = 'https://api.restcountries.com/countries/v5';

async function fetchPage(offset) {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}?limit=100&offset=${offset}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  let allObjects = [];
  let offset = 0;
  let hasMore = true;

  console.log('Fetching all countries from REST Countries API...');
  while (hasMore) {
    const data = await fetchPage(offset);
    if (data.data && data.data.objects) {
      allObjects.push(...data.data.objects);
      console.log(`Fetched offset ${offset}: ${data.data.objects.length} countries (Total: ${allObjects.length})`);
    }
    if (data.data && data.data.meta && data.data.meta.more) {
      offset += 100;
    } else {
      hasMore = false;
    }
  }

  const srcDir = path.join(rootDir, 'src', 'data');
  const publicDir = path.join(rootDir, 'public', 'data');

  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const srcPath = path.join(srcDir, 'countriesFallback.json');
  const publicPath = path.join(publicDir, 'countriesFallback.json');

  const jsonContent = JSON.stringify(allObjects, null, 2);
  fs.writeFileSync(srcPath, jsonContent, 'utf-8');
  fs.writeFileSync(publicPath, jsonContent, 'utf-8');

  console.log(`Successfully synced ${allObjects.length} countries to:`);
  console.log(`  - ${srcPath}`);
  console.log(`  - ${publicPath}`);
}

run().catch((err) => {
  console.error('Failed to sync countries:', err);
  process.exit(1);
});
