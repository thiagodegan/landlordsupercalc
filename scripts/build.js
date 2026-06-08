import { mkdir, copyFile, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
await copyFile('index.html', 'dist/index.html');

for (const file of await readdir('src')) {
  await copyFile(join('src', file), join('dist/src', file));
}

console.log('Build concluído em dist/.');
