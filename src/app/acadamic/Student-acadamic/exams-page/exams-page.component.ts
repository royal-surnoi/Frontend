import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-exams-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exams-page.component.html',
  styleUrls: ['./exams-page.component.css']
})
export class ExamsPageComponent {
  exams = [
    { id: 1, name: 'Math Exam', description: 'Basic Math Skills', duration: '60 minutes' },
    { id: 2, name: 'Science Exam', description: 'General Science Knowledge', duration: '90 minutes' },
    { id: 3, name: 'English Exam', description: 'Language and Grammar', duration: '45 minutes' },
    { id: 1, name: 'Math Exam', description: 'Basic Math Skills', duration: '60 minutes' },
    { id: 2, name: 'Science Exam', description: 'General Science Knowledge', duration: '90 minutes' },
    { id: 3, name: 'English Exam', description: 'Language and Grammar', duration: '45 minutes' },
    { id: 1, name: 'Math Exam', description: 'Basic Math Skills', duration: '60 minutes' },
    { id: 2, name: 'Science Exam', description: 'General Science Knowledge', duration: '90 minutes' },
    { id: 3, name: 'English Exam', description: 'Language and Grammar', duration: '45 minutes' }
  ];

  takeExam(examId: number) {
    alert(`You are taking the exam with ID: ${examId}`);
  }
}
