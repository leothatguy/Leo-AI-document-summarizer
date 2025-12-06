"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const document_entity_1 = require("./entities/document.entity");
const analysis_service_1 = require("../analysis/analysis.service");
const config_1 = require("@nestjs/config");
let DocumentsService = class DocumentsService {
    documentsRepository;
    analysisService;
    configService;
    constructor(documentsRepository, analysisService, configService) {
        this.documentsRepository = documentsRepository;
        this.analysisService = analysisService;
        this.configService = configService;
    }
    async create(file) {
        const newDocument = this.documentsRepository.create({
            filename: file.originalname,
            originalPath: file.path,
            mimeType: file.mimetype,
        });
        return this.documentsRepository.save(newDocument);
    }
    async findOne(id) {
        const document = await this.documentsRepository.findOne({ where: { id } });
        if (!document) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return document;
    }
    async analyze(id) {
        const document = await this.findOne(id);
        if (!document.extractedText) {
            document.extractedText = await this.analysisService.extractText(document.originalPath, document.mimeType);
            await this.documentsRepository.save(document);
        }
        const apiKey = this.configService.get('OPENROUTER_API_KEY');
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY is not configured');
        }
        const analysisResult = await this.analysisService.analyzeDocument(document.extractedText, apiKey);
        document.summary = analysisResult.summary;
        document.documentType = analysisResult.documentType;
        document.metadata = analysisResult.metadata;
        return this.documentsRepository.save(document);
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(document_entity_1.Document)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        analysis_service_1.AnalysisService,
        config_1.ConfigService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map