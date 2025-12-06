import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Document {
  @ApiProperty({ description: 'The unique identifier of the document' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The original filename of the uploaded document',
  })
  @Column()
  filename: string;

  @ApiProperty({ description: 'The file path where the document is stored' })
  @Column()
  originalPath: string;

  @ApiProperty({ description: 'The MIME type of the document' })
  @Column()
  mimeType: string;

  @ApiProperty({ description: 'The date when the document was uploaded' })
  @CreateDateColumn()
  uploadDate: Date;

  @ApiProperty({
    description: 'The extracted text content of the document',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @ApiProperty({
    description: 'The AI-generated summary of the document',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  summary: string;

  @ApiProperty({
    description: 'The detected type of the document (e.g., Invoice, CV)',
    required: false,
  })
  @Column({ nullable: true })
  documentType: string;

  @ApiProperty({
    description: 'Extracted metadata from the document',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;
}
