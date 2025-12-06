import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadFile(file: Express.Multer.File): Promise<Document>;
    findOne(id: string): Promise<Document>;
    analyze(id: string): Promise<Document>;
}
