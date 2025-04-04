import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl,FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject,} from 'rxjs';
import { ProfiledetailsService, WorkExperience1, User } from '../profiledetails.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse,} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 

export class Employee {
  id: number = 0;
  fullname!: string;
  last_name!: string;
  email!: string;
  phone!: number;
  applying_for!: string
  time_submission!: Date;
 
  role!: string;
 
  image!: string; // Adding "?" makes the property optional
 
  firstName!: string;
  currentStep!: number
  completedSteps!: number
  houseNo!: string;
  userName!: string;
  password!: string;
  dateOfJoin!: string;
  phoneNumber!: number;
  first_name!: string;
  Last_name!: string;
  Email!: string;
  Phone!: Number;
  Applying_for!: string
  Time_submission!: Date;
  completed!: boolean;
 
  middleName!: string;
  lastName!: string;
  gender!: string;
  age!: string;
  profession!: string;
 
  dateOfBirth!: string;
  personalEmail!: string;
  mobile!: number;
  jobStatus!: string;
  skills!: string;
  currentAddressLine!: string;
  currentCity!: string;
 
 
  currentPincode!: number;
  currentState!: string;
 
  permanentAddressLine!: string;
  permanentCity!: string;
  permanentPincode!: number;
  permanentState!: string;
 
 
  workEmail: any;
  location: any;
  jobTitle: any;
  name: any;
  batchNo!: string;
 
  country!: string;
  pincode!: string;
  yourNameOnCertificate!: string;
  linkedInProfileUrl!: string;
  companyName?: string;
  designation?: string;
  yearsOfExperience?: string;
  companyAddress?: string;
  Fullname!: string;
  // id!:number;
  //   firstName!:string;
  //   lastName:string;
  message!: string;
  category!: string;
  dateTime!: string;
  course!: string;
  city!: string;
  pinCode!: string;
  state!: string;
  yearOfCompletion!: string;
  university!: string;
  branch!: string;
  cgpa!: string;
  userDescription!: string;
  userLanguage!: string;
  interests!: string;
 
}

interface ExperienceErrors {
  invalidDate?: boolean;
  missingEndDateOrCurrentlyWorking?: boolean;
  invalidStartDate?: boolean;
  invalidFields?: boolean;
  invalidCompanyName?: boolean;
  invalidRole?: boolean;
  descriptionTooLong?: boolean;
}
 
export function validateEducationSequence(educationForms: FormGroup[]): boolean {
  let isValid = true;
  let previousPassoutYear: number | null = null;
  const currentYear = new Date().getFullYear();
 
  // Clear previous errors first
  educationForms.forEach(form => {
    // Only process forms that are actually filled
    if (form.get('institute')?.value) {
      form.get('yearOfJoining')?.setErrors(null);
      form.get('yearOfPassout')?.setErrors(null);
      form.updateValueAndValidity({ emitEvent: false });
    }
  });
 
  // Validate each form
  for (let i = 0; i < educationForms.length; i++) {
    const form = educationForms[i];
   
    // Skip if this form is not being used
    if (!form.get('institute')?.value) {
      continue;
    }
   
    const status = form.get('status')?.value;
    const joiningYearValue = form.get('yearOfJoining')?.value;
    const passoutYearValue = form.get('yearOfPassout')?.value;
   
    // Skip if essential values are missing
    if (!joiningYearValue || !status) {
      continue;
    }
   
    const joiningYear = parseInt(joiningYearValue);
    const passoutYear = passoutYearValue ? parseInt(passoutYearValue) : null;
   
    // 1. Validate year of joining is a valid year
    if (isNaN(joiningYear) || joiningYear < 1900 || joiningYear > currentYear + 10) {
      form.get('yearOfJoining')?.setErrors({
        invalidYear: true
      });
      isValid = false;
    }
   
    // 2. Validate year of passout if provided
    if (passoutYear !== null) {
      let passoutErrors = null;
     
      // Different validation based on status
      if (status === 'pursuing') {
        // For pursuing status, passout year should be in the future
        if (isNaN(passoutYear) || passoutYear <= currentYear || passoutYear > currentYear + 10) {
          passoutErrors = {
            invalidFutureYear: true
          };
          isValid = false;
        }
      } else {
        // For completed status, passout year should be valid historical year
        if (isNaN(passoutYear) || passoutYear < 1900 || passoutYear > currentYear) {
          passoutErrors = {
            invalidHistoricalYear: true
          };
          isValid = false;
        }
      }
     
      // 3. Validate year order (joining before passout)
      if (joiningYear >= passoutYear) {
        passoutErrors = {
          ...passoutErrors,
          yearOrderInvalid: true
        };
        isValid = false;
      }
     
      // Set error on passout year field if any errors found
      if (passoutErrors) {
        form.get('yearOfPassout')?.setErrors(passoutErrors);
      }
    }
   
    // 4. Validate sequence with previous education
    if (previousPassoutYear && joiningYear < previousPassoutYear) {
      form.get('yearOfJoining')?.setErrors({
        joiningYearInvalid: true
      });
      isValid = false;
    }
   
    // Update previous passout year for next iteration
    if (passoutYear) {
      previousPassoutYear = passoutYear;
    }
  }
 
  return isValid;
}
 
// Helper function to mark all form controls as touched to show errors
export function markEducationFormsAsTouched(educationForms: FormGroup[]): void {
  educationForms.forEach(form => {
    // Only mark controls in forms that are being used
    if (form.get('institute')?.value) {
      Object.keys(form.controls).forEach(key => {
        form.get(key)?.markAsTouched();
      });
    }
  });
}
 
// Custom validator for text fields (no special chars, no numbers, max 100 chars)
export function textFieldValidator(): ValidatorFn{
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    // Check for special characters and numbers
    const hasSpecialCharsOrNumbers = /[^a-zA-Z\s]/.test(value);
    
    // Check length
    const isTooLong = value.length > 100;

    if (hasSpecialCharsOrNumbers || isTooLong) {
      return {
        textField: {
          hasSpecialCharsOrNumbers,
          isTooLong
        }
      };
    }

    return null;
  };
}

// Custom validator for percentage (numbers only)
export function percentageValidator(): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    // Check if value contains any non-numeric characters
    if (!/^\d*\.?\d*$/.test(value)) {
      return { percentage: true };
    }

    return null;
  };
}

// Custom validator for year (not before current year)
export function yearValidator(yearType: 'passing' | 'joining'): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const currentYear = new Date().getFullYear();
    
    // For joining year
    if (yearType === 'joining') {
      if (!/^\d{4}$/.test(value) || value > currentYear) {
        return { yearJoining: true };
      }
    }
    
    // For passing year
    if (yearType === 'passing') {
      const form = control.parent as FormGroup;
      if (!form) return null;
      
      const joiningYear = form.get('yearOfJoining')?.value;
      
      if (!/^\d{4}$/.test(value) || value < joiningYear || value < currentYear) {
        return { yearPassing: true };
      }
    }

    return null;
  };
}

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,MatSnackBarModule,ToastModule,ButtonModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
  providers: [MessageService]
 
})
export class PersonalDetailsComponent implements OnInit {
  currentTab: string = 'Personal-info';
  personalInfoForm: FormGroup;
  isEditingPersonalInfo: boolean = false;
 
  changePasswordForm: FormGroup;
  employee: Employee = new Employee();
 
  // ============ profile pic ====================
 
 
  user: any = {};
  isEditingUser: boolean = false;
 
  fileSelected: boolean = false;
  selectedFileName: string = '';
  profileImageUrl?: SafeUrl | string;
  profileImageFile: File | null = null;
  profileImageError: string | boolean = false;
  image?: any; // Adding "?" makes the property optional
  originalImage: any; // Store the original image URL
  employees?: User;
 
  personalInfoFormSubmitted: boolean = false;
 
  studid: any;
  batch: any;
  course: any;
  firstName: any;
  lastName: any;
  phoneNumber: any;
 
 
  error: any;
  resumeFile: File | null = null;
  selectedResumeFileName: string = '';
  resumeFileSelected: boolean = false;
  s3Url!: String;
  id: number = 0; // Initialize with a default value
 
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordsMatch = true;
 
  private candidateSubject = new BehaviorSubject<any>(null);
  public candidate$ = this.candidateSubject.asObservable();
  cadidateDetails: any;
 
  // ==================== education ======================
 
  currentTab1: string = 'Education';
  educations: FormGroup[] = [];
  educationOptions: string[] = ['SSC', 'Intermediate/Diploma', 'Graduation', 'Post Graduation'];
  personalDetailsId: number = 0;
  educationId: number | null = null;
  isSubmitted: boolean = false;
  isEditing: boolean = false;
  hasExistingData: boolean = false;
  currentUserId: number = Number(this.authService.getId());
  intermediateCardTitle: string = 'Intermediate';
  visibleForms: number = 1;
 
  // ======================== experience ========================
 
  currentTab2: string = 'Experience';
  // experiences: WorkExperience[] = [];
  // experienceForm: FormGroup;
  isEditing1: boolean = false;
  experience: WorkExperience1[] = [];
  visibleCardCount = 1;
 
 
 
 
  constructor(private formBuilder: FormBuilder,private cdr: ChangeDetectorRef,private snackBar: MatSnackBar, private profiledetailsservice: ProfiledetailsService, private router: Router, private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer,  private messageService: MessageService
  ) {
    this.personalInfoForm = this.formBuilder.group({
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      permanentCountry: ['', Validators.required],
      permanentState: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]*$')
      ]],
      permanentCity: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]],
      permanentAddress: ['', Validators.required],
      permanentZipcode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]],
      dateOfBirth: ['', [
        Validators.required
      ]],
      age: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      profession: ['', Validators.required],
      skills: ['', Validators.required],
      userLanguage: ['', Validators.required],
      userDescription: ['', Validators.required],
      interests: ['', Validators.required]
    }, {
      validators: [this.dateNotInFutureValidator]
    });
 
 
 
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordsMatchValidator });
 
    // ====================== education ==================
    this.addCard();
    // ======================== experience =====================
 
  }
  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordsMismatch': true };
    }
    return null;
  }
 
  populateForms() {
    this.personalInfoForm.patchValue({
      // firstName: this.employee.firstName,
      // lastName: this.employee.lastName,
      // yourNameOnCertificate: this.employee.yourNameOnCertificate,
      email: this.employee.email,
      country: this.employee.country,
      phoneNumber: this.employee.phoneNumber,
      city: this.employee.city,
      state: this.employee.state,
      pinCode: this.employee.pinCode,
      // linkedInProfileUrl: this.employee.linkedInProfileUrl,
      dateOfBirth: this.employee.dateOfBirth,
      age: this.employee.age,
      gender: this.employee.gender,
      userDescription: this.employee.userDescription,
      userLanguage: this.employee.userLanguage,
      skills: this.employee.skills,
      profession: this.employee.skills,
      interests: this.employee.interests
 
    });
 
 
  }
 
  // =============== profile pic =================
 
 
  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
        this.showImagePreview();
      };
      reader.readAsDataURL(file);
      this.profileImageError = false;
    } else {
      this.profileImageError = 'No file selected';
    }
  }
 
  triggerFileInput(): void {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    fileInput.click();
  }
 
  showImagePreview(): void {
    if (confirm("Do you want to upload this image?")) {
      if (this.profileImageFile) {
        this.uploadOrUpdateProfileImage(this.profileImageFile);
      } else {
        console.error('No file selected');
      }
    } else {
      this.revertImage();
    }
  }
  revertImage(): void {
    this.profileImageUrl = this.originalImage;
    this.profileImageFile = null;
  }
  uploadOrUpdateProfileImage(file: File): void {
    if (this.originalImage) {
      this.updateUserProfileImage(file);
    } else {
      this.uploadUserProfileImage(file);
    }
  }
 
  uploadUserProfileImage(file: File): void {
    this.profiledetailsservice.uploadUserImage(this.currentUserId, file).subscribe(
      {next:response => {
        console.log('Profile picture uploaded successfully', response);
        this.updateProfileImage(response);
      },
      error:error => {
        console.error('Error uploading profile picture', error);
        this.profileImageError = 'Failed to upload image';
      }}
    );


    // this.profiledetailsservice.uploadUserImage(this.currentUserId, file).subscribe({
    //   next: (response) => {
    //     console.log('Profile picture uploaded successfully', response);
    //     this.updateProfileImage(response);
    //   },
    //   error: (error) => {
    //     console.error('Error uploading profile picture', error);
    //     this.profileImageError = 'Failed to upload image';
    //   }
     
    // });
    
  }
 
 
 
  updateUserProfileImage(file: File): void {
    const formData = new FormData();
    formData.append('imageFile', file);
    this.profiledetailsservice.updateUserProfileImage(this.currentUserId, formData).subscribe(
     {next: response => {
        console.log('Profile picture updated successfully', response);
        this.updateProfileImage(response.profileImageUrl);
      },
      error:error => {
        console.error('Error updating profile picture', error);
        this.profileImageError = 'Failed to update image';
      }}
    );
  }
  updateProfileImage(imageUrl: string): void {
    this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    this.originalImage = this.profileImageUrl;
    localStorage.setItem('profileImageUrl', imageUrl);
  }
 
  loadUserProfileImage(): void {
    this.profiledetailsservice.getUserDetails(this.currentUserId).subscribe(
      {next:(user: User) => {
        this.employees = user;
        if (user.userImage) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(user.userImage);
          this.originalImage = this.profileImageUrl;
        }
      },
      error:error => {
        console.error('Error fetching user details', error);
      }}
    );
  }
  fetchProfileDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.profiledetailsservice.getUserDetails(this.currentUserId).subscribe({
        next: (data) => {
          this.user = data;
 
          if (data.userImage) {
            const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
            this.image = sanitizedUrl;
          }
        },
        error: (error) => {
          console.error('Error fetching profile details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
 
  uploadProfilePicture(): void {
    this.triggerFileInput();
  }
 
 
  // ================================================================================
  ngOnInit() {
    const userId = localStorage.getItem('id');
    console.log('Retrieved userId:', userId); // Debug line
    if (userId) {
      this.savePersonalInfo(userId);
    } else {
      console.error('User ID not found in localStorage.');
      // Optionally redirect to login or show an error message
      // this.router.navigate(['/login']); // If using Angular Router
    }
 
    this.fetchmethods();
    this.validateEducationForms();
    this.educations.forEach((educationForm) => {
      this.updateValidators(educationForm);
    });
  }
  //p


  fetchmethods(){
    this.personalInfoForm = this.formBuilder.group({
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      permanentCountry: ['', Validators.required],
      permanentState: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]*$')
      ]],
      permanentCity: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]],
      permanentAddress: ['', Validators.required],
      permanentZipcode: ['', [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]],
      dateOfBirth: ['', [
        Validators.required
      ]],
      age: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      profession: ['', Validators.required],
      skills: ['', Validators.required],
      userLanguage: ['', Validators.required],
      userDescription: ['', Validators.required],
      interests: ['', Validators.required]
    }, {
      validators: [this.dateNotInFutureValidator]
    });
 
    this.personalInfoForm.get('dateOfBirth')?.valueChanges.subscribe(() => {
      this.calculateAge();
    });
 
    this.fetchCandidateDetails();
    this.getEmployeeById(this.id)
    this.getcandidateDetailsByID();
 
    // ============================= education ========================
 
    this.getPersonalDetails();
    this.getEducationDetails();
    this.initializeEducationForms();
 
    // =============================== profile pic =========================
    // this.loadUserProfileImage();
    this.fetchProfileDetails();
 
    this.getPersonalDetailsId();
 
    // -------------- experience ------------------
    this.fetchAllExperienceDetails();
 
  }
 
  dateNotInFutureValidator(form: AbstractControl): ValidationErrors | null {
    const dateOfBirth = form.get('dateOfBirth');
    if (dateOfBirth && dateOfBirth.value) {
      const today = new Date();
      const birthDate = new Date(dateOfBirth.value);
     
      if (birthDate > today) {
        dateOfBirth.setErrors({ futureDate: true });
        return { futureDate: true };
      }
    }
    return null;
  }


  savePersonalInfo22() { 
    console.log("API HIT");
  }

  
  fetchCandidateDetails(): void {
    this.studid = window.localStorage.getItem('id');
    if (this.studid) {
      this.profiledetailsservice.getbyid(this.studid).subscribe(
        {next:(data: any) => {
          console.log('Candidate details fetched successfully:', data);
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.id = data.id; // Set the id dynamically here
          this.phoneNumber = data.phoneNumber;
          this.image = this.createImageSrc(data.image);
 
          // Update the BehaviorSubject
          this.candidateSubject.next({
            firstName: this.firstName,
            lastName: this.lastName,
            id: this.id,
            phoneNumber: this.phoneNumber,
            image: this.image,
          });
 
          // Once you have the id, you can fetch other details if needed
          this.getEmployeeById(this.id);
        },
        error:(error: any) => {
          console.error('Failed to fetch candidate details:', error);
        }}
      );
    } else {
      console.error('No Candidate ID found. Cannot fetch candidate details.');
    }
  }
  getcandidateDetailsByID() {
    this.studid = window.localStorage.getItem('id');
    this.http.get(`${environment.apiBaseUrl}/user/find/${this.studid}`).subscribe((res) => {
      this.cadidateDetails = res;
      console.log(this.cadidateDetails.email, "email")
    })
  }
  private createImageSrc(imageData: string): string {
    return 'data:image/png;base64,' + imageData;
  }
  nameValidator(control: FormControl): { [key: string]: boolean } | null {
    // Example validation logic for names
    if (control.value && /[^a-zA-Z\s]/.test(control.value)) {
      return { 'nameValidator': true };
    }
    return null;
  }
 
  calculateAge() {
    const dobValue = this.personalInfoForm.get('dateOfBirth')?.value;
    if (dobValue) {
      const today = new Date();
      const birthDate = new Date(dobValue);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.personalInfoForm.get('age')?.setValue(age);
    }
  }
 
 
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.fileSelected = true;
      this.personalInfoForm.patchValue({ resume: file });
    } else {
      this.clearFile();
    }
  }
 
  clearFile() {
    this.fileSelected = false;
    this.selectedFileName = '';
    this.personalInfoForm.patchValue({ resume: null });
  }
  changeProfileImage(): void {
    this.uploadProfilePicture();
  }
 
 
  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.resumeFile = input.files[0];
      this.selectedResumeFileName = this.resumeFile.name;
      this.resumeFileSelected = true;
    }
  }
 
  clearResumeFile(): void {
    this.resumeFile = null;
    this.selectedResumeFileName = '';
    this.resumeFileSelected = false;
  }
 
  // Method to handle form submission
  savePersonalInfo(userId: string): void {
    if (this.personalInfoForm.valid) {
      this.profiledetailsservice.savePersonalInfo(userId, this.personalInfoForm.value).subscribe(
       {next: response => {
          console.log('Personal details saved successfully:', response);
        },
        error:error => {
          console.error('Error saving personal details:', error);
        }}
      );
    } else {
      this.personalInfoForm.markAllAsTouched();
    }
  }
 
  buildFormData(): FormData {
    const formData = new FormData();
 
    if (this.profileImageFile) {
      formData.append('imageFile', this.profileImageFile);
    }
    if (this.resumeFile) {
      formData.append('resumeFile', this.resumeFile);
    }
 
    formData.append('firstName', this.personalInfoForm.get('firstName')?.value);
    formData.append('lastName', this.personalInfoForm.get('lastName')?.value);
    formData.append('phoneNumber', this.personalInfoForm.get('phoneNumber')?.value);
    formData.append('email', this.personalInfoForm.get('email')?.value);
    formData.append('city', this.personalInfoForm.get('city')?.value);
    formData.append('pinCode', this.personalInfoForm.get('pinCode')?.value);
    formData.append('state', this.personalInfoForm.get('state')?.value);
    formData.append('dateOfBirth', this.personalInfoForm.get('dateOfBirth')?.value);
    formData.append('yourNameOnCertificate', this.personalInfoForm.get('yourNameOnCertificate')?.value);
    formData.append('linkedInProfileUrl', this.personalInfoForm.get('linkedInProfileUrl')?.value);
 
    return formData;
  }
 
  handleError(error: any): void {
    console.error('Error changing password:', error);
    if (error.error && error.error.message) {
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Error changing password: ' + error.error.message
 
      });
    } else {
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Current password is incorrect'
 
      });
 
    }
  }
 
  getEmployeeById(id: number) {
    this.profiledetailsservice.getEmployeeById(id).subscribe(
      {next:(employee: Employee) => {
        this.employee = employee;
        this.populateForms();
      },
      error:error => {
        console.error('Error fetching employee details', error);
        // Handle the error appropriately (e.g., show an error message, redirect to an error page)
      }}
    );
  }
  //p
  // isFieldInvalid(field: string): boolean {
  //   const control = this.personalInfoForm.get(field);
  //   return control ? !control.valid && control.touched : false;
  // }
  isFieldInvalid(fieldName: string): boolean {
    const control = this.personalInfoForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
 
  prevTab() {
    const tabs = ['Personal-info', 'Education', 'Experience'];
    const currentIndex = tabs.indexOf(this.currentTab);
    this.currentTab = tabs[Math.max(currentIndex - 1, 0)];
  }
 
  nextTab() {
    if (this.currentTab === 'Personal-info' && !this.personalInfoFormSubmitted) {
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Please submit the personal information first.'
 
      });
 
    } else {
      const tabs = ['Personal-info', 'Education', 'Experience'];
      const currentIndex = tabs.indexOf(this.currentTab);
      this.currentTab = tabs[Math.min(currentIndex + 1, tabs.length - 1)];
    }
  }
 
  studentholder() {
    this.router.navigate(['/candidateview/home']);
 
  }
  // ------------- get user name and email -------------------------
 
 
  saveChanges(): void {
    if (this.currentUserId) {
      this.profiledetailsservice.updateUserName(this.currentUserId, this.user.name).subscribe({
        next: (response) => {
          this.isEditingUser = false;
          console.log("successfully saved the name")
          console.log(response); // This will log "User name updated successfully"
 
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating user name:', error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          console.error('Error:', error.error);
          // Handle the error appropriately, e.g., show an error message to the user
        }
      });
    } else {
      console.error('Current user ID is not available');
    }
  }
 
 
  cancelEditUser(): void {
    this.isEditingUser = false;
  }
  enableEditUser(): void {
    this.isEditingUser = true;
  }
 
  // ===================== get personl info ====================
  getPersonalDetailsId() {
    this.profiledetailsservice.getPersonalDetailsById(this.currentUserId).subscribe(
      {next:(data) => {
        if (data) {
          this.personalDetailsId = data.id;
          this.populateForm(data);
          this.personalInfoForm.disable();
        } else {
          this.personalInfoForm.enable();
        }
      },
      error:(error) => {
        console.error('Error fetching personal details:', error);
        this.personalInfoForm.enable();
      }}
    );
  }
 
  populateForm(data: any) {
    console.log('Populating form with data:', data);
    this.personalInfoForm.patchValue({
      // firstName: data.firstName,
      // lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      permanentCountry: data.permanentCountry || 'India',
      permanentState: data.permanentState,
      permanentCity: data.permanentCity,
      permanentAddress: data.permanentAddress,
      permanentZipcode: data.permanentZipcode,
      dateOfBirth: data.dateOfBirth,
      age: data.age,
      gender: data.gender,
      userDescription: data.userDescription,
      userLanguage: data.userLanguage,
      skills: data.skills,
      profession: data.profession,
      interests: data.interests
    });
  }
  enableEditingPersonalInfo() {
 
    this.isEditing = true;
    this.personalInfoForm.enable();
 
  }
  cancelEditingPersonalInfo() {
 
    this.isEditing = false;
    this.personalInfoForm.disable();
    this.getPersonalDetailsId();
  }
  onSubmit() {
    if (this.personalInfoForm.valid && !this.personalDetailsId) {
      this.createPersonalDetails();
    }
  }
 
 
  createPersonalDetails() {
    const personalDetails = this.personalInfoForm.value;
    this.profiledetailsservice.createPersonalDetails(this.currentUserId, personalDetails).subscribe(
      {next:(response) => {
        console.log('Personal details created successfully:', response);
        this.snackBar.open('personal details uploaded successfully!', 'Close', {
          duration: 3000, 
          verticalPosition: 'top', 
          horizontalPosition: 'center', 
          panelClass: ['success-snackbar'] 
        });
        this.personalDetailsId = response.id;
        this.personalInfoForm.disable();
        this.personalInfoForm.markAsPristine();
        this.personalInfoForm.markAsUntouched();
      },
      error:(error) => {
        console.error('Error creating personal details:', error);
      }}
    );
  }
 
  updateDetails() {
    if (this.personalInfoForm.valid && this.personalDetailsId) {
      const personalDetails = this.personalInfoForm.value;
      this.profiledetailsservice.updatePersonalDetails(this.personalDetailsId, personalDetails).subscribe(
        {next:(response) => {
          console.log('Personal details updated successfully:', response);
          this.snackBar.open('personal details updated successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top', 
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'] 
          });
          this.isEditing = false;
          this.personalInfoForm.disable();
        },
        error:(error) => {
          console.error('Error updating personal details:', error);
        }}
      );
    }
  }
 
  // ========================= education =====================
 
  addCard(): void {
    if (this.educations.length < 4) {
      console.log ("API HITTING");
    }
  }
 
  toggleEdit(educationForm: FormGroup) {
    if (educationForm.get('isSaved')?.value) {
      educationForm.enable();
      educationForm.patchValue({ isSaved: false });
    }
  }
 
  getPersonalDetails() {
    console.log('Fetching personal details');
    this.profiledetailsservice.getPersonalDetailsById(this.currentUserId).subscribe(
      (response) => {
        console.log('Personal details response:', response);
        if (response && response.id) {
          this.personalDetailsId = response.id;
          console.log('Personal details ID set:', this.personalDetailsId);
          this.getEducationDetails();
          this.fetchAllExperienceDetails();
        } else {
          console.log('No personal details found, initializing empty education forms');
          this.initializeEducationForms();
        }
      },
      (error) => {
        console.error('Error fetching personal details:', error);
        this.initializeEducationForms();
      }
    );
  }
 
  getEducationDetails() {
    console.log('Fetching education details');
    if (this.currentUserId) {
      this.profiledetailsservice.getEducationDetails(this.currentUserId).subscribe(
        (educationDetails) => {
          console.log('Education details response:', educationDetails);
          if (educationDetails && educationDetails.length > 0 && educationDetails[0].id) {
            this.educationId = educationDetails[0].id;
            console.log('Education ID set:', this.educationId);
            this.populateEducationForms(educationDetails[0]);
            this.disableAllForms();
          } else {
            console.log('No education details found, initializing empty forms');
            this.initializeEducationForms();
          }
        },
        (error) => {
          console.error('Error fetching education details:', error);
          this.initializeEducationForms();
        }
      );
    } else {
      console.log('No personal details ID, initializing empty education forms');
      this.initializeEducationForms();
    }
  }
 
  initializeEducationForms() {
    console.log('Initializing empty education forms');
    this.educations = this.educationOptions.map(level => this.createEducationForm(level));
    this.educationId = null;
    this.isEditing = false;
   
    // Add value change listeners to all forms
    this.educations.forEach(form => {
      ['yearOfJoining', 'yearOfPassout', 'status'].forEach(field => {
        form.get(field)?.valueChanges.subscribe(() => {
          this.validateEducationForms();
        });
      });
    });
   
    console.log('Education forms initialized, educationId:', this.educationId, 'isEditing:', this.isEditing);
  }
 
  showAddButton(index: number): boolean {
    const currentForm = this.educations[index];
    return currentForm.enabled &&
      currentForm.get('status')?.value === 'completed' &&
      index === this.visibleForms - 1 &&
      index < this.educations.length - 1;
  }
 
 
  addNextCard(index: number) {
    if (index < this.educations.length - 1) {
      this.visibleForms++;
      this.enableVisibleForms();
    }
  }
  enableVisibleForms() {
    this.educations.forEach((form, index) => {
      if (index < this.visibleForms) {
        form.enable();
      } else {
        form.disable();
      }
    });
  }
 
  populateEducationForms(educationDetails: any) {
    console.log('Populating education forms with:', educationDetails);
    this.educations = this.educationOptions.map(level => {
      const form = this.createEducationForm(level);
      const data = this.mapBackendToFrontend(educationDetails, level);
      form.patchValue(data);
      return form;
    });
 
    // Set visibleForms based on the number of education levels with data
    this.visibleForms = this.educations.filter(form =>
      form.get('institute')?.value || form.get('status')?.value
    ).length || this.educationOptions.length;
  }
 
  createEducationForm(level: string): FormGroup {
    const form = this.formBuilder.group({
      level: [level, Validators.required],
      status: ['', Validators.required],
      institute: ['', [Validators.required, textFieldValidator()]],
      // Initially no validators for conditional fields
      specialization: [''],
      pursuingClass: [''],
      educationBoard: [''],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100), percentageValidator()]],
      yearOfJoining: ['', [Validators.required, this.yearValidator()]],
      intermediateDiploma: [''],
      yearOfPassout: ['']
    }, { validator: this.validateYearOrder() }); // Keep the form-level year order validator
   
    // Add the conditional validators based on the level
    if (level === 'SSC' || level === 'Intermediate') {
      form.get('educationBoard')?.setValidators([Validators.required, textFieldValidator()]);
    }
   
    if (level !== 'SSC') {
      form.get('specialization')?.setValidators([Validators.required, textFieldValidator()]);
    }
   
    if (level === 'SSC') {
      form.get('intermediateDiploma')?.setValidators([Validators.required]);
    }
   
    // Update validity
    form.get('educationBoard')?.updateValueAndValidity();
    form.get('specialization')?.updateValueAndValidity();
    form.get('intermediateDiploma')?.updateValueAndValidity();
   
    return form;
  }
 
  yearValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const year = control.value;
      const currentYear = new Date().getFullYear();
     
      if (!year || isNaN(year)) {
        return { invalidYear: true };
      }
      if (year < 1900 || year > currentYear) {
        return { invalidYearRange: true };
      }
      return null;
    };
  }
// In your component
validateYearOrder(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const yearOfJoining = group.get('yearOfJoining')?.value;
    const yearOfPassout = group.get('yearOfPassout')?.value;
   
    if (yearOfJoining && yearOfPassout && yearOfJoining > yearOfPassout) {
      // Add the error to the yearOfPassout control directly
      group.get('yearOfPassout')?.setErrors({
        ...group.get('yearOfPassout')?.errors,
        yearOrderInvalid: true
      });
      return { yearOrderInvalid: true };
    }
    return null;
  };
}
validateEducationYearOrder(): ValidatorFn {
  return (formArray: AbstractControl): ValidationErrors | null => {
    const educationControls = (formArray as FormArray).controls;
 
    for (let i = 0; i < educationControls.length - 1; i++) {
      const currentEdu = educationControls[i];
      const nextEdu = educationControls[i + 1];
 
      const currentPassout = currentEdu.get('yearOfPassout')?.value;
      const nextJoining = nextEdu.get('yearOfJoining')?.value;
 
      if (currentPassout && nextJoining && nextJoining < currentPassout) {
        // Set the error on the next joining year control
        nextEdu.get('yearOfJoining')?.setErrors({
          ...nextEdu.get('yearOfJoining')?.errors,
          joiningYearInvalid: true,
        });
 
        return { joiningYearInvalid: true };
      }
    }
    return null;
  };
}
updateValidators(educationForm: FormGroup) {
  // Clear all conditional validators first
  educationForm.get('pursuingClass')?.clearValidators();
  educationForm.get('yearOfPassout')?.clearValidators();
  educationForm.get('intermediateDiploma')?.clearValidators();
  educationForm.get('educationBoard')?.clearValidators();
  educationForm.get('specialization')?.clearValidators();
 
  const level = educationForm.get('level')?.value;
  const status = educationForm.get('status')?.value;
 
  // Set validators only for visible/applicable fields
  if (level === 'SSC' || level === 'Intermediate') {
    educationForm.get('educationBoard')?.setValidators([Validators.required, textFieldValidator()]);
  }
 
  if (level !== 'SSC') {
    educationForm.get('specialization')?.setValidators([Validators.required, textFieldValidator()]);
  }
 
  if (level === 'SSC') {
    educationForm.get('intermediateDiploma')?.setValidators([Validators.required]);
  }
 
  if (status === 'pursuing') {
    educationForm.get('yearOfPassout')?.setValidators([Validators.required, this.expectedPassoutYearValidator()]);
  } else if (status === 'completed') {
    educationForm.get('yearOfPassout')?.setValidators([Validators.required, this.yearValidator()]);
  }
  if(status=== 'pursuing' && level === 'SSC'){
    educationForm.get('pursuingClass')?.setValidators([Validators.required]);
  }
 
  // Update validity for all fields
  educationForm.get('pursuingClass')?.updateValueAndValidity();
  educationForm.get('yearOfPassout')?.updateValueAndValidity();
  educationForm.get('intermediateDiploma')?.updateValueAndValidity();
  educationForm.get('educationBoard')?.updateValueAndValidity();
  educationForm.get('specialization')?.updateValueAndValidity();
}
 
 
getErrorMessage(control: AbstractControl, fieldName: string): string {
  if (!control.errors) return '';
 
  if (control.errors['textField']) {
    if (control.errors['textField'].hasSpecialCharsOrNumbers) {
      return `${fieldName} should only contain letters`;
    }
    if (control.errors['textField'].isTooLong) {
      return `${fieldName} should not exceed 100 characters`;
    }
  }
 
  if (control.errors['percentage']) {
    return 'Please enter a valid number';
  }
 
  if (control.errors['required']) {
    return `${fieldName} is required`;
  }
 
  if (control.errors['invalidYear'] || control.errors['invalidYearRange']) {
    return `Please enter a valid year between 1900 and ${this.currentYear}`;
  }
 
  if (control.errors['yearOrderInvalid']) {
    return 'Passing year must be after joining year';
  }
 
  if (control.errors['expectedYearInvalid']) {
    return 'Expected passing year must be in the future';
  }
 
if (control.errors['joiningYearInvalid']) {
  return 'Joining year must be equal to or after previous education passing year';
}
 
  return '';
}
  currentYear: number = new Date().getFullYear();
 
  shouldShowForm(index: number): boolean {
    // if (index === 0) return true;
    // const previousForm = this.educations[index - 1];
    // return previousForm.get('status')?.value === 'completed';
    return index < this.visibleForms;
  }
 
  showPursuingClass(form: FormGroup): boolean {
    return form.get('level')?.value === 'SSC' && form.get('status')?.value === 'pursuing';
  }
 
  showExpectedPassout(form: FormGroup): boolean {
    return form.get('status')?.value === 'pursuing';
  }
 
 
  showYearOfPassout(form: FormGroup): boolean {
    return form.get('status')?.value !== 'pursuing';
  }
  onStatusChange(index: number) {
    const form = this.educations[index];
    const status = form.get('status')?.value;
    const level = form.get('level')?.value;
   
    // Clear yearOfPassout and pursuingClass validators
    form.get('yearOfPassout')?.clearValidators();
    form.get('pursuingClass')?.clearValidators();
   
    // Set validators based on status
    if (status === 'pursuing') {
      form.get('yearOfPassout')?.setValidators([
        Validators.required,
        this.expectedPassoutYearValidator(),
        // Add your year order validation here if needed
      ]);
    } else if (status === 'completed') {
      form.get('yearOfPassout')?.setValidators([
        Validators.required,
        this.yearValidator()
        // Add your year order validation here if needed
      ]);
    }
    else if(status==='pursuing' && level==='SSC'){
      form.get('pursuingClass')?.setValidators([Validators.required]);
    }
   
    // Update validity
    form.get('yearOfPassout')?.updateValueAndValidity();
    form.get('pursuingClass')?.updateValueAndValidity();
   
    // Re-apply the form-level validator for year order
    const formGroup = this.educations[index];
    formGroup.setValidators(this.validateYearOrder());
    formGroup.updateValueAndValidity();
   
    // Validate across all visible education forms
    this.validateEducationForms();
  }

 
  updateAllEducations() {
    this.validateEducationForms();
    if (!this.validateBeforeSubmit()) {
      console.error('Form validation failed');
      return; // Stop here if validation fails
    }
    if (this.educationId) {
      const educationData = this.mapFrontendToBackend();
      this.profiledetailsservice.updateEducation(this.educationId, educationData).subscribe(
        response => {
          console.log('Education details updated successfully:', response);
          this.snackBar.open('Education details updated successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar']
          });
          this.isEditing = false;
          this.disableAllForms();
        },
        error => {
          console.error('Error updating education details:', error);
        }
      );
    }
  }
 
 
  saveDetails(educationForm: FormGroup) {
    if (!this.validateBeforeSubmit()) {
      console.error('Form validation failed');
      return; // Stop execution if validation fails
    }
    if (educationForm.valid) {
      const payload = this.preparePayload(educationForm);
      educationForm.patchValue({ isSaved: true });
      educationForm.disable();
    }
   
  }
  expectedPassoutYearValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passoutYear = control.value;
      const currentYear = new Date().getFullYear();
 
      if (!passoutYear || isNaN(passoutYear)) {
        return { invalidYear: true };
      }
      if (passoutYear < currentYear) {
        return { expectedYearInvalid: true };
      }
      return null;
    };
  }
 
  preparePayload(educationForm: FormGroup) {
    const payload: any = {};
    const level = educationForm.get('level')?.value;
 
    const fieldMappings: { [key: string]: { [key: string]: string } } = {
      'SSC': {
        status: 'schoolStatus',
        institute: 'schoolName',
        educationBoard: 'schoolEducationBoard',
        pursuingClass: 'pursuingClass',
        percentage: 'schoolPercentage',
        yearOfJoining: 'schoolYearOfJoining',
        yearOfPassout: 'schoolYearOfPassout',
        intermediateDiploma: 'intermediatedimploma'
 
      },
      'Intermediate/Diploma': {
        status: 'intermediateStatus',
        institute: 'intermediateCollegeName',
        educationBoard: 'intermediateEducationBoard',
        specialization: 'intermediateCollegeSpecialization',
        percentage: 'intermediateCollegePercentage',
        yearOfJoining: 'intermediateYearOfJoining',
        yearOfPassout: 'intermediateYearOfPassout'
      },
      'Graduation': {
        status: 'graduationStatus',
        institute: 'graduationCollegeName',
        specialization: 'graduationCollegeSpecialization',
        percentage: 'graduationCollegePercentage',
        yearOfJoining: 'graduationYearOfJoining',
        yearOfPassout: 'graduationYearOfPassout'
      },
      'Post Graduation': {
        status: 'postGraduateStatus',
        institute: 'postGraduateCollegeName',
        specialization: 'postGraduateCollegeSpecialization',
        percentage: 'postGraduateCollegePercentage',
        yearOfJoining: 'postGraduateYearOfJoining',
        yearOfPassout: 'postGraduateYearOfPassout'
      }
    };
 
    if (level && fieldMappings[level]) {
      Object.keys(fieldMappings[level]).forEach(key => {
        const backendKey = fieldMappings[level][key];
        const formValue = educationForm.get(key)?.value;
        if (formValue !== undefined && formValue !== null) {
          payload[backendKey] = formValue;
        }
      });
    }
 
    const currentId = educationForm.get('id')?.value;
    if (currentId) {
      payload['id'] = currentId;
    }
 
    console.log('Prepared payload:', payload); // Debugging
 
    return payload;
  }
 
  isOptionSelected(option: string): boolean {
    return this.educationOptions.includes(option);
  }
 
  isDetailsFilled(educationForm: FormGroup): boolean {
    return educationForm.valid;
  }
validateEducationForms() {
  // For each visible form, check if it's valid
  for (let i = 0; i < this.visibleForms - 1; i++) {
    const currentForm = this.educations[i];
    const nextForm = this.educations[i + 1];
   
    // Only check forms that are actually visible/applicable
    if (this.shouldShowForm(i) && this.shouldShowForm(i + 1)) {
      const currentPassout = currentForm.get('yearOfPassout')?.value;
      const nextJoining = nextForm.get('yearOfJoining')?.value;
     
      if (currentPassout && nextJoining && nextJoining < currentPassout) {
        nextForm.get('yearOfJoining')?.setErrors({
          ...nextForm.get('yearOfJoining')?.errors,
          joiningYearInvalid: true
        });
      } else {
        // Clear this specific error if it's fixed
        const errors = nextForm.get('yearOfJoining')?.errors;
        if (errors) {
          delete errors['joiningYearInvalid'];
         
          // If no errors left, set to null
          if (Object.keys(errors).length === 0) {
            nextForm.get('yearOfJoining')?.setErrors(null);
          } else {
            // Otherwise update with remaining errors
            nextForm.get('yearOfJoining')?.setErrors(errors);
          }
        }
      }
    }
  }
}
onYearOfJoiningChange(index: number) {
  // Get the current form
  const currentForm = this.educations[index];
 
  // If this is not the first form, validate against previous form
  if (index > 0) {
    // Find the previous form that has data
    let prevIndex = index - 1;
    while (prevIndex >= 0) {
      const prevForm = this.educations[prevIndex];
      if (prevForm.get('institute')?.value && prevForm.get('yearOfPassout')?.value) {
        const prevPassoutYear = parseInt(prevForm.get('yearOfPassout')?.value);
        const currentJoiningYear = parseInt(currentForm.get('yearOfJoining')?.value);
       
        if (currentJoiningYear <= prevPassoutYear) {
          // Set error manually
          currentForm.get('yearOfJoining')?.setErrors({
            joiningYearInvalid: true
          });
          currentForm.get('yearOfJoining')?.markAsTouched();
        }
        break;
      }
      prevIndex--;
    }
  }
 
  // Validate the entire sequence
  this.validateEducationForms();
}
 
  submitAllEducations() {
    console.log('Submitting all educations');
    this.validateEducationForms();
    const educationData = this.mapFrontendToBackend();
    console.log('Education data to submit:', educationData);
    this.profiledetailsservice.createEducation(this.currentUserId!, educationData).subscribe(
      response => {
        console.log('Education details created successfully:', response);
        // alert("Education details uploaded succesfully");
        this.snackBar.open('Education details uploaded successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['success-snackbar']
        });
        this.educationId = response.id;
        this.disableAllForms();
      },
      error => {
        console.error('Error creating education details:', error);
      }
    );
 
  }
 
  enableEditing() {
    this.isEditing = true;
    this.educations.forEach(form => form.enable());
  }
 
  cancelEditing() {
    this.isEditing = false;
    this.getEducationDetails();
  }
 
  disableAllForms() {
    console.log('Disabling all forms');
    this.educations.forEach(form => form.disable());
  }
  areAllFormsValid(): boolean {
    const isValid = this.educations.every(form => form.valid);
    console.log('Are all forms valid:', isValid);
    return isValid;
  }
  validateBeforeSubmit(): boolean {
    // Run the sequence validation first
    validateEducationSequence(this.educations);
   
    let isValid = true;
 
    this.educations.forEach((form, index) => {
      if (index < this.visibleForms) {
        Object.keys(form.controls).forEach(key => {
          const control = form.get(key);
          if (control) {
            control.markAsTouched();
            control.markAsDirty();
            control.updateValueAndValidity();
          }
        });
       
        if (!form.valid) {
          isValid = false;
          // Log errors for debugging
          console.log(`Form ${index} errors:`, form.errors);
          Object.keys(form.controls).forEach(key => {
            if (form.get(key)?.errors) {
              console.log(`Field ${key} has errors:`, form.get(key)?.errors);
            }
          });
        }
      }
    });
 
    return isValid;
  }
  mapFrontendToBackend(): any {
    const backendData: any = { id: this.educationId };
    this.educations.forEach(form => {
      const formValue = form.getRawValue();
      switch (formValue.level) {
        case 'SSC':
          backendData.schoolStatus = formValue.status;
          backendData.schoolName = formValue.institute;
          backendData.schoolPercentage = formValue.percentage;
          backendData.schoolYearOfJoining = formValue.yearOfJoining;
          backendData.schoolYearOfPassout = formValue.yearOfPassout;
          backendData.schoolEducationBoard = formValue.educationBoard;
          backendData.pursuingClass = formValue.pursuingClass;
          backendData.intermediateDiploma = formValue.intermediateDiploma;
          break;
        case 'Intermediate/Diploma':
          backendData.intermediateStatus = formValue.status;
          backendData.intermediateCollegeName = formValue.institute;
          backendData.intermediateEducationBoard = formValue.educationBoard;
          backendData.intermediateCollegeSpecialization = formValue.specialization;
          backendData.intermediateCollegePercentage = formValue.percentage;
          backendData.intermediateYearOfJoining = formValue.yearOfJoining;
          backendData.intermediateYearOfPassout = formValue.yearOfPassout;
          break;
        case 'Graduation':
          backendData.graduationStatus = formValue.status;
          backendData.graduationCollegeName = formValue.institute;
          backendData.graduationCollegeSpecialization = formValue.specialization;
          backendData.graduationCollegePercentage = formValue.percentage;
          backendData.graduationYearOfJoining = formValue.yearOfJoining;
          backendData.graduationYearOfPassout = formValue.yearOfPassout;
          break;
        case 'Post Graduation':
          backendData.postGraduateStatus = formValue.status;
          backendData.postGraduateCollegeName = formValue.institute;
          backendData.postGraduateCollegeSpecialization = formValue.specialization;
          backendData.postGraduateCollegePercentage = formValue.percentage;
          backendData.postGraduateYearOfJoining = formValue.yearOfJoining;
          backendData.postGraduateYearOfPassout = formValue.yearOfPassout;
          break;
      }
    });
    return backendData;
  }
 
  mapBackendToFrontend(backendData: any, level: string): any {
    const frontendData: any = {};
    switch (level) {
      case 'SSC':
        frontendData.status = backendData.schoolStatus;
        frontendData.institute = backendData.schoolName;
        frontendData.percentage = backendData.schoolPercentage;
        frontendData.yearOfJoining = backendData.schoolYearOfJoining;
        frontendData.yearOfPassout = backendData.schoolYearOfPassout;
        frontendData.pursuingClass = backendData.pursuingClass;
        frontendData.educationBoard = backendData.schoolEducationBoard;
        frontendData.intermediateDiploma = backendData.intermediateDiploma;
 
        break;
      case 'Intermediate/Diploma':
        frontendData.status = backendData.intermediateStatus;
        frontendData.institute = backendData.intermediateCollegeName;
        frontendData.specialization = backendData.intermediateCollegeSpecialization;
        frontendData.educationBoard = backendData.intermediateEducationBoard;
        frontendData.percentage = backendData.intermediateCollegePercentage;
        frontendData.yearOfJoining = backendData.intermediateYearOfJoining;
        frontendData.yearOfPassout = backendData.intermediateYearOfPassout;
        break;
      case 'Graduation':
        frontendData.status = backendData.graduationStatus;
        frontendData.institute = backendData.graduationCollegeName;
        frontendData.specialization = backendData.graduationCollegeSpecialization;
        frontendData.percentage = backendData.graduationCollegePercentage;
        frontendData.yearOfJoining = backendData.graduationYearOfJoining;
        frontendData.yearOfPassout = backendData.graduationYearOfPassout;
        break;
      case 'Post Graduation':
        frontendData.status = backendData.postGraduateStatus;
        frontendData.institute = backendData.postGraduateCollegeName;
        frontendData.specialization = backendData.postGraduateCollegeSpecialization;
        frontendData.percentage = backendData.postGraduateCollegePercentage;
        frontendData.yearOfJoining = backendData.postGraduateYearOfJoining;
        frontendData.yearOfPassout = backendData.postGraduateYearOfPassout;
        break;
    }
    return frontendData;
  }
 
  
  // =============================== experience ==============================
  private readonly COMPANY_NAME_PATTERN = /^[a-zA-Z\s]+$/;
private readonly ROLE_PATTERN = /^[a-zA-Z\s!@#$%^&*(),.?":{}|<>_-]+$/;
private readonly MAX_DESCRIPTION_LENGTH = 1500;
 
  initializeExperience() {
    this.addExperienceCard();
  }
 
  experienceStates: Map<number, { isEditing: boolean }> = new Map();
 
  toggleEndDate(index: number) {
    const experience = this.experience[index];
    if (experience && experience.currentlyWorking) {
      experience.workEndDate = null;
    }
    console.log('Toggled end date for experience:', experience);
  }
 
  addExperienceCard() {
    if (this.experience.length < 5) {
      const newExperience: WorkExperience1 = {
        id: 0,
        workCompanyName: '',
        workRole: '',
        workStartDate: '',
        workEndDate: null,
        workDescription: '',
        currentlyWorking: false
      };
      this.experience.push(newExperience);
      this.experienceStates.set(this.experience.length - 1, { isEditing: true });
      this.visibleCardCount = this.experience.length;
    }
  }
  
  saveDetails2(index: number) {
    if (!this.isDetailsFilledExperience(index)) {
        console.error('Cannot save. Please fill all required fields.');
        return;
    }

    const experience = this.experience[index];
    console.log('Saving experience details:', experience);

    if (this.personalDetailsId && experience) {
        if (experience.id === 0) {
            this.profiledetailsservice.createWorkExperience(this.currentUserId, experience).subscribe(
                {next:(createdExperience) => {
                    console.log('Experience saved successfully:', createdExperience);
                    this.snackBar.open('Experience uploaded successfully!', 'Close', {
                      duration: 3000, 
                      verticalPosition: 'top', 
                      horizontalPosition: 'center', 
                      panelClass: ['success-snackbar']
                    });
                    this.experience[index] = createdExperience;
                    this.experienceStates.set(index, { isEditing: false });
                },
                error:(error) => {
                    console.error('Error saving experience:', error);
                }}
            );
        } else {
            this.profiledetailsservice.updateWorkExperience(experience.id, experience).subscribe(
                {next:(updatedExperience) => {
                    console.log('Experience updated successfully:', updatedExperience);
                    this.snackBar.open('Education details uploaded successfully!', 'Close', {
                      duration: 3000,
                      verticalPosition: 'top',
                      horizontalPosition: 'center',
                      panelClass: ['success-snackbar']
                    });
                    this.experience[index] = updatedExperience;
                    this.experienceStates.set(index, { isEditing: false });
                },
                error:(error) => {
                    console.error('Error updating experience:', error);
                }}
            );
        }
    } else {
        console.error('No personal details ID found or experience is null. Unable to save experience.');
    }
}

 
  fetchAllExperienceDetails() {
    console.log('Fetching all experience details...');
    this.profiledetailsservice.getAllWorkExperiences(this.currentUserId).subscribe(
      {next:(experiences) => {
        console.log('Received experiences:', experiences);
        experiences.forEach((exp, index) => {
          if (index < 3) {
            this.experience[index] = exp;
            this.experienceStates.set(index, { isEditing: false });
          }
        });
      },
      error:(error) => {
        console.error('Error fetching work experiences:', error);
      }}
    );
  }
 
 
  fetchExperienceDetails(id: number, index: number) {
    this.profiledetailsservice.getWorkExperience(id, this.currentUserId).subscribe(
      {next:(experienceDetails) => {
        this.experience[index] = experienceDetails;
        this.experienceStates.set(index, { isEditing: false });
      },
      error:(error) => console.error('Error fetching experience details:', error)}
    );
  }
  isDetailsFilledExperience(index: number): boolean {
    const experience = this.experience[index];
    if (!experience) return false;
  
    // Check if either end date or currently working is selected
    const hasEndDateOrCurrentlyWorking = experience.workEndDate || experience.currentlyWorking;
    
    const isFilled = !!(
      experience.workCompanyName.trim() &&
      experience.workRole.trim() &&
      experience.workDescription.trim() &&
      experience.workStartDate &&
      hasEndDateOrCurrentlyWorking // Either end date or currently working is required
    );
  
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      invalidFields: !isFilled,
      missingEndDateOrCurrentlyWorking: !hasEndDateOrCurrentlyWorking
    };
  
    return isFilled;
  }
 
  toggleEditExperience(index: number) {
    const currentState = this.experienceStates.get(index) || { isEditing: false };
    this.experienceStates.set(index, { isEditing: !currentState.isEditing });
  }
  toggleCanceleditExperience(index: number) {
    this.experienceStates.set(index, { isEditing: false });
    console.log('Cancelled edit for experience', index);
    this.fetchExperienceDetails(this.experience[index].id, index);
  }
  isGraduationCompleted(): boolean {
    const graduationForm = this.educations.find(form => form.get('level')?.value === 'Graduation');
    return graduationForm?.get('status')?.value === 'completed';
  }
 
  setExperienceTab() {
    if (this.isGraduationCompleted()) {
      this.currentTab = 'Experience';
    }
  }
  isCurrentlyWorkingAvailable(index: number): boolean {
    return !this.experience.some((exp, i) => i !== index && exp.currentlyWorking);
  }

  experienceErrors: { [key: number]: ExperienceErrors } = {};
  validateEndDate(index: number) {
    const experience = this.experience[index];
  
    // Check if End Date is before Start Date
    if (experience.workStartDate && experience.workEndDate && experience.workEndDate < experience.workStartDate) {
      this.experienceErrors[index] = { ...this.experienceErrors[index], invalidDate: true };
      experience.workEndDate = ''; // Reset invalid date
    } else {
      this.experienceErrors[index] = { ...this.experienceErrors[index], invalidDate: false };
    }
  
    // Check if either End Date is filled or Currently Working is checked
    if (!experience.workEndDate && !experience.currentlyWorking) {
      this.experienceErrors[index] = { ...this.experienceErrors[index], missingEndDateOrCurrentlyWorking: true };
    } else {
      this.experienceErrors[index] = { ...this.experienceErrors[index], missingEndDateOrCurrentlyWorking: false };
    }
  }
  
  
  // Handle "Currently Working" checkbox
  handleCurrentlyWorkingChange(index: number) {
    const experience = this.experience[index];
    if (experience.currentlyWorking) {
      experience.workEndDate = null; 
      this.experience.forEach((exp, i) => {
        if (i !== index) exp.currentlyWorking = false; // Only one "Currently Working" allowed
      });
    }
  }
  isAnyCurrentlyWorking(): boolean {
    return this.experience.some(exp => exp.currentlyWorking);
  }

// Function to determine the minimum allowed start date for the next experience entry
getMinStartDate(index: number): string | null {
  if (index > 0) {
    const previousEndDate = this.experience[index - 1]?.workEndDate;
    if (previousEndDate) {
      return previousEndDate; // Next job must start after the previous job ended
    }
  }
  return null;
}

// Validate Start Date dynamically
validateStartDate(index: number) {
  if (index > 0) {
    const previousEndDate = this.experience[index - 1]?.workEndDate;
    if (this.experience[index].workStartDate && previousEndDate &&
        this.experience[index].workStartDate <= previousEndDate) {
      this.experienceErrors[index] = { invalidStartDate: true };
      this.experience[index].workStartDate = ''; // Reset invalid date
    } else {
      this.experienceErrors[index] = { invalidStartDate: false };
    }
  }
}
validateCompanyName(event: any, index: number): void {
  const input = event.target.value;
  if (!this.COMPANY_NAME_PATTERN.test(input)) {
    event.target.value = input.replace(/[^a-zA-Z\s]/g, '');
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      invalidCompanyName: true
    };
  } else {
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      invalidCompanyName: false
    };
  }
}

validateRole(event: any, index: number): void {
  const input = event.target.value;
  if (!this.ROLE_PATTERN.test(input)) {
    event.target.value = input.replace(/[^a-zA-Z\s]/g, '');
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      invalidRole: true
    };
  } else {
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      invalidRole: false
    };
  }
}

validateDescription(event: any, index: number): void {
  const input = event.target.value;
  if (input.length > this.MAX_DESCRIPTION_LENGTH) {
    event.target.value = input.substring(0, this.MAX_DESCRIPTION_LENGTH);
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      descriptionTooLong: true
    };
  } else {
    this.experienceErrors[index] = {
      ...this.experienceErrors[index],
      descriptionTooLong: false
    };
  }
}
  // ============================ chnage password ===============================

  savePassword(email: string): void {
    if (this.changePasswordForm.invalid) {
      // Show specific validation errors
      if (this.changePasswordForm.get('currentPassword')?.errors?.['required']) {
        alert('Current password is required');
        return;
      }
 
      const newPasswordControl = this.changePasswordForm.get('newPassword');
      if (newPasswordControl?.errors) {
        if (newPasswordControl.errors['required']) {
          alert('New password is required');
          return;
        }
        if (newPasswordControl.errors['pattern']) {
          alert('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
          return;
        }
      }
 
      if (this.changePasswordForm.get('confirmPassword')?.errors?.['required']) {
        alert('Confirm password is required');
        return;
      }
 
      if (this.changePasswordForm.errors?.['passwordsMismatch']) {
        alert(' New password and confirm password should be same');
        return;
      }
 
      this.changePasswordForm.markAllAsTouched();
      return;
    }
 
    const currentPassword = this.changePasswordForm.get('currentPassword')?.value;
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
 
    this.http.put(
      `${environment.apiBaseUrl}/user/update-password`,
      null,
      {
        params: {
          email: email,
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        responseType: 'text'
      }
    ).subscribe({
      next: (response: string) => {
        if (response.includes('Password updated successfully')) {
          this.snackBar.open('Password updated  successfully!', 'Close', {
            duration: 3000, 
            verticalPosition: 'top', 
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'] 
          });
          this.changePasswordForm.reset();
        } else {
          alert('Unexpected response while changing password');
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'string') {
          if (error.error.includes('current password is not matching')) {
            alert('Your current password is incorrect.');
          } else {
            alert(error.error);
          }
        } else {
          alert('An error occurred while changing the password. Please try again.');
        }
      }
    });
  }
 
  getPasswordValidationMessage(): string {
    const passwordControl = this.changePasswordForm.get('newPassword');
    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        alert('New password is required');
        return 'New password is required';
 
      }
      if (passwordControl.errors['pattern']) {
        alert('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
        return 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
 
      }
    }
    return '';
  }
 
  checkPasswords(): void {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;
    this.passwordsMatch = newPassword === confirmPassword;
  }
  toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
 
 
}