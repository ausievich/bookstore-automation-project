import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

function requireDeps() {
  if (!existsSync(resolve('node_modules', '@playwright', 'test'))) {
    console.error('Run npm install first.');
    console.error('Then: npx playwright test');
    process.exit(1);
  }
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

requireDeps();

rmSync('allure-results', { recursive: true, force: true });

const test = spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit', shell: true });
const exitCode = test.status ?? 1;

run('npm', ['run', 'allure:generate']);
run('npm', ['run', 'allure:open']);

process.exit(exitCode);
