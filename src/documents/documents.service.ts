import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { AnalysisService } from '../analysis/analysis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private analysisService: AnalysisService,
    private configService: ConfigService,
  ) {}

  async create(file: Express.Multer.File) {
    const newDocument = this.documentsRepository.create({
      filename: file.originalname,
      originalPath: file.path,
      mimeType: file.mimetype,
    });
    return this.documentsRepository.save(newDocument);
  }

  async findOne(id: string) {
    const document = await this.documentsRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async analyze(id: string) {
    const document = await this.findOne(id);

    // 1. Extract Text
    if (!document.extractedText) {
      document.extractedText = await this.analysisService.extractText(
        document.originalPath,
        document.mimeType,
      );
      await this.documentsRepository.save(document);
    }

    // 2. Analyze with LLM
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const analysisResult = await this.analysisService.analyzeDocument(
      document.extractedText,
      apiKey,
    );

    // 3. Update Document
    document.summary = analysisResult.summary;
    document.documentType = analysisResult.documentType;
    document.metadata = analysisResult.metadata;

    return this.documentsRepository.save(document);
  }
}
