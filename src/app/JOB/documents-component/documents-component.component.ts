import { ChangeDetectorRef, Component, Input, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as Mammoth from 'mammoth'; // Library for handling DOCX files
import { JobUserService } from '../../job-user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 
interface Document {
  id: number;
  documentName: string;
  documentData: any;
  userId: number;
}
 
@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {

  
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(url: string | SafeUrl): SafeUrl {
    if (typeof url === 'string') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return url;
  }
}

@Component({
  selector: 'app-documents-component',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe,ToastModule,ButtonModule],
  templateUrl: './documents-component.component.html',
  styleUrls: ['./documents-component.component.css'],
  providers: [MessageService]
})
export class DocumentsComponentComponent {
  @Input() theme: string = '';
  documents: Document[] = [];
  isLoading: boolean = true; // Add isLoading flag
  selectedDocument: Document | null = null;
  selectedFile: File | null = null;
  dragActive: boolean = false;
  ShowAddDoc: boolean = true;
  userId: any;
  isUploading: boolean = false;
  uploadError: string = '';
  pdfUrl: SafeUrl | null = null;
  wordData: string | null = null; // For Word document preview
 
  constructor(
    private jobUserService: JobUserService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}
 
  ngOnInit() {
    this.loadDocuments();
  }
 
  ngOnDestroy() {
    // Cleanup any blob URLs created during document preview
    this.cleanupBlobUrls();
  }
 
  private cleanupBlobUrls() {
    // Add code for cleanup if you are using blob URLs for PDFs or other resources
  }
 
  loadDocuments() {
    this.isLoading = true; // Start loading
    this.userId = localStorage.getItem('id')
    this.jobUserService.getUserDocuments(this.userId).subscribe({
      next: (docs: Document[]) => {
        this.documents = docs;
        this.isLoading = false; // End loading
        this.cdr.detectChanges(); // Force change detection to update view
      },
      error: (error: any) => {
        console.error('Error loading documents:', error);
        this.isLoading = false; // End loading even on error
      }
    });
  }
  // ... other methods remain the same
 
 
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = true;
  }
 
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
  }
 
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive = false;
  
    const files = event.dataTransfer?.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeInMB = 1; // Set max size to 1 MB
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
      if (file.size > maxSizeInBytes) {
        this.messageService.add({
 
          severity: 'error',
 
          summary: 'Error',
 
          detail: 'File size should be under ${maxSizeInMB} MB.'
 
        });
      } else {
        this.handleFileSelection(file); // Proceed with valid file
      }
    }
  }
  
 
  warning:boolean = false;

  onFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
  
    if (files && files.length > 0) {
      const file = files[0];
      const maxSizeInMB = 1; // Set max size to 1 MB
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
      if (file.size > maxSizeInBytes) {
        this.warning = true;
        element.value = ''; // Clear the file input
      } else {
        this.warning = false;
        this.handleFileSelection(file); // Proceed with valid file
      }
    }
  }
  
 
  private handleFileSelection(file: File) {
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      this.selectedFile = file;
      this.uploadError = '';
      this.wordData = null; // Clear Word data when PDF is selected
    } else if (file && (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx'))) {
      this.selectedFile = file;
      this.uploadError = '';
     
      // Read the DOCX file as ArrayBuffer
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result as ArrayBuffer;
        this.readWordFile(arrayBuffer); // Pass ArrayBuffer to readWordFile
      };
      reader.readAsArrayBuffer(file); // Initiate reading the file as ArrayBuffer
    } else {
      this.uploadError = 'Please select a PDF or Word document (.docx).';
      this.selectedFile = null;
    }
  }
 
  private readWordFile(arrayBuffer: ArrayBuffer) {
    Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
      .then((result) => {
        this.wordData = result.value; // Store converted HTML in wordData
      })
      .catch((error) => {
        console.error('Error reading Word file:', error);
        this.uploadError = 'Failed to parse Word document.';
      });
  }
 
 
  // readWordFile(arrayBuffer: ArrayBuffer) {
  //   Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
  //     .then((result) => {
  //       this.wordData = result.value; // Store converted HTML in wordData
  //     })
  //     .catch((error) => {
  //       console.error('Error reading Word file:', error);
  //       this.uploadError = 'Failed to parse Word document.';
  //     });
  // }
 
 
 
  addDocument() {
    if (this.selectedFile) {
      this.isUploading = true;
      this.uploadError = '';
 
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('documentName', this.selectedFile.name);
      this.userId = localStorage.getItem('id')
      this.jobUserService.uploadDocument(formData, this.userId).subscribe({
        next: (response: Document) => {
          this.documents.push(response);
          this.selectedFile = null;
          this.isUploading = false;
          this.messageService.add({
 
            severity: 'success',
 
            summary: 'Success',
 
            detail: 'Document uploaded successfully!'
 
          });
          this.loadDocuments();
        },
        error: (error: any) => {
          this.isUploading = false;
          this.uploadError = 'Failed to upload document. Please try again.';
        }
      });
    }
  }
 
  deleteDocument(doc: Document) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.jobUserService.deleteDocument(doc.id).subscribe({
        next: () => {
          this.documents = this.documents.filter(d => d.id !== doc.id);
          if (this.selectedDocument?.id === doc.id) {
            this.closePreview();
          }
          this.messageService.add({
 
            severity: 'success',
 
            summary: 'Success',
 
            detail: 'Document deleted successfully!'
 
          });
 
        },
        error: (error: any) => {
          this.messageService.add({
 
            severity: 'error',
 
            summary: 'Error',
 
            detail: 'Failed to delete document. Please try again.'
 
          });
 
        }
      });
    }
  }
 
  clearSelectedFile() {
    this.selectedFile = null;
    this.uploadError = '';
  }
  openPreview(doc: Document) {
    this.closePreview();
    this.selectedDocument = doc;
   
    if (doc.documentName.endsWith('.pdf')) {
      const url = this.getDocumentUrl(doc.documentData);
      if (url) {
        this.pdfUrl = url;
      }
    } else if (doc.documentName.endsWith('.docx')) {
      // Decode base64 string to ArrayBuffer for Mammoth
      const arrayBuffer = this.base64ToArrayBuffer(doc.documentData);
      this.readWordFile(arrayBuffer);
    }
  }
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  // readWordFile(arrayBuffer: ArrayBuffer) {
  //   Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
  //     .then((result) => {
  //       this.wordData = result.value; // Store converted HTML in wordData
  //     })
  //     .catch((error) => {
  //       console.error('Error reading Word file:', error);
  //       this.uploadError = 'Failed to parse Word document.';
  //     });
  // }
     
 
  // readWordFile(arrayBuffer: ArrayBuffer) {
  //   Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
  //     .then((result) => {
  //       this.wordData = result.value; // Store converted HTML in wordData
  //     })
  //     .catch((error) => {
  //       console.error('Error reading Word file:', error);
  //       this.uploadError = 'Failed to parse Word document.';
  //     });
  // }
 
 
  closePreview() {
    this.selectedDocument = null;
    this.pdfUrl = null;
    this.wordData = null;
  }
 
  getDocumentUrl(base64: string): SafeResourceUrl | null {
    if (!base64) {
      console.error('No document data provided');
      return null;
    }
    try {
      const sanitizedUrl = `data:application/pdf;base64,${base64}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
    } catch (error) {
      console.error('Failed to create PDF URL', error);
      return null;
    }
  }
 
  // readWordFile(file: File) {
  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {
  //     const arrayBuffer = e.target.result;
  //     Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
  //       .then((result) => {
  //         this.wordData = result.value;
  //       })
  //       .catch((error) => {
  //         console.error('Error reading Word file:', error);
  //         this.uploadError = 'Failed to parse Word document.';
  //       });
  //   };
  //   reader.readAsArrayBuffer(file);
  // }
}
// please push the code 
 