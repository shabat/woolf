interface Part {
  text: string;
}

interface Content {
  role: 'user' | 'model';
  parts: Part[];
}

export interface GenerateContentRequest {
  contents: Content[];
  systemInstruction?: Content;
  tools?: any[];
  toolConfig?: any;
  safetySettings?: any[];
  generationConfig?: any;
}
