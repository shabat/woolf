import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

async function test() {
  // Read files as base64 strings
  const [jobDesc, cv] = await Promise.all([
    readFile('./src/client/data/job.pdf', { encoding: 'base64' }),
    readFile('./src/client/data/cv.pdf', { encoding: 'base64' }),
  ]);

  // Send the base64 strings to the server
  const analysis = await client.analyzeJobFit.mutate({
    jobDescription: jobDesc,
    cv: cv,
  });

  const outputPath = join(
    process.cwd(),
    'src',
    'client',
    'data',
    'analysis.md',
  );
  await writeFile(outputPath, analysis, 'utf8');
  console.log('Analysis result:', analysis);
}

test().catch(console.error);
