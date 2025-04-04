import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-student-home',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent {
  institute = {
    name: 'ABC Institute of Technology',
    location: 'Hyderabad, India',
  };

  userDetails = {
    image: 'https://imgs.search.brave.com/4KZYIoORrEk3lsmtCvb5Vd6IcIfyGmibtiB0H6ZZo-o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzExLzU0LzMz/LzM2MF9GXzgxMTU0/MzMzMF9LZk5ZdWtw/RFVRZG1YSUt6Y005/Z2tLOU12dHdPTzhC/ai5qcGc',
    name: 'Kittu',
    age: 16,
    class: '10th Grade',
    section: 'A',
    rollNumber: '12345',
    achievements: ['Top Scorer in Math', 'Science Fair Winner'],
    sports: ['Football', 'Basketball']
  };

  upcomingEvents = [
    { date: '2024-12-01', name: 'Annual Sports Day', location: 'ABC Stadium' },
    { date: '2024-12-15', name: 'Science Exhibition', location: 'Main Auditorium' }
  ];

  results = [
    { subject: 'Mathematics', score: 90, status: 'Pass' },
    { subject: 'Science', score: 85, status: 'Pass' }
  ];
}
