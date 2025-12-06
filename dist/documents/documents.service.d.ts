import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { AnalysisService } from '../analysis/analysis.service';
import { ConfigService } from '@nestjs/config';
export declare class DocumentsService {
    private documentsRepository;
    private analysisService;
    private configService;
    constructor(documentsRepository: Repository<Document>, analysisService: AnalysisService, configService: ConfigService);
    create(file: Express.Multer.File): Promise<Document>;
    findOne(id: string): Promise<Document>;
    analyze(id: string): Promise<Document>;
}
