import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AcadamicTeacherServiceService } from '../../../acadamic-service/acadamic-teacher-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-subjectdetails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjectdetails.component.html',
  styleUrl: './subjectdetails.component.css'
})
export class SubjectdetailsComponent {

  constructor(private route: ActivatedRoute, private Service: AcadamicTeacherServiceService) { }

  SubjectId!: number;
  TeacherId!: number;
  instituteId!: number;
  SubjectDetails: any;
  apiResponse = [];
  filteredItems:any[] = [];
  items:any[] = [];
  selectedItemsString:string=''


  isSchedulePopupOpen = false;
  isAddPopupOpen = false;

  searchQuery: string = '';

  schedule = {
    topic: '',
    startTime: '',
    endTime: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.SubjectId = +params['Subjectid'];
      this.TeacherId = 1;
    });
    this.getSubjectDetails();
   
  }

  getSubjectDetails() {
    this.Service.getSujectDetails(this.SubjectId).subscribe(
      {next:(response) => {
        this.SubjectDetails = response;
        this.instituteId = 1;
        console.log(this.SubjectDetails);
        this.getAllStudents();
      },
      error:(error) => {
        console.log(error);
      }}
    )
  }

  getFirstLetter(): string | null {
    if (this.details && this.details.length > 0 && this.details[0].name) {
      return this.details[0].name.charAt(0).toUpperCase();
    }
    return null;
  }

  filterItems() {
    this.filteredItems = this.items.filter(item =>
      item.studentName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  resetForm() {
    this.items.forEach(item => item.selected = false);
  }

  getTotalDuration() {
    const start = this.convertTimeToMinutes(this.schedule.startTime);
    const end = this.convertTimeToMinutes(this.schedule.endTime);

    if (start && end && end > start) {
      const totalMinutes = end - start;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours} hours and ${minutes} minutes`;
    }

    return 'Invalid time range';  // In case of invalid times
  }

  convertTimeToMinutes(time: string): number {
    if (!time) return 0;

    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  openSchedulePopup() {
    this.isSchedulePopupOpen = true;
  }

  closeSchedulePopup() {
    this.isSchedulePopupOpen = false;
    this.resetScheduleFields();
  }

  submitSchedule() {
    console.log('Scheduled:', this.schedule);
    alert(`Scheduled: ${this.schedule.topic}, Start: ${this.schedule.startTime}, End: ${this.schedule.endTime}`);
    this.closeSchedulePopup();
  }

  openAddPopup() {
    this.isAddPopupOpen = true;
  }

  closeAddPopup() {
    this.isAddPopupOpen = false;
  }

  addSelectedItems() {
    const selectedItems = this.items.filter(item => item.selected).map(item => item.id);
    const SelectedNames = this.items.filter(item => item.selected).map(item => item.studentName);
    if (selectedItems.length > 0) {
      alert(`Are You Sure : ${SelectedNames.join(', ')}`);
      this.selectedItemsString = selectedItems.join(',');

      this.Service.addStudents(this.SubjectId, this.TeacherId, this.selectedItemsString).subscribe(
        {next:(response:any[]) => {
          console.log(response);
          alert(`Added Students: ${SelectedNames.join(', ')}`);
        },
        error:(error) => {
          alert(`Something went Wrong!!`);
          console.log(error);
        }}
      )

    } else {
      alert('No items selected!');
    }
    this.closeAddPopup();
  }

  resetScheduleFields() {
    this.schedule = { topic: '', startTime: '', endTime: '' };
  }

  getAllStudents() {
    this.Service.getstudents(this.SubjectId, this.instituteId).subscribe(
      {next:(response:any[]) => {
        this.items = response.map(student => ({
          ...student,
          selected: false
        }));
        this.filteredItems = [...this.items];
        console.log(this.SubjectDetails);
      },
      error:(error) => {
        console.log(error);
      }}
    )
  }




  card = {
    title: 'My Card',
    icons: [
      { name: 'Schedule', class: 'fa-regular fa-calendar', action: () => this.openSchedulePopup() },
      { name: 'Add', class: 'fa-solid fa-plus', action: () => this.openAddPopup() }
    ]
  };

  details = [
    {
      name: 'bharath', subject: 'maths', teachername: 'chand'
    }
  ];
}
