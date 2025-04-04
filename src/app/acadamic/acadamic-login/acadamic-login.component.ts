import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AcadamicStudentServiceService, InstituteStudent, Status } from '../../acadamic-service/acadamic-student-service.service';
import { AcadamicTeacherServiceService, Institute, InstituteTeacher } from '../../acadamic-service/acadamic-teacher-service.service';
import { AcadamicInstituteServiceService } from '../../acadamic-service/acadamic-institute-service.service';
 

 
@Component({
  selector: 'app-acadamic-login',
  standalone: true,
  imports: [[FormsModule, CommonModule]],
  templateUrl: './acadamic-login.component.html',
  styleUrl: './acadamic-login.component.css'
})
export class AcadamicLoginComponent {

  userId: string | null = null;

  
  // ------------------------------ Institute Dropdown & Location Pincode Logic ------------------------------
  institutes: Institute[] = []; // Stores the list of institutes
  filteredInstitutes: Institute[] = []; // Stores the filtered institutes

  // Variables for the student form
  selectedStudentPincode: string = '';
  selectedStudentLocation: string = '';
  selectedInstituteStudent: string = '';
  selectedInstituteStudentId: number = 0;

  // Variables for the teacher form
  selectedTeacherPincode: string = '';
  selectedTeacherLocation: string = '';
  selectedInstituteTeacher: string = '';
  selectedInstituteTeacherId: number = 0;


  // Dropdown visibility for student and teacher forms
  isStudentDropdownVisible: boolean = false;
  isTeacherDropdownVisible: boolean = false;

  constructor(private StudentService: AcadamicStudentServiceService,private Teacherservice:AcadamicTeacherServiceService,
    private instituteService:AcadamicInstituteServiceService, private router:Router) {}

  ngOnInit(): void {
    // Fetch userId from local storage
    this.userId = localStorage.getItem('id');
    if (!this.userId) {
      alert('User ID not found in local storage.');
      return;
    }

    this.fetchInstitutes(); 
  }
   
 
  activeForm: 'student' | 'teacher' | 'organization' | 'otpStudent' | 'otpTeacher' = 'student';
  selectedFile: File | null = null;
 
  onLoginClick(formType: 'student' | 'teacher' | 'organization'): void {
    this.activeForm = formType; // Set activeForm based on the clicked button
  }
 
  selectedInstitute: string = '';
  isDropdownVisible: boolean = false;
 
 
 
  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
 
  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
 
  // Organization Registration
  registerOrganisation(form: any): void {
    if (form.valid) {
      const {
        username,
        location,
        principal,
        orgRegNo,
        orgType,
        board,
        password,
        confirmPassword,
      } = form.value;
 
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
 
      const organizationData = {
        username,
        location,
        principal,
        orgRegNo,
        orgType,
        board,
        file: this.selectedFile ? this.selectedFile.name : null,
        password,
      };
 
      // Log data to the console
      console.log('Organization Data:', organizationData);
 
      // Save data to local storage
      localStorage.setItem('organizationData', JSON.stringify(organizationData));
 
      // Send data to the backend
      this.instituteService
        .registerOrganisation(
          username,
          location,
          principal,
          orgRegNo,
          orgType,
          board,
          this.selectedFile || '',
          password,
          confirmPassword
        )
        .subscribe(
          {next:(response: string) => {
            alert('Organization registered successfully!');
            console.log('Server Response:', response);
 
            // Reset the form after successful registration
            form.reset();
            this.selectedFile = null; // Clear the selected file
 
            this.router.navigate(['/institute',1]);
          },
          error:(error) => {
            console.error('Error during registration:', error);
            alert(
              'An error occurred during organization registration. Please try again later.'
            );
          }}
        );
    } else {
      alert('Please fill out all fields correctly!');
    }
  }
 
 
  response:any;
  registerStudent(form: any): void {
    if (form.valid) {
      const {
        StudentName, // Maps to `studentName`
        instituteRegistrationNo,    // Maps to `instituteRegistrationNo`
        studentClass, // Maps to `studentClass`
        section,
        institute_Type, // Maps to `institute_Type`
        location,
        password,
        confirmPassword,
        pincode, // Ensure this field exists in the form and is correctly captured
        email // Ensure this field exists in your form
      } = form.value;
 
      // Retrieve userId from local storage
      const userId = localStorage.getItem('id');
 
      // Validate if userId is present
      if (!userId) {
        alert('User ID not found in local storage. Please log in again.');
        return;
      }
 
      // Convert userId to a number
      const parsedUserId = Number(userId);
 
      if (isNaN(parsedUserId)) {
        alert('User ID is invalid. Please log in again.');
        return;
      }
 
      // Validate if passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
 
      const studentData: InstituteStudent = {
        studentName: StudentName,
        instituteRegistrationNo:instituteRegistrationNo,
        studentClass,
        section,
        institute_Type: institute_Type,
        location,
        password,
        confirmPassword,
        email,
        pincode, // Ensure this field exists in the form and is correctly captured
        status: Status.PENDING // Default status
      };
 
      // Log data to the console
      console.log('Student Data:', studentData);
      console.log('User ID:', parsedUserId);
 
      // Send data to the backend
      this.StudentService.registerStudent(this.selectedInstituteStudentId,parsedUserId, studentData)
        .subscribe(
          {next:(response) => {
            alert('Student registered successfully!');
            console.log('Server Response:', response);
              this.response=response
            // Reset the form after successful registration
            form.reset();
            this.activeForm = 'otpStudent';
          },
          error:(error) => {
            console.error('Error during registration:', error);
            alert('An error occurred during student registration. Please try again later.');
          }}
        );
    } else {
      alert('Please fill out all fields correctly!');
    }
  }
 
 
 
 
 
 
 
 
 
  registerTeacher(form: any): void {
    if (form.valid) {
      const {
        teacherId,
        teacher_Name,
        subject,
        location,
        email,
        password,
        confirmPassword,
        pincode
      } = form.value;
 
      // Ensure passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
 
      // Validate pincode
      if (!pincode || pincode.trim() === '') {
        alert('Pincode is required!');
        return;
      }
 
      // Retrieve userId from local storage
      const userId = localStorage.getItem('id'); // Ensure this key exists in local storage
 
      // Check if userId is missing
      if (!userId) {
        alert('User ID is missing in local storage');
        return;
      }
 
      // Constructing the teacher object based on InstituteTeacher interface
      const teacherData: InstituteTeacher = {
        id: 0, // Assuming ID will be assigned by the backend or automatically
        teacherId, // Ensure this is being populated correctly from form
        teacher_Name,
        subject,
        instituteType: this.selectedInstituteTeacher, // Assuming the selected institute is passed here
        location,
        email,
        password,
        confirmPassword,
        pincode, // Ensuring pincode is part of the object
        status: "PENDING", // Default status can be "PENDING"
        institutes: { // Fixed to use "institute" instead of "institutes"
          id: 0, // Replace with actual institute ID if necessary
          instituteName: this.selectedInstituteTeacher,
          institute_Name: this.selectedInstituteTeacher,
          location: '',
          principalName: '',
          instituteRegistrationNo: '',
          instituteType: '',
          board: '',
          email: '',
          image: '',
          addPassword: '',
          confirmPassword: '',
          pincode: '',
          contactNo: '',
          description: '',
          profileImage: '',
          establishedIn: 0,
          teachers: null,
          students: null
        },
        userId: parseInt(userId), // Set userId from local storage
        instituteId: 0 // Set instituteId if needed, or leave as 0 if not available
      };
 
      // Log the teacherData to ensure userId and other fields are correctly included
      console.log('Teacher Data:', teacherData);
 
      // Store teacherData in local storage (if needed for further use)
      localStorage.setItem('teacherData', JSON.stringify(teacherData));
 
      // Registering the teacher via the service
      this.Teacherservice.registerTeacher(teacherData,this.selectedInstituteTeacherId)
        .subscribe(
          {next:(response) => {
            alert('Teacher registered successfully!');
            this.response=response
            form.reset(); // Reset form fields after successful registration
            this.activeForm = 'otpTeacher'; // Navigate to OTP verification or other step
          },
          error:(error: any) => {
            console.error('Error during teacher registration:', error);
            // Handle error response and notify user
            alert('An error occurred during registration. Please try again.');
          }}
        );
    } else {
      alert('Please fill out all fields correctly!');
    }
  }
 
 
  SubmitStudentOtp(form: any): void {
    const { otp } = form.value;
 
    // Retrieve user ID from localStorage or appropriate source
    // const userId = localStorage.getItem('id'); // Replace with your actual logic for userId retrieval
 
  console.log(this.response.id,otp)
    // Call the service method to verify the OTP
    this.StudentService.verifyOtp(Number(this.response.id), otp).subscribe({
      next: (response) => {
        console.log('OTP Verified:', response);
        this.router.navigate(['/candidateview/AcadamicHome']);
      },
      error: (error) => {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP. Please try again.');
      }
    });
  }
 
 
  SubmitTeacherOtp(form: any): void {
    const { otp } = form.value;
 
   
 
    console.log(this.response.id, otp);
 
    // Call the service method to verify the OTP
    this.Teacherservice.verifyTeacherOtp(Number(this.response.id), otp).subscribe({
      next: (response) => {
        console.log('OTP Verified:', response);
        this.router.navigate(['/candidateview/AcadamicHome']);
      },
      error: (error) => {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP. Please try again.');
      }
    });
  }


  registerInstitute(form: NgForm): void {
    if (form.invalid ) {
      alert('Please fill out all required fields and select a file.');
      return;
    }
 
    const formData = new FormData();
    formData.append('institute_Name', form.value.username);
    formData.append('location', form.value.location);
    formData.append('principal_name', form.value.principal);
    formData.append('institute_Registration_No', form.value.orgRegNo);
    formData.append('instituteType', form.value.orgType);
    formData.append('board', form.value.board);
    formData.append('email', form.value.email || 'test@example.com'); // Placeholder for email
    formData.append('addPassword', form.value.password);
    formData.append('confirmPassword', form.value.confirmPassword);
    formData.append('pincode', form.value.pincode || '123456'); // Placeholder for pincode
    formData.append('userId', this.userId || ''); // Send userId from local storage
    // if (this.selectedFile) {
    //   formData.append('image', this.selectedFile);
    // } else {
    //   alert('Please select an image file.');
    //   return;
    // }
 
   
    this.instituteService.registerInstitute(formData).subscribe({
      next: (response: string) => {
        console.log('Response:', response);
        alert(response); // Since it's plain text, directly display it
      },
      error: (err) => {
        console.error('Error registering institute:', err);
        alert('Failed to register institute. Please try again later.');
      }
    });
  }    
 

  // Fetch institutes based on criteria (optional pincode and location filters)
  fetchInstitutes(pincode?: string, location?: string): void {
    this.Teacherservice.getInstitutesByCriteria(pincode, '', location).subscribe(
      {next:(response: Institute[]) => {
        this.institutes = response;
        this.filteredInstitutes = [...this.institutes];
        console.log(response);
      },
      error:(error) => {
        console.error('Error fetching institutes:', error);
        alert('An error occurred while fetching institutes. Please try again later.');
      }}
    );
  }

  // Toggle visibility of student dropdown
  toggleStudentDropdown(): void {
    this.isStudentDropdownVisible = !this.isStudentDropdownVisible;
  }

  // Toggle visibility of teacher dropdown
  toggleTeacherDropdown(): void {
    this.isTeacherDropdownVisible = !this.isTeacherDropdownVisible;
  }

  // Select an institute and autofill corresponding location and pincode
  selectInstitute(institute: Institute, formType: 'student' | 'teacher'): void {
    const selectedInstituteName = institute.institute_Name;

    if (formType === 'student') {
      this.selectedInstituteStudent = selectedInstituteName;
      this.selectedStudentPincode = institute.pincode; // Autofill student pincode
      this.selectedStudentLocation = institute.location; // Autofill student location
      this.selectedInstituteStudentId = institute.id;
      this.isStudentDropdownVisible = false;
    } else if (formType === 'teacher') {
      this.selectedInstituteTeacher = selectedInstituteName;
      this.selectedTeacherPincode = institute.pincode; // Autofill teacher pincode
      this.selectedTeacherLocation = institute.location; // Autofill teacher location
      this.selectedInstituteTeacherId = institute.id;
      this.isTeacherDropdownVisible = false;
    }
  }

  closeDropdowns() {
    this.isStudentDropdownVisible = false;
    this.isTeacherDropdownVisible = false;
    // Close any other dropdowns here
  }

  // ------------------------------ Search & Filter Logic ------------------------------

  // Filter institutes based on search input (across multiple fields)
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toLowerCase().trim();
    const keywords = value.split(/\s+/);

    this.filteredInstitutes = this.institutes.filter((institute) => {
      const combinedFields = [
        institute.instituteName.toLowerCase(),
        institute.location ? institute.location.toLowerCase() : '',
        institute.pincode ? institute.pincode.toString() : '',
        institute.instituteType ? institute.instituteType.toLowerCase() : '',
        institute.establishedIn ? institute.establishedIn.toString().toLowerCase() : '',
      ].join(' ');

      return keywords.every((keyword) => combinedFields.includes(keyword));
    });
  }

  // Filter institutes based on name input
  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.filteredInstitutes = this.institutes.filter(institute =>
      institute.instituteName.toLowerCase().includes(value.toLowerCase())
    );
  }

}
 
 