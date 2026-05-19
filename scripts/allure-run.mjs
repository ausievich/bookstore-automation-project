import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

function isValidJavaHome(home) {
  if (!home || home.includes('1>&2')) return false;
  return (
    existsSync(join(home, 'bin', 'java.exe')) ||
    existsSync(join(home, 'bin', 'java'))
  );
}

function discoverJavaHome() {
  const candidates = [];

  if (process.env.JAVA_HOME) candidates.push(process.env.JAVA_HOME);

  if (process.platform === 'win32') {
    for (const base of [
      'C:\\Program Files\\Eclipse Adoptium',
      'C:\\Program Files\\Java',
      'C:\\Program Files\\Microsoft',
    ]) {
      if (!existsSync(base)) continue;
      for (const dir of readdirSync(base, { withFileTypes: true })) {
        if (dir.isDirectory()) candidates.push(join(base, dir.name));
      }
    }
  }

  return candidates.find(isValidJavaHome) ?? null;
}

const javaHome = discoverJavaHome();
if (!javaHome) {
  console.error(
    'JDK 17+ not found. Install from https://adoptium.net/ or set JAVA_HOME to a valid JDK directory.',
  );
  process.exit(1);
}

const allureBin = resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'allure.cmd' : 'allure',
);
if (!existsSync(allureBin)) {
  console.error('allure-commandline not found. Run: npm install');
  process.exit(1);
}

const env = { ...process.env, JAVA_HOME: javaHome };
const result = spawnSync(allureBin, process.argv.slice(2), {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
