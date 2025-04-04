import { CommonModule } from '@angular/common';

import { Component, HostListener } from '@angular/core';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { JobAdmin, JobAdminService, Recruiter } from '../../job-admin.service';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';

 



import * as L from 'leaflet';/*---------PopupMap--------*/





interface Section {

  // backgroundImage: SafeUrl | string;

  title: string;

  description: string;

  additionalInfo?: { [key: string]: string };



}


export interface NewJob {

  jobTitle: string;

  jobDescription: string;

  requiredSkills: string;

  location: string;

  minSalary?: number;

  maxSalary?: number;

  jobType?: string;

  status?: string;

  vacancyCount?: number;

  appliedCount?: number;

  numberOfLevels?: number;

}



// Updated interface with required fields

interface RecruiterWithTimestamp {

  recruiterId?: number;

  recruiterName: string;

  recruiterEmail: string;

  recruiterPassword: string;

  recruiterRole: string;

  recruiterDeportment: any;

  createdAt: number[];  // Make it required here

  relativeTime: string;

  showOptions: boolean;

}



interface Job {

  jobAdmin: {

    recruiterName: any;

  };

  id: number;

  jobTitle: string;

  jobDescription: string;

  requiredSkills: string;

  location: string;

  minSalary?: number;

  maxSalary?: number;

  jobType?: string;

  status?: string;

  vacancyCount?: number;

  appliedCount?: number;

  createdAt: number[];  // Make it required here

  role?: string; // Optional if it may not always be present

  releaseDate: string;

  name?: string;

  company?: string;

  recruiter?: string;

  daysAgo?: number;

  basicJobQualification: string;

  primaryRoles: string;

  mainResponsibilities: string;



}





@Component({

  selector: 'app-job-admin',

  standalone: true,

  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink,ToastModule,

    ButtonModule],

  templateUrl: './job-admin.component.html',

  styleUrl: './job-admin.component.css',

  providers: [MessageService]

})

export class JobAdminComponent {

  jobForm: FormGroup;

  loginForm!: FormGroup;

  recruiterupdateForm: FormGroup;

  recruiters: Recruiter[] = [];

  getJobAdminById: any;

  jobAdmin: JobAdmin | null = null;

  companyForm!: FormGroup;

  errorMessage = '';

  isLoading = false;

  successMessage = '';

  isPopupVisible = false;

  submitted = false;



  interviews: any[] = [];





  // sections: any = { about: {} };

  companyLocation: string = '';

  companyStrength: any = '';

  companyGstNumber: any = '';

  jobAdminEmail: string = '';

  companyLicense: any = '';

  jobAdminCompanyName: string = '';

  companyName: string = '';

  companyPhoneNumber: any = '';

  companyAboutDescription: any = '';

  companyOverviewDescription: any = '';

  companyLogo: SafeUrl = '';  // Declare companyLogo as SafeUrl type

  companyLatitude: number = 0;

  companyLongitude: number = 0;

  // descriptionBackground: SafeUrl | string = "url('https://img.freepik.com/free-photo/skyscraper-architecture-shines-generative-ai-sunset-generative-ai_188544-15489.jpg')";

  // aboutBackground: SafeUrl | string = "url('https://images.unsplash.com/photo-1569470451072-68314f596aec?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D')";

  sectionToScroll: any;

  recruiterId!: number;

  ;

  // addJobBackground: SafeUrl | string = "url('https://wallpaper-house.com/data/out/9/wallpaper2you_319693.jpg')";

  // overviewBackground: SafeUrl | string = "url('https://wallpaper-house.com/data/out/9/wallpaper2you_319693.jpg')";

  // contactBackground: SafeUrl | string = "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff2ca5d0-5633-4ef7-b22f-934c6516d5f0/d6iuhnh-22a84a73-8669-48aa-aaac-47e886276b7c.jpg')";

  private interval: any;

  recruiterUpdateForm: any;

  isSubmitting: any;

  showRecruiterView = false;

  selectedRecruiter: Recruiter | null = null;



  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,

    private http: HttpClient, private sanitizer: DomSanitizer,

    private jobAdminService: JobAdminService,  private messageService: MessageService

  ) {

    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]]

    });



    this.companyForm = this.fb.group({

      companyLogo: [null, Validators.required],

      companyDescription: ['', [

        Validators.required,

        Validators.minLength(10),

        Validators.maxLength(1500),

        // Validators.pattern(/^[A-Za-z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)

      ]],

      companyTypeOfIndustry: ['', [Validators.required, Validators.minLength(2),

      Validators.maxLength(100)]],

      companyWebsiteLink: ['', [Validators.required, Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/i)]],



      companyStrength: [null, [Validators.required, Validators.min(1), Validators.max(10000000000)]],      companyLocation: ['', [

        Validators.required,               // Field cannot be empty

        Validators.minLength(3),           // Minimum length of 3 characters

        Validators.maxLength(10000000)          // Maximum length of 200 characters

      ]],

      companyLicense: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],



      companyLicenseDocument: [null],

      // companyGstNumber: ['', [Validators.required, Validators.pattern('^[0-9A-Z]{15}$')]], // Example GST pattern

      companyGstNumber: ['', [

        Validators.required,

        Validators.minLength(3),

        Validators.maxLength(100)

      ]], // Example GST pattern

      companyGstDocument: [null],

      // companyCinNumber: ['', [Validators.required, Validators.pattern('^[A-Z]{2}[0-9]{4}[A-Z]{5}[0-9]{3}$')]], // CIN pattern example

      companyCinNumber: ['', [

        Validators.required,

        Validators.minLength(3),

        Validators.maxLength(100)

      ]],

      companyCinDocument: [null],

      companyPhoneNumber: ['', [

        Validators.required,

        Validators.pattern('^[0-9]{10}$'),

        Validators.minLength(10),

        Validators.maxLength(10)

      ]],



      companyAboutDescription: ['', [

        Validators.required,

        Validators.minLength(10),

        Validators.maxLength(1500),

        // Validators.pattern(/^[A-Za-z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)

      ]],



      companyOverviewDescription: ['', [

        Validators.required,

        Validators.minLength(10),

        Validators.maxLength(1500),

        // Validators.pattern(/^[A-Za-z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/)

      ]],

      descriptionBackground: [null],

      aboutBackground: [null],

      addJobBackground: [null],

      overviewBackground: [null],

      contactBackground: [null]

    });





    this.recruiterForm = this.fb.group({

      recruiterName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.minLength(3), Validators.maxLength(32)]],

      recruiterEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com$')]],

      recruiterPassword: ['', [Validators.required, Validators.minLength(8)]],
      recruiterDeportment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      recruiterRole: ['', Validators.required] // Role is required
    });


    this.recruiterupdateForm = this.fb.group({

      id: [0, Validators.required],

      recruiterName: ['', Validators.required],

      recruiterEmail: ['', [Validators.required, Validators.email]],

      recruiterPassword: ['', Validators.required],

      recruiterRole: ['', Validators.required]

    });





    this.jobForm = this.fb.group({

      jobTitle: ['', [

        Validators.required,           // Makes the field mandatory

        Validators.minLength(3),       // Minimum length of 3 characters

        Validators.maxLength(100),      // Maximum length of 50 characters

        // Validators.pattern(/^[A-Za-z\s]*$/) // Only allows letters and spaces

      ]],

      jobDescription: [

        '',

        [

          Validators.required,

          Validators.minLength(3),

          Validators.maxLength(1500),

          // Validators.pattern(/^[A-Za-z\s]*$/) // Only allows letters and spaces

        ]

      ],

      basicJobQualification: ['', Validators.required],

      primaryRoles: ['', Validators.required],

      mainResponsibilities: ['', Validators.required],



      requiredSkills: [

        '',

        [

          Validators.required,

          Validators.minLength(3),

          Validators.maxLength(500),

          // Validators.pattern(/^[A-Za-z\s]*$/), // Only allows letters and spaces

        ],

      ],



      location: [

        '',

        [

          Validators.required,

          Validators.minLength(3),

          Validators.maxLength(100),

          // Validators.pattern(/^[A-Za-z0-9\s]*$/), // Allows letters, numbers, and spaces

        ],

      ],



      minSalary: [

        '',

        [

          Validators.required,             // Salary is required

          Validators.min(100),            // Minimum salary should be 1000

          Validators.max(100000000),         // Maximum salary is 1,000,000

          Validators.pattern(/^\d*$/)  // Only allows digits (no negative or special characters)

        ],

      ],



      maxSalary: [

        '',

        [

          Validators.required,

          Validators.min(100), // Minimum value for salary

          Validators.max(100000000000), // Maximum value for salary

        ],

      ],



      jobType: [

        '',

        [

          Validators.required,

          Validators.minLength(3),

          Validators.maxLength(50),

          // Validators.pattern(/^[A-Za-z\s]*$/), // Only allows letters and spaces

        ],

      ],



      vacancyCount: [

        '',

        [

          Validators.required,

          Validators.min(1),    // Minimum value of 1

          Validators.max(100),  // Maximum value of 100

        ],

      ],



      requiredEducation: [

        '',

        [

          Validators.required,

          Validators.minLength(3),

          Validators.maxLength(100),

          // Validators.pattern(/^[A-Za-z\s]*$/) // Only allows letters and spaces

        ],

      ],





      requiredEducationStream: [

        '',

        [

          Validators.required,

          Validators.minLength(1),

          Validators.maxLength(100),

          // Validators.pattern(/^[A-Za-z\s]*$/), // Only allows letters and spaces

        ],

      ],



      requiredPercentage: [

        null,

        [

          Validators.required,

          Validators.min(0),  // Minimum allowed value is 0

          Validators.max(100) // Maximum allowed value is 100

        ]

      ],



      requiredPassoutYear: [

        '',

        [

          Validators.required,

          Validators.min(1900), // Year cannot be before 1900

          Validators.max(new Date().getFullYear()), // Year cannot be in the future

          Validators.pattern(/^\d{4}$/), // Ensures the input is a 4-digit number

        ],

      ],



      requiredWorkExperience: [

        '',

        [

          Validators.required,

          Validators.min(1), // Minimum work experience of 1 year

          Validators.max(50), // Maximum work experience of 50 years

        ],

      ],





      numberOfLevels: [

        null,

        [

          Validators.required,

          Validators.min(1),       // Minimum value is 1

          Validators.max(100),     // Maximum value is 100

        ],

      ],

    });



  }



  adminId: number = 0;









  mapLocation: string = "N/A"







  ngOnInit(): void {

    this.adminId = Number(localStorage.getItem('adminId'));

    console.log("Admin ID:", this.adminId);



    if (this.adminId) {

      this.fetchJobAdmin(Number(this.adminId)); // Pass the adminId to fetchJobAdmin

      this.fetchRecruiters(this.adminId);

      this.fetchJobs(); // Fetch initial job postings

      this.fetchAdminJobs();


    }



    this.startRelativeTimeUpdate();



    //  -------------p-----------

    this.route.queryParams.subscribe((params) => {

      const section = params['section'];

      if (section) {

        this.sectionToScroll = section;

      }

    });
  }



  ngAfterViewInit(): void {

    // After view initialization, check if there's a section to scroll to

    if (this.sectionToScroll) {

      this.navigateTo(this.sectionToScroll);

    }

  }



  fetchJobAdmin(jobAdminId: number): void {

    this.jobAdminService.getJobAdminById(jobAdminId).subscribe(

      {next:(response: JobAdmin) => {

        console.log('Job Admin:', response);





        // Populate the form with the fetched data

        this.companyForm.patchValue({

          companyLogo: response.companyLogo,

          companyDescription: response.companyDescription,

          companyTypeOfIndustry: response.companyTypeOfIndustry,

          companyWebsiteLink: response.companyWebsiteLink,

          companyStrength: response.companyStrength,

          companyLocation: response.companyLocation,

          companyLicense: response.companyLicense,

          companyLicenseDocument: response.companyLicenseDocument,

          companyGstNumber: response.companyGstNumber,

          companyGstDocument: response.companyGstDocument,

          companyCinNumber: response.companyCinNumber,

          companyCinDocument: response.companyCinDocument,

          companyPhoneNumber: response.companyPhoneNumber,

          companyAboutDescription: response.companyAboutDescription,

          companyOverviewDescription: response.companyOverviewDescription,

          companyLatitude: response.companyLatitude,

          companyLongitude: response.companyLongitude,

        });



        // Bind additional fields for display

        this.companyName = `Welcome to ${response.jobAdminCompanyName || ''}`;

        this.companyLogo = this.sanitizer.bypassSecurityTrustUrl(

          `data:image/png;base64,${response.companyLogo}`

        );



        // Ensure additionalInfo is defined before accessing it

        if (!this.sections['about'].additionalInfo) {

          this.sections['about'].additionalInfo = {};
        }



        if (!this.sections['contact'].additionalInfo) {

          this.sections['contact'].additionalInfo = {};

        }



        this.sections['industry'].additionalInfo = this.sections['industry'].additionalInfo || {};

        this.sections['home'].additionalInfo = this.sections['home'].additionalInfo || {};



        // Set latitude and longitude if available

        this.companyLatitude = response.companyLatitude

        this.companyLongitude = response.companyLongitude





        // Assign values using bracket notation



        this.sections['about'].additionalInfo['Strength'] = response.companyStrength?.toString() || ''; // Convert to string

        this.sections['about'].additionalInfo['Location'] = response.companyLocation?.toString() || ''; // Convert to string

        this.sections['contact'].additionalInfo['GST Number'] = response.companyGstNumber || ''; // Bind GST Number

        this.sections['contact'].additionalInfo['Email'] = response.jobAdminEmail || ''; // Bind Job Admin Email

        this.sections['contact'].additionalInfo['License'] = response.companyLicense || ''; // Bind Company License (or any other relevant field)

        this.sections['contact'].additionalInfo['Phone Number'] = response.companyPhoneNumber || '';

        this.sections['home'].title = response.jobAdminCompanyName || '';

        this.companyName = "Welcome to " + response.jobAdminCompanyName || '';

        this.mapLocation = response.jobAdminCompanyName;

        //  console.log(  this.sections['home'].additionalInfo['title'])

        this.sections['industry'].additionalInfo['Type of Industry :'] = response.companyTypeOfIndustry || 'N/A'; // Bind companyTypeOfIndustry

        this.sections['home'].additionalInfo[''] = response.companyDescription || 'No description available.'; // Bind companyDescription

        this.sections['about'].additionalInfo[''] = response.companyAboutDescription || 'No description available.'; // Bind companyDescription

        this.sections['industry'].additionalInfo[''] = response.companyOverviewDescription || 'No description available.';



        this.initMap(response.companyLatitude, response.companyLongitude);/*---Popup Map------*/





        // Sanitize the logo URL

        this.companyLogo = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.companyLogo}`);

        console.log(this.companyLogo + "this is COMPANY logo")


        //   this.descriptionBackground = `url('${this.descriptionBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security", "")}')`

        // }

        // console.log(this.descriptionBackground+"this is description Background")


        // }

        // }



        // console.log(this.addJobBackground+"this is addJob Background")


       

        // console.log(this.contactBackground+"this is contact Background")



        this.checkFields(response.companyLatitude, response.companyLongitude);

      },



      error:(error: any) => {

        console.error('Error fetching Job Admin:', error);

      }}

    );

  }





  checkFields(companyLatitude: number, companyLongitude: number): void {

    let allFieldsPresent = true;



    // Check 'about' section

    if (!this.sections['about']?.additionalInfo?.['Strength'] ||

      !this.sections['about']?.additionalInfo?.['Location']) {

      allFieldsPresent = false;

    }



    // Check 'contact' section

    if (!this.sections['contact']?.additionalInfo?.['GST Number'] ||

      !this.sections['contact']?.additionalInfo?.['Email'] ||

      !this.sections['contact']?.additionalInfo?.['License'] ||

      !this.sections['contact']?.additionalInfo?.['Phone Number']) {

      allFieldsPresent = false;

    }



    // Check 'industry' section

    if (!this.sections['industry']?.additionalInfo?.['Type of Industry :']) {

      allFieldsPresent = false;

    }



    // Check 'home' section title and description

    if (!this.sections['home']?.title ||

      !this.sections['home']?.additionalInfo?.['']) {

      allFieldsPresent = false;

    }



    // Check additional description fields

    if (!this.sections['about']?.additionalInfo?.[''] ||

      !this.sections['industry']?.additionalInfo?.['']) {

      allFieldsPresent = false;

    }



    if (!companyLongitude && !companyLatitude) {

      this.router.navigate(['/JobAdminMap']);

    }



    this.isPopupVisible = !allFieldsPresent;

  }





  fetchRecruiters(jobAdminId: number): void {

    this.jobAdminService.getRecruitersByJobAdminId(jobAdminId).subscribe(

     {next:(recruiters: Recruiter[]) => {

        this.recruiters = recruiters.map(recruiter => ({

          ...recruiter,

          createdAt: recruiter.createdAt || this.getCurrentTimestamp(), // Provide default timestamp if none exists

          showOptions: false,

          relativeTime: this.getRelativeTime(recruiter.createdAt || this.getCurrentTimestamp())

        }));

        const recurter = this.recruiters.reverse();
        this.recruiters = recurter

      },

      error:(error) => {

        console.error('Error fetching recruiters:', error);

      }}

    );

  }



  // Helper method to get current timestamp in the required format

  getCurrentTimestamp(): number[] {

    const now = new Date();

    return [

      now.getFullYear(),

      now.getMonth() + 1,

      now.getDate(),

      now.getHours(),

      now.getMinutes(),

      now.getSeconds()

    ];

  }



  getRelativeTime(timestamp: number[]): string {

    const date = new Date(

      timestamp[0],

      timestamp[1] - 1,

      timestamp[2],

      timestamp[3],

      timestamp[4],

      timestamp[5]

    );



    const now = new Date();

    const timeDifference = now.getTime() - date.getTime();



    const seconds = Math.floor(timeDifference / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    const months = Math.floor(days / 30);

    const years = Math.floor(months / 12);



    if (seconds < 60) return 'Just now';

    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

    return `${years} year${years > 1 ? 's' : ''} ago`;

  }



  startRelativeTimeUpdate() {

    this.interval = setInterval(() => {

      this.recruiters.forEach(recruiter => {

        recruiter.relativeTime = this.getRelativeTime(recruiter.createdAt);

      });

    }, 60000);

  }



  formatDateFromTimestamp(timestamp: number[]): string {

    const date = new Date(

      timestamp[0],

      timestamp[1] - 1,

      timestamp[2],

      timestamp[3],

      timestamp[4],

      timestamp[5]

    );

    return date.toLocaleTimeString('en-US', {

      hour: 'numeric',

      minute: 'numeric',

      hour12: true,

      year: 'numeric',

      month: 'short',

      day: 'numeric'

    });

  }

  onSubmit() {

    this.isLoading = true;

  
    const adminId = localStorage.getItem('adminId');

    const formData = new FormData();


    if (this.companyForm.valid) {

      console.log('Form Submitted:', this.companyForm.value);



      // Add logic to process the form data (e.g., send to backend)

    } else {

      console.error('Form is invalid. Please check the fields.');

    }


    // Append each form control to FormData

    Object.keys(this.companyForm.controls).forEach(key => {

      const controlValue = this.companyForm.get(key)?.value;



      // Check if the field is a file (e.g., for file inputs)

      if (controlValue instanceof File) {

        formData.append(key, controlValue);

      } else {

        formData.append(key, controlValue ?? '');

      }

    });


    this.jobAdminService.updateCompany(+adminId!, formData).subscribe({

      next: (response: any) => {

        this.isLoading = false;

        console.log(response);


        this.messageService.add({

          severity: 'success',

          summary: 'Success',

          detail: 'Registration successful!'

        });

        this.companyForm.reset();

        window.location.reload();

      },

      error: (error: any) => {

        this.isLoading = false;


        this.messageService.add({

          severity: 'error',

          summary: 'Error',

          detail: 'Please fill in all required fields correctly'

        });

      }

    });

  }

  EditpopUp() {

    this.isPopupVisible = true;

  }





  closePopup() {

    this.isPopupVisible = false;

  }



  AdminLogout() {

    localStorage.removeItem("adminId");

    this.router.navigate(['/Job']);

  }



  sections: { [key: string]: Section } = {

    home: {

      title: '',

      description: '',

      additionalInfo: {

      },

      // backgroundImage: '',



    },

    about: {

      title: 'About Us',

      description: '',

      additionalInfo: {

        Strength: '',  // Placeholder for dynamic value

        Location: '',  // Placeholder for dynamic value

      },

      // backgroundImage: '',

    },

    contact: {

      title: 'Contact Us',

      description: 'We\'d love to hear from you! Reach out to us for any business inquiries or support needs.',

      additionalInfo: {

        'GST Number': '',  // Placeholder for dynamic value

        'Email': '',       // Placeholder for dynamic value

        'License': ''      // Placeholder for dynamic value

      },

      // backgroundImage: '',

    },

    industry: {

      title: 'Industry Overview',

      description: '',

      // additionalInfo: {

      //   'Healthcare Technology': 'Innovative software solutions to enhance healthcare management.',

      //   'Financial Services': 'Secure and scalable systems for banking and finance industries.',

      //   'Education Technology': 'Modern solutions for digital learning and online education platforms.',

      //   'Retail & E-commerce': 'Optimized digital shopping experiences and supply chain solutions.',

      // },

      // backgroundImage: '',

    },

  }



  // Method for smooth scrolling navigation

  navigateTo(section: string) {

    const element = document.getElementById(section);

    if (element) {

      const offset = 50; // Adjust the offset value as needed

      const elementPosition = element.getBoundingClientRect().top + window.scrollY;

      const offsetPosition = elementPosition - offset;



      window.scrollTo({

        top: offsetPosition,

        behavior: 'smooth'

      });

      this.isNavbarHidden = true

    }

  }



  // Method to get keys of an object for iteration

  objectKeys(obj: any): string[] {

    return Object.keys(obj);

  }



  isNavbarHidden = false;

  lastScrollTop = 0;



  @HostListener('window:scroll', [])

  onWindowScroll() {

    const scrollTop = window.scrollY || document.documentElement.scrollTop;



    // Toggle navbar visibility based on scroll direction

    if (scrollTop > this.lastScrollTop) {

      this.isNavbarHidden = true; // Scrolling down

    } else {

      this.isNavbarHidden = false; // Scrolling up

    }



    this.lastScrollTop = scrollTop;

  }





  showRecruiterForm: boolean = false;

  recruiterForm: FormGroup;







  // Show/hide recruiter form

  openRecruiterForm() {

    this.showRecruiterForm = true;

  }



  closeRecruiterForm() {

    this.showRecruiterForm = false;

  }



  isPanelMember: boolean = false;

  process:boolean = false;

  // Add recruiter and post data to the API

  addRecruiter() {





    this.process= true;

    const recruiterData = {

      recruiterName: this.recruiterForm.value.recruiterName,

      recruiterEmail: this.recruiterForm.value.recruiterEmail,

      recruiterPassword: this.recruiterForm.value.recruiterPassword,

      recruiterRole: this.recruiterForm.value.recruiterRole,

      recruiterDeportment: this.recruiterForm.value.recruiterDeportment,

    };

    console.log(recruiterData)

    // this.adminId = localStorage.getItem('adminId')

    this.http

      .post(`http://localhost:8080/api/recruiters/register/${this.adminId}`, recruiterData)

      .subscribe(

        {next:(response) => {

          console.log('Recruiter added successfully:', response);

          this.messageService.add({

            severity: 'success',

            summary: 'Success',

            detail: 'Recruiter added successfully'

          });

 

          this.closeRecruiterForm();

          this.process = false

          window.location.reload();

        },

        error:(error) => {

          console.error('Error adding recruiter:', error);

          this.process = false

          alert(error.error);

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Error adding recruiter'

          });

        }}

      );

  }

  onRoleChange(event: Event): void {

    const selectedRole = (event.target as HTMLSelectElement).value;



    if (selectedRole === 'panelmember') {

      this.isPanelMember = true;

      this.recruiterForm.get('departmentName')?.setValidators(Validators.required);

    } else {

      this.isPanelMember = false;

      this.recruiterForm.get('departmentName')?.clearValidators();

      this.recruiterForm.get('departmentName')?.setValue('');

    }

    this.recruiterForm.get('departmentName')?.updateValueAndValidity();

  }

  onRoleChange2(event: Event): void {

    const selectedRole = (event.target as HTMLSelectElement).value;



    if (selectedRole === 'panelmember') {

      this.isPanelMember = true;

      this.recruiterupdateForm.get('departmentName')?.setValidators(Validators.required);

    } else {

      this.isPanelMember = false;

      this.recruiterupdateForm.get('departmentName')?.clearValidators();

      this.recruiterupdateForm.get('departmentName')?.setValue('');

    }

    this.recruiterupdateForm.get('departmentName')?.updateValueAndValidity();

  }



  isFormOpen = false;

  newRecruiter = { name: '', email: '', role: '', password: '' };



  toggleOptions(recruiter: any) {

    recruiter.showOptions = !recruiter.showOptions;

  }



  closeOptions(recruiter: any) {

    recruiter.showOptions = false;

  }



  viewRecruiter(recruiter: Recruiter) {

    this.selectedRecruiter = recruiter;

    this.showRecruiterView = true;

    console.log(this.selectedRecruiter)

    this.recruiterupdateForm.patchValue({

      id: this.selectedRecruiter.id,

      recruiterName: this.selectedRecruiter.recruiterName,

      recruiterEmail: this.selectedRecruiter.recruiterEmail,

      recruiterPassword: this.selectedRecruiter.recruiterPassword,

      recruiterRole: this.selectedRecruiter.recruiterRole

    })

    console.log(this.recruiterupdateForm)

  }



  deleteRecruiter(recruiter: any) {

    this.recruiters = this.recruiters.filter(r => r !== recruiter);

  }



  viewJob(job: any) {

    // Implement viewing job details

  }



  viewApplicants(job: any) {

    // Implement viewing applicants for the job

  }





  // new job by admin



  selectedPage: string = 'addJob';

  jobs: Job[] = []

  Adminjobs: Job[] = [];



  // jobs: Job[] = [

  //   { "id": 1, "role": "Software Engineer", "releaseDate": "2024-11-01" },

  //   { "id": 2, "role": "Product Manager", "releaseDate": "2024-10-28" },

  //   { "id": 3, "role": "Data Scientist", "releaseDate": "2024-10-20" },

  //   { "id": 4, "role": "UX Designer", "releaseDate": "2024-10-15" },

  //   { "id": 5, "role": "QA Engineer", "releaseDate": "2024-10-10" },

  //   { "id": 6, "role": "Backend Developer", "releaseDate": "2024-10-05" },

  //   { "id": 7, "role": "Frontend Developer", "releaseDate": "2024-10-01" },

  //   { "id": 8, "role": "DevOps Engineer", "releaseDate": "2024-09-25" },

  //   { "id": 9, "role": "Technical Writer", "releaseDate": "2024-09-20" },

  //   { "id": 10, "role": "Project Manager", "releaseDate": "2024-09-15" }

  // ]





  selectPage(page: string) {

    this.selectedPage = page;

  }



  createNewJOb() {

    if (this.jobForm.invalid) {

      console.log(this.jobForm.value)

      this.messageService.add({

        severity: 'error',

        summary: 'Error',

        detail: 'Invalid job form!'

      });



      return;

    }



    const job: Job = this.jobForm.value;

    const adminId = this.adminId;



    if (adminId) {

      this.jobAdminService.createJob(adminId, job).subscribe(

        {next:(response) => {



          console.log('Job created successfully:', response);

          this.messageService.add({

            severity: 'success',

            summary: 'Success',

            detail: 'Job Created Successfully!'

          });

 

          this.jobForm.reset();

          window.location.reload();

        },

        error:(error) => {

          console.error('Error:', error);

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Error creating job'

          });

 

         }}

      );

    } else {

      this.errorMessage = 'Admin ID or Recruiter ID is missing';

    }

  }





  seeApplicants(jobId: number): void {

    console.log(`See applicants for job ID: ${jobId}`);

    // You can add more logic to handle applicants viewing

  }



  viewAdminJob(jobId: number): void {

    console.log(`View job details for job ID: ${jobId}`);

    // You can add more logic to view the full job details

  }



  /*----------------------------------------------------map---------------------------------------------------------*/

  map: any;

  // companyLatitude: number = 17.385044;

  // companyLongitude: number = 78.486671;

  address: string = '';









  initMap(latitude: number, longitude: number): void {

    if (!this.map) {

      this.map = L.map('map').setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

      }).addTo(this.map);



      L.marker([this.companyLatitude, this.companyLongitude]).addTo(this.map)

        .bindPopup(this.mapLocation)

        .openPopup();



      this.map.on('click', (e: any) => {

        this.companyLatitude = e.latlng.lat;

        this.companyLongitude = e.latlng.lng;

        this.addMarker(e.latlng.lat, e.latlng.lng);

      });

    } else {

      this.map.invalidateSize(); // Recalculate map size if already initialized

    }

  }





  // Add marker at the specified coordinates

  addMarker(lat: number, lng: number): void {

    L.marker([lat, lng]).addTo(this.map)

      .bindPopup(`Lat: ${lat}, Lng: ${lng}`)

      .openPopup();

  }



  // Function to handle address geocoding

  geocodeAddress(): void {


    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.address)}`;



    fetch(url)

      .then(response => response.json())

      .then((data: any) => {

        if (data && data.length > 0) {

          const lat = data[0].lat;

          const lon = data[0].lon;



          // Update latitude and longitude

          this.companyLatitude = parseFloat(lat);

          this.companyLongitude = parseFloat(lon);



          // Center map on new coordinates and add marker

          this.map.setView([this.companyLatitude, this.companyLongitude], 13);

          this.addMarker(this.companyLatitude, this.companyLongitude);

        } else {

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Address not found!'

          });

 

        }

      })

      .catch(error => {

        console.error('Error:', error);

        this.messageService.add({

          severity: 'error',

          summary: 'Error',

          detail: 'There was an error geocoding the address. Please try again later.'

        });



      });

  }





  updateRecruiter(): void {

    if (this.recruiterupdateForm.valid && !this.isSubmitting) {

      this.isSubmitting = true;

      this.errorMessage = '';

      this.successMessage = '';



      // Retrieve ID and form values

      const id = Number(this.recruiterupdateForm.get('id')?.value);

      const formValues = this.recruiterupdateForm.getRawValue();



      // Determine the role based on the user's selection

      const recruiterRole = formValues.recruiterRole === 'panelmember'

        ? 'panelmember'// Use department name for panelmember

        : 'Recruiter'; // Use "Recruiter" for Recruiter role



      // Construct the payload with the updated role

      const updatePayload = {

        recruiterName: formValues.recruiterName,

        recruiterEmail: formValues.recruiterEmail,

        recruiterPassword: formValues.recruiterPassword,

        recruiterRole: recruiterRole, // Dynamically set recruiter role

      };



      console.log('Updating Recruiter with Payload:', updatePayload);



      // Call the update service

      this.jobAdminService.updateRecruiterDetails(id, this.adminId, updatePayload)

        .subscribe({

          next: (response) => {

            console.log('Recruiter updated successfully:', response);

            this.messageService.add({

              severity: 'success',

              summary: 'Success',

              detail: 'Recruiter updated successfully'

            });

   



          },

          error: (error) => {

            console.error('Error updating recruiter:', error);

            this.messageService.add({

              severity: 'error',

              summary: 'Error',

              detail: 'Failed to update recruiter. Please try again.'

            });

   

          },

          complete: () => {

            this.isSubmitting = false;

          }

        });

    } else {

      this.markFormFieldsAsTouched();

      this.messageService.add({

        severity: 'error',

        summary: 'Error',

        detail: 'Please fill all required fields correctly'

      });

    }

  }



  private resetForm(): void {

    this.recruiterupdateForm.reset();

    this.isSubmitting = false;

  }



  private markFormFieldsAsTouched(): void {

    Object.keys(this.recruiterupdateForm.controls).forEach(key => {

      const control = this.recruiterupdateForm.get(key);

      control?.markAsTouched();

    });

  }



  closeRecruiterView() {

    this.showRecruiterView = false;

    this.selectedRecruiter = null;

    window.location.reload();



  }



  // updated

  isJobPopupVisible = false;

  selectedJob: Job | null = null;

  // jobPostings: Job[] = [];



  // Fetch Jobs by Admin ID

  // fetchJobs(): void {


  fetchJobs(): void {

    const adminId = Number(localStorage.getItem('adminId'));

    if (adminId) {

      this.jobAdminService.getActiveJobsByAdminId(adminId).subscribe(

       { next:(jobs: any[]) => {

          this.jobs = jobs as Job[];

          console.log('Jobs fetched:', this.jobs);

        },

        error:(error) => {

          console.error('Error fetching jobs:', error);

        }}

      );

    }

  }


  // Open Job Popup

  openJobPopup(job: Job): void {

    console.log('Opening Job Popup with job:', job);

    this.selectedJob = job;

    this.jobForm.patchValue(job); // Populate form with selected job details

    this.isJobPopupVisible = true;

  }





  // Close Job Popup

  closeJobPopup(): void {

    this.isJobPopupVisible = false;

    this.selectedJob = null;

  }



  // Update Job

  updateJob(): void {

    if (!this.selectedJob) {

      this.messageService.add({

        severity: 'error',

        summary: 'Error',

        detail: 'No job selected!'

      });



      return;

    }



    if (this.jobForm.valid) {

      const updatedJob = this.jobForm.value;

      const adminId = Number(localStorage.getItem('adminId'));



      this.jobAdminService.updateJob(this.selectedJob.id, adminId, updatedJob).subscribe({

        next: () => {

          this.messageService.add({

            severity: 'success',

            summary: 'Success',

            detail: 'Job updated successfully!'

          });

 

          this.closeJobPopup();

          this.fetchJobs();

        },

        error: (err) => {

          console.error('Error updating job:', err);

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Failed to update job'

          });

 

        },

      });

    }

  }





  // Delete Job

  deleteJob(job: Job): void {

    if (!job) {

      this.messageService.add({

        severity: 'error',

        summary: 'Error',

        detail: 'No job selected!'

      });



      return;

    }



    const adminId = Number(localStorage.getItem('adminId'));

    if (adminId) {

      this.jobAdminService.deleteJob(adminId, job.id).subscribe({

        next: () => {

          this.messageService.add({

            severity: 'success',

            summary: 'Success',

            detail: 'Job deleted successfully!'

          });

 

          this.fetchJobs();

        },

        error: (err) => {

          console.error('Error deleting job:', err);

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Failed to delete job.'

          });

 

        },

      });

    }

  }



  jobPostings: Job[] = [



  ];







  //Timestamp



  formatPostedDate(createdAt: number[]): string {

    if (!createdAt || createdAt.length < 3) return 'Date unknown';



    // Create a date from the input array

    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);

    const now = new Date();



    // Calculate the difference in time and adjust for time zone offsets

    const diffTime = now.getTime() - jobDate.getTime();

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));



    // Handle special cases

    if (diffDays === 0) return 'Today';

    if (diffDays === 1) return 'Yesterday';

    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;



    const weeks = Math.floor(diffDays / 7);

    if (diffDays < 30) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;



    const months = Math.floor(diffDays / 30);

    return `${months} month${months > 1 ? 's' : ''} ago`;

  }















  // Execute document commands for formatting
  execCommand(command: string, fieldName: string): void {
    const editor = document.getElementById(`editor-${fieldName}`) as HTMLElement;
    editor?.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let tagName: string;

        switch (command) {
            case 'bold':
                tagName = 'strong';
                break;
            case 'italic':
                tagName = 'em';
                break;
            case 'underline':
                tagName = 'u';
                break;
            case 'insertUnorderedList':
                // Create a list item and wrap the selected text in it
                const li = document.createElement('li');
                li.appendChild(range.extractContents());

                // Check if the parent is already a list item
                let parentListItem = range.commonAncestorContainer.parentElement?.closest('li');
                let ul: HTMLUListElement | null = null;

                if (parentListItem) {
                    // If already in a list item, just update the content
                    parentListItem.appendChild(li);
                } else {
                    // Otherwise, create a new unordered list and add the list item
                    ul = document.createElement('ul');
                    ul.appendChild(li);
                    range.insertNode(ul);
                }

                // Move the selection to the end of the new list item
                const newRange = document.createRange();
                newRange.setStartAfter(li);
                newRange.setEndAfter(li);
                selection.removeAllRanges();
                selection.addRange(newRange);
                return;
            // Add more cases as needed
            default:
                return;
        }

        const tag = document.createElement(tagName);
        tag.appendChild(range.extractContents());
        range.insertNode(tag);
        selection.removeAllRanges();
    }
}




  // Method to change font size

  changeFontSize(action: string, fieldName: string): void {

    const selection = window.getSelection();

    const selectedText = selection ? selection.toString() : '';

    if (selectedText && selection) {

      const span = document.createElement('span');

      span.style.fontSize = action === 'increase' ? 'larger' : 'smaller';

      span.textContent = selectedText;

      const range = selection.getRangeAt(0);

      range.deleteContents();

      range.insertNode(span);

      selection.removeAllRanges();

    }

  }



  // Change text color
  changeColor(event: Event, fieldName: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const color = selectElement.value;

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.color = color;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();
    }
}



  // Update the form control with editor content

  updateField(fieldName: string): void {

    const editor = document.getElementById(`${fieldName}`);

    const editorContent = editor ? editor.innerHTML : '';

    this.jobForm.controls[fieldName].setValue(editorContent);

  }





  // -----------------------------p---------------------------

  // Flags to control description visibility

  showFullDescriptionHome = false;

  showFullDescriptionAbout = false;

  showFullDescriptionIndustry = false;



  showFullDescription: {

    [section: string]: {

      [key: string]: boolean

    }

  } = {

      home: { description: false },

      about: { description: false },

      industry: { description: false }

    };



  // Method to get short description (first 50 words)

  getShortDescription(description: string, section: string, key: string): string {

    if (!description) return '';



    const words = description.split(' ');



    // If description is 50 words or less, return full description

    if (words.length <= 50) return description;



    // If full description is to be shown

    if (this.showFullDescription[section][key]) {

      return description;

    }



    // Return first 50 words

    return words.slice(0, 50).join(' ') + '...';

  }



  // Method to toggle description visibility

  toggleDescription(section: string, key: string) {

    // Initialize the key if it doesn't exist

    if (!this.showFullDescription[section][key]) {

      this.showFullDescription[section][key] = false;

    }



    // Toggle the visibility

    this.showFullDescription[section][key] = !this.showFullDescription[section][key];

  }



  MapEditpopUp() {

    this.router.navigate(['/JobAdminMap'])

  }



  fetchInterviews(): void {

    const apiUrl = `http://localhost:8080/api/interviews/today/admin/${this.adminId}`;

    this.http.get<any[]>(apiUrl).subscribe((data) => {

      this.interviews = data;

    });

  }



  formatTimeForInteview(timestamp: number[]): string {

    const [year, Month, date, hours, minutes] = timestamp;

    const period = hours >= 12 ? 'PM' : 'AM';

    const displayHours = hours % 12 || 12;

    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${date}-${Month}-${year} ${displayHours}:${displayMinutes} ${period}`;

  }



  // In job.component.ts

  holdJob(jobId: number): void {

    const adminid = localStorage.getItem('adminId')

    console.log("admin id", adminid)



    const status = 'inactive';  // Or dynamically set this

    this.jobAdminService.updateJobStatus(jobId, adminid, status)

      .subscribe(

        {next:(response) => {

          console.log('Job status updated successfully:', response);

          this.messageService.add({

            severity: 'success',

            summary: 'Success',

            detail: 'Job status updated successfully!'

          });

 

          window.location.reload(); // Reload the window

        },

        error:(error) => {

          console.error('Error updating job status:', error);

          this.messageService.add({

            severity: 'error',

            summary: 'Error',

            detail: 'Failed to update job status. Please try again later.'

          });

 

        }}

      );

  }



  openDropdownId: number | null = null;



  toggleDropdown(jobId: number) {

    // Toggle the dropdown: Close it if already open, or open it for the clicked job.

    this.openDropdownId = this.openDropdownId === jobId ? null : jobId;

  }



  isDropdownOpen(jobId: number): boolean {

    // Check if the dropdown is open for the given job ID.

    return this.openDropdownId === jobId;

  }



  onLogoChange(event: any, controlName: string) {

    const file = event.target.files[0];

 

    if (file) {

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

      const maxSize = 1 * 1024 * 1024; // 1MB in bytes

 

      // Check if the selected file is an image

      if (!allowedTypes.includes(file.type)) {

        this.messageService.add({

          severity: 'error',

          summary: 'Error',

          detail: 'Invalid file type! Please upload a JPG, PNG, or GIF image.'

        });



        event.target.value = ''; // Clear file input

        return;

      }

 

      // Check file size

      if (file.size > maxSize) {

        alert('File size exceeds 1 MB! Please upload a smaller image.');

        event.target.value = ''; // Clear file input

        return;

      }

 

      // Valid file - Patch form value

      this.companyForm.patchValue({ [controlName]: file });

    }

  }

 

 

  onFileChange(event: any, controlName: string) {

    const file = event.target.files[0];

 

    if (file) {

      const allowedTypes = ['pdf', 'doc', 'docx', 'gpg', 'jpg', 'jpeg', 'png', 'gif'];

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

 

      // Check file type

      if (!allowedTypes.includes(fileExtension)) {

        this.messageService.add({

          severity: 'error',

          summary: 'Error',

          detail: 'Invalid file type! Please upload a PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, or GPG file.'

        });

        event.target.value = ''; // Clear file input

        return;

      }

 

      // Check file size

      if (file.size > maxSize) {

        alert('File size exceeds 5 MB! Please upload a smaller file.');

        event.target.value = ''; // Clear file input

        return;

      }

 

      // Valid file - Patch form value

      this.companyForm.patchValue({ [controlName]: file });

    }

  }



  islogoutPopUpOpen:boolean = false;



  logoutpopshow(){

    this.islogoutPopUpOpen = true;

  }



  logoutpopClose(){

    this.islogoutPopUpOpen = false;

  }



  onLogoutSubmit(){

    this.AdminLogout();

    this.islogoutPopUpOpen = false;

  }

  rounds = [1, 2, 3, 4, 5];

  submitJobForm() {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
 
      return;
    }
 
    console.log("Job Created Successfully!", this.jobForm.value);
    this.createNewJOb();
  }
 
  fetchAdminJobs(): void {
    const adminId = Number(localStorage.getItem('adminId'));
    if (adminId) {
      this.jobAdminService.getActiveJobsByAdminId2(adminId).subscribe(
        {next:(jobs: any[]) => {
          this.Adminjobs = jobs as Job[];
          console.log('Jobs fetched for admin:', this.jobs);
        },
        error:(error) => {
          console.error('Error fetching jobs:', error);
        }}
      );
    }
  }

 





}