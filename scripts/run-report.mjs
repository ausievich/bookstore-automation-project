import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

rmSync('allure-results', { recursive: true, force: true });

// npm run adds node_modules/.bin to PATH (fixes Windows "playwright is not recognized")
const test = spawnSync('npm', ['run', 'test'], { stdio: 'inherit', shell: true });
const exitCode = test.status ?? 1;

run('npm', ['run', 'allure:generate']);
run('npm', ['run', 'allure:open']);

process.exit(exitCode);
