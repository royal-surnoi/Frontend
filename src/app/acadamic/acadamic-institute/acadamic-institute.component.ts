import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AcadamicInstituteServiceService } from '../../acadamic-service/acadamic-institute-service.service';
import { DomSanitizer } from '@angular/platform-browser';

export interface Institute {
  id: number;
  institute_Name: string;
  location: string;
  principal_name: string;
  institute_Registration_No: string;
  instituteType: string;
  board: string;
  email: string;
  image: string;
  addPassword: string;
  confirmPassword: string;
  pincode: string;
  contactNo: string;
  description: string;
  profileImage: any;
  establishedIn: number;
  teachers: any; // You can replace with the actual type if known
  students: any; // You can replace with the actual type if known
  user: any; // You can replace with the actual type if known
}




// Dummy data for the requests and profiles (for demonstration purposes)
const teacherRequests = [
  { id: 1, name: 'John Doe', subject: 'Mathematics', requestStatus: 'pending' },
  { id: 2, name: 'Jane Smith', subject: 'English', requestStatus: 'pending' },
  { id: 3, name: 'Sweety Ariella', subject: 'Biology', requestStatus: 'pending' },
  { id: 4, name: 'Felicity Smoak', subject: 'Computer Science', requestStatus: 'pending' },
  { id: 5, name: 'Harrison Wells', subject: 'Science', requestStatus: 'pending' }
];

const studentRequests = [
  { id: 1, name: 'Alex Brown', grade: '8th Grade', requestStatus: 'pending' },
  { id: 2, name: 'Emma White', grade: '10th Grade', requestStatus: 'pending' },
  { id: 3, name: 'Laurel Lance', grade: '10th Grade', requestStatus: 'pending' },
  { id: 4, name: 'Sweety Ariella', grade: '10th Grade', requestStatus: 'pending' },
  { id: 5, name: 'Cisco Ramon', grade: '10th Grade', requestStatus: 'pending' }
];


// Dummy data for exams (replace with actual API call if needed)
const exams = [
  { id: 1, name: 'Mathematics Final Exam', date: '2024-12-10', time: '10:00 AM', venue: 'Room 101', duration: '2 hours' },
  { id: 2, name: 'Physics Practical Exam', date: '2024-12-12', time: '2:00 PM', venue: 'Lab 3', duration: '3 hours' },
  { id: 3, name: 'English Literature Exam', date: '2024-12-15', time: '11:00 AM', venue: 'Room 205', duration: '1.5 hours' }
];

@Component({
  selector: 'app-acadamic-institute',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './acadamic-institute.component.html',
  styleUrl: './acadamic-institute.component.css'
})
export class AcadamicInstituteComponent {

  isTeacherView: boolean = true;
  instituteData!: Institute;
  FirstTime: boolean = false;
  userid!:number;
  id!:number;

  constructor(private route: ActivatedRoute,private Service: AcadamicInstituteServiceService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userid = Number(localStorage.getItem('id'))
      this.id = +params['id']; // Ensure Institute id is a number
      // this.id = 18;
    });
    this.checkFields();
  }


  toggleView(isTeacher: boolean) {
    this.isTeacherView = isTeacher;
  }

  showPopup = false;

  GetImage(Image: string | File): any {
    if (Image instanceof File) {
      // If it's a File, create a URL for it
      const imageUrl = URL.createObjectURL(Image);
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    } else {
      // If it's a Base64 string, sanitize it as before
      const base64Prefix = 'data:image/png;base64,';
      const sanitizedBase64 = base64Prefix + Image;
      return this.sanitizer.bypassSecurityTrustUrl(sanitizedBase64);
    }
  }

  checkFields(): void {
    const invalidValues = [undefined, null, '', 0];

    // Fetch data from the service
    this.Service.getInstituteById(this.id).subscribe(
      {next:(response: any) => {
        this.instituteData = response;

        console.log(response)
        const fields = [
          response.contactNo,
          response.description,
          response.establishedIn,
          response.profileImage
        ];

        // Check if any field is invalid
        this.showPopup = fields.some((field) => invalidValues.includes(field));
        this.FirstTime = fields.some((field) => invalidValues.includes(field));
      },
      error:(error) => {
        console.error('Error fetching institute data:', error);
      }}
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];  // Get the selected file
    this.instituteData.profileImage = file; // Assign the file to the profileImage field
  }

  // Save updated values
  submitCreateForm() {
    console.log('Updated Institute Data:', this.instituteData);
    this.showPopup = false;
    this.FirstTime = false;
    this.Service.updateInstituteDetails(
      this.instituteData.id,
      this.instituteData.contactNo,
      this.instituteData.description,
      this.instituteData.profileImage,
      this.instituteData.establishedIn
    ).subscribe(
      {next:(response) => {
        console.log('Institute details updated successfully!', response);
        this.checkFields();
      },
      error:(error) => {
        console.error('Error updating institute details:', error);
      }}
    );
  }

  submitUpdateForm(){
    console.log('Updated Institute Data:', this.instituteData);

    const requestData = {
      id: this.instituteData.id,
      instituteName: this.instituteData.institute_Name,
      location: this.instituteData.location,
      principalName: this.instituteData.principal_name,
      registrationNo: this.instituteData.institute_Registration_No,
      instituteType: this.instituteData.instituteType,
      board: this.instituteData.board,
      email: this.instituteData.email,
      addPassword: this.instituteData.addPassword,
      confirmPassword: this.instituteData.confirmPassword,
      pincode: this.instituteData.pincode,
      contactNo: this.instituteData.contactNo,
      description: this.instituteData.description,
      establishedIn: this.instituteData.establishedIn,
      profileImage: this.base64ToFile(this.instituteData.profileImage,"image.jpg","image/jpeg"),
    };

    this.Service.updateInstitute(requestData).subscribe({
      next: (response: string) => {
        console.log(response); // Handle success
        alert('Institute updated successfully!');
      },
      error: (error) => {
        console.error(error); // Handle error
        alert('Error updating institute.');
      },
    });

  }

  CancelForm(){
    this.showPopup = false;
  }

  EditProfile() {
    this.showPopup = true;
  }

  base64ToFile(base64String: string, fileName: string, fileType: string): File {
    // Decode the Base64 string into binary data
    const binaryData = atob(base64String);
    
    // Create an ArrayBuffer to hold the binary data
    const binaryLength = binaryData.length;
    const arrayBuffer = new Uint8Array(binaryLength);
    for (let i = 0; i < binaryLength; i++) {
      arrayBuffer[i] = binaryData.charCodeAt(i);
    }
  
    // Convert ArrayBuffer to Blob
    const blob = new Blob([arrayBuffer], { type: fileType });
  
    // Convert Blob to File
    return new File([blob], fileName, { type: fileType });
  }







  // Temp Code

  galleryImages: string[] = [];
  deleteImage(index: number): void {
    this.galleryImages.splice(index, 1); // Remove image at the specified index
  }
  onGalleryImageUpload(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            this.galleryImages.push(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          alert('Please upload only image files.');
        }
      });
    }
  }
  teacherRequests = teacherRequests;
  studentRequests = studentRequests;
  exams = exams;
  // Method to accept or reject requests
  handleRequest(type: 'teacher' | 'student', id: number, action: 'accept' | 'reject') {
    const requestList = type === 'teacher' ? this.teacherRequests : this.studentRequests;
    const request = requestList.find(r => r.id === id);
    if (request) {
      request.requestStatus = action === 'accept' ? 'accepted' : 'rejected';
    }
  }
  // Method to add teacher or student after accepting the request
  addProfile(type: 'teacher' | 'student', id: number) {
    const requestList = type === 'teacher' ? this.teacherRequests : this.studentRequests;
    const request = requestList.find(r => r.id === id);
    if (request && request.requestStatus === 'accepted') {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} profile added!`);
      // In a real-world scenario, you would add the profile to a database or a backend here.
      console.log(`Add profile for ${type} with ID: ${id}`);
    }
  }
  isPopupOpen = false;
  openPopup() {
    this.isPopupOpen = true;
  }
  addExam() {
    // Save the new exam details (could involve making an API call here)
    this.exams.push({ ...this.newExam, id: this.exams.length + 1 });
    this.closePopup();
  }
  newExam = { name: '', date: '', time: '', venue: '', duration: '' };
  closePopup() {
    this.isPopupOpen = false;
  }




}
