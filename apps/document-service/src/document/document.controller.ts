import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DocumentService } from './document.service';
import {
  DocumentChunk,
  UploadResponse,
  DownloadRequest,
} from '@app/common/interfaces/proto/document';
import { DocumentServiceControllerMethods } from '@app/common/interfaces/proto/document';

@Controller()
@DocumentServiceControllerMethods()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @GrpcStreamMethod('DocumentService', 'UploadDocument')
  uploadDocument(chunks: Observable<DocumentChunk>): Promise<UploadResponse> {
    return this.documentService.uploadDocument(chunks);
  }

  @GrpcMethod('DocumentService', 'DownloadDocument')
  downloadDocument(data: DownloadRequest): Observable<DocumentChunk> {
    return this.documentService.downloadDocument(data.documentId);
  }

  @GrpcStreamMethod('DocumentService', 'SyncDocument')
  syncDocument(chunks: Observable<DocumentChunk>): Observable<DocumentChunk> {
    return this.documentService.syncDocument(chunks);
  }
}
