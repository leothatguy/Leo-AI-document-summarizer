"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const pdf = require('pdf-parse');
const mammoth = __importStar(require("mammoth"));
let AnalysisService = class AnalysisService {
    async extractText(filePath, mimeType) {
        const fileBuffer = fs.readFileSync(filePath);
        if (mimeType === 'application/pdf') {
            return this.extractPdfText(fileBuffer);
        }
        else if (mimeType ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return this.extractDocxText(fileBuffer);
        }
        else {
            throw new common_1.BadRequestException('Unsupported file type');
        }
    }
    async extractPdfText(buffer) {
        const data = await pdf(buffer);
        return data.text;
    }
    async extractDocxText(buffer) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }
    async analyzeDocument(text, apiKey) {
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
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'openai/gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                }),
            });
            const data = await response.json();
            const content = data.choices[0].message.content;
            const jsonString = content.replace(/```json\n|\n```/g, '').trim();
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Error calling OpenRouter:', error);
            throw new Error('Failed to analyze document');
        }
    }
};
exports.AnalysisService = AnalysisService;
exports.AnalysisService = AnalysisService = __decorate([
    (0, common_1.Injectable)()
], AnalysisService);
//# sourceMappingURL=analysis.service.js.map