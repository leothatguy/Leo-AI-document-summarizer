export declare class AnalysisService {
    extractText(filePath: string, mimeType: string): Promise<string>;
    private extractPdfText;
    private extractDocxText;
    analyzeDocument(text: string, apiKey: string): Promise<any>;
}
