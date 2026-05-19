import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const playwrightArgs = args.length > 0 ? ` ${args.join(' ')}` : '';
const shellCommand = `npm ci && npx playwright test${playwrightArgs}`;

const command = [
  'compose',
  '--profile',
  'tests',
  'run',
  '--rm',
  'playwright',
  'sh',
  '-c',
  shellCommand,
];

const result = spawnSync('docker', command, { stdio: 'inherit', shell: false });
process.exit(result.status ?? 1);
