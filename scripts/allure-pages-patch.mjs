import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const reportDir = process.argv[2] ?? 'allure-report';
const indexPath = join(reportDir, 'index.html');

if (!existsSync(indexPath)) {
  console.error(`Allure report not found: ${indexPath}`);
  process.exit(1);
}

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const basePath = (process.env.ALLURE_PAGES_BASE ?? (repoName ? `/${repoName}/` : '/'))
  .replace(/\/?$/, '/');

writeFileSync(join(reportDir, '.nojekyll'), '');

let html = readFileSync(indexPath, 'utf8');
if (!html.includes('<base ')) {
  html = html.replace('<head>', `<head>\n    <base href="${basePath}">`);
  writeFileSync(indexPath, html);
}

console.log(`Patched Allure report for GitHub Pages (base: ${basePath})`);
