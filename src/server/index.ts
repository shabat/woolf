import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './router';
import dotenv from 'dotenv';

dotenv.config();

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
