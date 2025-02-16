import { GenerateContentRequest } from '../interfaces';
import {
  handleConfigError,
  handleHttpError,
  handleServiceError,
  validateRequiredInput,
} from '../utils/errorHandlers';

/**
 * Generic function to call the AI service.
 * @param requestBody The request payload for the AI service.
 * @returns The response from the AI service.
 */
async function callAIService(
  requestBody: GenerateContentRequest,
): Promise<string> {
  const aiEndpoint = process.env.AI_ENDPOINT;
  const authToken = process.env.AUTH_TOKEN;

  if (!aiEndpoint || !authToken) {
    handleConfigError();
  }

  try {
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${authToken}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      handleHttpError(response.status, response.statusText);
    }

    const data = await response.json();
    return data.candidates[0].content.parts
      .map((part: { text: any }) => part.text)
      .join('\n')
      .trim();
  } catch (error) {
    handleServiceError(error, 'process AI service request');
  }
}

/**
 * Sanitizes the CV using AI.
 * @param cv The candidate's CV to sanitize.
 * @returns The sanitized CV.
 */
async function sanitizeCV(cv: string): Promise<string> {
  validateRequiredInput(cv, 'CV content');

  const requestBody: GenerateContentRequest = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Sanitize this CV by removing sensitive, irrelevant, unnecessary or redundant information while preserving key details about skills, experience, and education.
            
            CV:
            ${cv}`,
          },
        ],
      },
    ],
    systemInstruction: {
      role: 'model',
      parts: [
        {
          text: 'You are a helpful assistant that sanitizes CV by removing sensitive, irrelevant, unnecessary or redundant information while preserving key details.',
        },
      ],
    },
  };

  try {
    return await callAIService(requestBody);
  } catch (error) {
    handleServiceError(error, 'sanitize CV');
  }
}

/**
 * Sanitizes the job description using AI.
 * @param jobDescription The job description to sanitize.
 * @returns The sanitized job description.
 */
async function sanitizeJobDescription(jobDescription: string): Promise<string> {
  validateRequiredInput(jobDescription, 'Job description content');

  const requestBody: GenerateContentRequest = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Sanitize this job description by removing unnecessary or redundant information while preserving key details about the role, requirements, and responsibilities.
            
            Job Description:
            ${jobDescription}`,
          },
        ],
      },
    ],
    systemInstruction: {
      role: 'model',
      parts: [
        {
          text: 'You are a helpful assistant that sanitizes job descriptions by removing unnecessary or redundant information while preserving key details.',
        },
      ],
    },
  };

  try {
    return await callAIService(requestBody);
  } catch (error) {
    handleServiceError(error, 'sanitize job description');
  }
}

/**
 * Analyzes the fit between a job description and a candidate's CV.
 * @param jobDescription The job description to analyze.
 * @param cv The candidate's CV to analyze.
 * @returns An analysis of the candidate's fit for the job.
 */
export async function analyzeJobFit(
  jobDescription: string,
  cv: string,
): Promise<string> {
  validateRequiredInput(jobDescription, 'Job description');
  validateRequiredInput(cv, 'CV');

  try {
    const sanitizedCV = await sanitizeCV(cv);
    const sanitizedJobDescription =
      await sanitizeJobDescription(jobDescription);

    const requestBody: GenerateContentRequest = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this job description and CV. Identify the candidate's key strengths and weaknesses relative to the role, and evaluate overall fit.
              
              Job Description:
              ${sanitizedJobDescription}
              
              CV:
              ${sanitizedCV}`,
            },
          ],
        },
      ],
    };

    return await callAIService(requestBody);
  } catch (error) {
    handleServiceError(error, 'analyze job fit');
  }
}
