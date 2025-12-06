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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Document = class Document {
    id;
    filename;
    originalPath;
    mimeType;
    uploadDate;
    extractedText;
    summary;
    documentType;
    metadata;
};
exports.Document = Document;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique identifier of the document' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Document.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The original filename of the uploaded document',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The file path where the document is stored' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "originalPath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The MIME type of the document' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Document.prototype, "mimeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The date when the document was uploaded' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Document.prototype, "uploadDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The extracted text content of the document',
        required: false,
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "extractedText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The AI-generated summary of the document',
        required: false,
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "summary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The detected type of the document (e.g., Invoice, CV)',
        required: false,
    }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Extracted metadata from the document',
        required: false,
    }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Document.prototype, "metadata", void 0);
exports.Document = Document = __decorate([
    (0, typeorm_1.Entity)()
], Document);
//# sourceMappingURL=document.entity.js.map