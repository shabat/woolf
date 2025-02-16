import { router, publicProcedure } from './trpc';
import { z } from 'zod';
import { analyzeJobFit } from './services/aiService';
import { parsePDF } from './utils/parsePDF';

export const appRouter = router({
  analyzeJobFit: publicProcedure
    .input(
      z.object({
        jobDescription: z.string(), // Accept base64 string
        cv: z.string(), // Accept base64 string
      }),
    )
    .mutation(async ({ input }) => {
      // Convert base64 strings back to Buffers
      const jobDescBuffer = Buffer.from(input.jobDescription, 'base64');
      const cvBuffer = Buffer.from(input.cv, 'base64');

      // Parse the PDFs
      const jobDescText = await parsePDF(jobDescBuffer);
      const cvText = await parsePDF(cvBuffer);

      // Analyze the job fit
      return await analyzeJobFit(jobDescText, cvText);
    }),
});

export type AppRouter = typeof appRouter;
