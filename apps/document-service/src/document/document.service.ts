import { Injectable, Logger } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  DocumentChunk,
  UploadResponse,
} from '@app/common/interfaces/proto/document';

@Injectable()
export class DocumentService {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads');
  private readonly logger = new Logger(DocumentService.name);

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadDocument(
    chunks: Observable<DocumentChunk>,
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const documentId = uuidv4();
      const filePath = path.join(this.uploadDir, documentId);
      const writeStream = fs.createWriteStream(filePath);

      console.dir(chunks);
      chunks.subscribe({
        next: (chunk) => {
          writeStream.write(chunk.content);
        },
        error: (err) => {
          this.logger.error(`Error uploading document: ${err.message}`);
          writeStream.close();
          reject(new Error('Upload failed'));
        },
        complete: () => {
          writeStream.end();
          resolve({
            message: 'Document uploaded successfully',
            documentId,
            size: 3,
          });
        },
      });
    });
  }

  downloadDocument(documentId: string): Observable<DocumentChunk> {
    const subject = new Subject<DocumentChunk>();

    const filePath = path.join(this.uploadDir, documentId);
    const readStream = fs.createReadStream(filePath, {
      highWaterMark: 64 * 1024,
    });

    let chunkNumber = 0;
    // readStream.on('data', (chunk) => {
    //   chunkNumber++;
    //   subject.next({
    //     content: Buffer.from(chunk),
    //     filename: documentId,
    //     chunkNumber,
    //     isLastChunk: false,
    //   });
    // });

    // readStream.on('end', () => {
    //   subject.next({
    //     content: Buffer.alloc(0),
    //     filename: documentId,
    //     chunkNumber: chunkNumber + 1,
    //     isLastChunk: true,
    //   });
    //   subject.complete();
    // });

    readStream.on('error', (err) => {
      this.logger.error(`Error downloading document: ${err.message}`);
      subject.error(new Error('Download failed'));
    });

    return subject.asObservable();
  }

  syncDocument(chunks: Observable<DocumentChunk>): Observable<DocumentChunk> {
    const subject = new Subject<DocumentChunk>();

    chunks.subscribe({
      next: (chunk) => {
        // Process incoming chunk (e.g., save to temporary file)
        // For simplicity, we'll just echo back the chunki
        subject.next(chunk);
      },
      error: (err) => {
        this.logger.error(`Error syncing document: ${err.message}`);
        subject.error(new Error('Sync failed'));
      },
      complete: () => {
        subject.complete();
      },
    });

    return subject.asObservable();
  }
}
