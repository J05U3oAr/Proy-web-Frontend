import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const distDir = path.join(frontendDir, 'dist');

const apiBaseUrl = (process.env.API_BASE_URL || '').trim() || 'https://web-production-d62d5.up.railway.app/';

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const entry of ['css', 'js', 'index.html']) {
  await cp(path.join(frontendDir, entry), path.join(distDir, entry), { recursive: true });
}

const configPath = path.join(distDir, 'js', 'config.js');
const sourceConfig = await readFile(configPath, 'utf8');
const updatedConfig = sourceConfig.replace(
  "https://web-production-d62d5.up.railway.app/",
  apiBaseUrl.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
);

await writeFile(configPath, updatedConfig, 'utf8');
console.log(`Built frontend/dist with API_BASE_URL=${apiBaseUrl}`);
