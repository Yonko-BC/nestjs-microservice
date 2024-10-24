import { Module } from '@nestjs/common';
import { DocumentController } from './document/document.controller';
import { DocumentService } from './document/document.service';

@Module({
  imports: [],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentServiceModule {}
