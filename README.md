# Job Match Analyzer

Server application that leverages tRPC and AI to analyze job descriptions and CVs, providing detailed insights on candidate fit and matching potential.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Gemini 1.5 Flash API access

## Installation

1. Clone the repository:
    ```bash
    clone repo
    cd job-match-analyzer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    ```bash
    cp .env.example .env
    ```

4. Configure your environment variables in `.env`:
    ```
    AI_ENDPOINT=your_gemini_endpoint
    AUTH_TOKEN=your_auth_token
    PORT=3000
    ```

## Usage

### Starting the Server

Launch the development server:
```bash
npm run dev:server
```
The server will be available at `http://localhost:3000` by default.

### Document Setup

1. Place your CV in the client data folder:
    ```
    /src/client/cv.pdf
    ```

2. Place the job description in the client data folder:
    ```
    /src/client/job.pdf
    ```

### Running the Client

Run the client application:
```bash
npm run dev:client
```
In case of successful analysis, results will be available in `/data/analysis.md`
