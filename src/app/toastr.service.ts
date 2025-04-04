import { Injectable } from '@angular/core';
import { ToastrService as NgxToastrService } from 'ngx-toastr';
 
@Injectable({
  providedIn: 'root'
})
export class ToastrService {
 
  constructor(private toastr: NgxToastrService) {}
 
  // ✅ Success Notification
  showSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      toastClass: 'custom-toast-success',
      timeOut: 3000,
      positionClass: 'toast-top-right',
      progressBar: true,  // ✅ Show progress bar
      closeButton: true,
      enableHtml: true
    });
  }
 
  // ❌ Error Notification
  showError(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      toastClass: 'custom-toast-error',
      timeOut: 4000,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      enableHtml: true
    });
  }
 
  // ⚠️ Warning Notification
  showWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      toastClass: 'custom-toast-warning',
      timeOut: 3500,
      positionClass: 'toast-top-right',
      progressBar: true,
      closeButton: true,
      enableHtml: true
    });
  }
}
 
 