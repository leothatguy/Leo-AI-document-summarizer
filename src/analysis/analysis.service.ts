import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
const pdf = require('pdf-parse');
import * as mammoth from 'mammoth';

@Injectable()
export class AnalysisService {
  async extractText(filePath: string, mimeType: string): Promise<string> {
    const fileBuffer = fs.readFileSync(filePath);

    if (mimeType === 'application/pdf') {
      return this.extractPdfText(fileBuffer);
    } else if (
      mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return this.extractDocxText(fileBuffer);
    } else {
      throw new BadRequestException('Unsupported file type');
    }
  }

  private async extractPdfText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  private async extractDocxText(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  async analyzeDocument(text: string, apiKey: string): Promise<any> {
    const prompt = `
      You are an AI document assistant. Analyze the following text and provide:
      1. A concise summary.
      2. The document type (e.g., Invoice, CV, Contract, Report).
      3. Key metadata (dates, names, amounts, etc.) as a JSON object.

      Return the result in the following JSON format ONLY (no markdown code blocks):
      {
        "summary": "...",
        "documentType": "...",
        "metadata": { ... }
      }

      Text:
      ${text.substring(0, 10000)} // Limit text length to avoid token limits
    `;

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini', // Or any other cheap/free model on OpenRouter
            messages: [{ role: 'user', content: prompt }],
          }),
        },
      );

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Clean up potential markdown code blocks
      const jsonString = content.replace(/```json\n|\n```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      throw new Error('Failed to analyze document');
    }
  }
}
