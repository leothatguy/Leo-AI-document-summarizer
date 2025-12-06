import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Document } from './entities/document.entity';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a document (PDF or DOCX)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully uploaded.',
    type: Document,
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.documentsService.create(file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details by ID' })
  @ApiResponse({
    status: 200,
    description: 'The document details.',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze a document using AI' })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully analyzed.',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  analyze(@Param('id') id: string) {
    return this.documentsService.analyze(id);
  }
}
