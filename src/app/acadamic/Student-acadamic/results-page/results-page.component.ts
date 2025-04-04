import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
export class ResultsPageComponent {
  results = [
    { 
      id: 1, 
      name: 'Math Exam', 
      date: '2024-11-10', 
      score: '85%', 
      rank: 5, 
      total: '100' 
    },
    { 
      id: 2, 
      name: 'Science Exam', 
      date: '2024-11-15', 
      score: '90%', 
      rank: 3, 
      total: '100' 
    },
    { 
      id: 3, 
      name: 'History Exam', 
      date: '2024-11-20', 
      score: '78%', 
      rank: 8, 
      total: '100' 
    }
  ];

  // Mock user data
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://via.placeholder.com/100' // Replace with actual URL
  };

  showPopup = false;
  selectedResult: any = null;

  viewResult(result: any) {
    this.selectedResult = result;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedResult = null;
  }

  printRankCard() {
    const printContent = document.getElementById('rank-card')?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore original layout
    }
  }
}
