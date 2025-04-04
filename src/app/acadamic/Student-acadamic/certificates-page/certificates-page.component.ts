import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-certificates-page',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './certificates-page.component.html',
  styleUrls: ['./certificates-page.component.css']
})
export class CertificatesPageComponent {
  certificates = [
    {
      id: 1,
      title: 'Certified Angular Developer',
      issueDate: '2024-10-20',
      authority: 'Tech Certification Authority',
      certificateId: 'ANG12345'
    },
    {
      id: 2,
      title: 'Certified Spring Boot Developer',
      issueDate: '2024-09-15',
      authority: 'Java Dev Certification',
      certificateId: 'SPR45678'
    },
    {
      id: 3,
      title: 'Certified Full-Stack Developer',
      issueDate: '2024-08-05',
      authority: 'FullStack World',
      certificateId: 'FSD78901'
    }
  ];

  // Mock user data
  user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    profileImage: 'https://via.placeholder.com/100' // Replace with actual URL
  };

  showPopup = false;
  selectedCertificate: any = null;

  viewCertificate(certificate: any) {
    this.selectedCertificate = certificate;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedCertificate = null;
  }

  printCertificate() {
    const printContent = document.getElementById('certificate-content')?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original layout
    }
  }
}
