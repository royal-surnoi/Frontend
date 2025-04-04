import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobAdmin, JobAdminService,Recruiter } from '../../job-admin.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

interface Job {
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
  role?: string; // Optional if it may not always be present
releaseDate: string;
name?: string;
company?: string;
recruiter?: string;
daysAgo?: number;

}
 
 
interface Section {
  backgroundImage: SafeUrl|string;
    title: string;
    description: string;
    additionalInfo?: { [key: string]: string };
 
  }




@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent {
  jobAdmin: JobAdmin | null = null;
  errorMessage = '';
  isLoading = false;
  successMessage = '';
 
  // sections: any = { about: {} };
  companyLocation: string = '';
  companyStrength: any = '';
  companyGstNumber :any = '';
  jobAdminEmail :string = '';
  companyLicense   :any = '';
  jobAdminCompanyName:string = '';
  companyName:string='';
  companyPhoneNumber:any='';
  companyAboutDescription:any ='';
  companyOverviewDescription:any ='';
  companyLogo: SafeUrl = '';  // Declare companyLogo as SafeUrl type
  companyLatitude: number = 0;
  companyLongitude: number = 0;
  descriptionBackground: SafeUrl|string= "url('https://img.freepik.com/free-photo/skyscraper-architecture-shines-generative-ai-sunset-generative-ai_188544-15489.jpg')";
  aboutBackground: SafeUrl|string= "url('https://images.unsplash.com/photo-1569470451072-68314f596aec?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D')";;
  addJobBackground: SafeUrl|string= "url('https://wallpaper-house.com/data/out/9/wallpaper2you_319693.jpg')";
  overviewBackground: SafeUrl|string="url('https://wallpaper-house.com/data/out/9/wallpaper2you_319693.jpg')";
  contactBackground: SafeUrl|string="url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff2ca5d0-5633-4ef7-b22f-934c6516d5f0/d6iuhnh-22a84a73-8669-48aa-aaac-47e886276b7c.jpg')";
  private interval: any;
  recruiterUpdateForm: any;
  isSubmitting: any;
  selectedRecruiter: Recruiter | null = null;
 
  constructor(private fb: FormBuilder, private router: Router,
    private http: HttpClient,private sanitizer: DomSanitizer,
    private jobAdminService: JobAdminService, private route:ActivatedRoute) {
    
  }
 
  adminId:number = 0;
  mapLocation : string = "N/A"
 

 
 
 
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.scrollToTop()
      this.adminId = +params['AdminId']; // Ensure jobId is a number
      this.fetchJobAdmin(Number(this.adminId)); // Pass the adminId to fetchJobAdmin
      this.fetchJobs(); // Fetch initial job postings
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  fetchJobAdmin(jobAdminId: number): void {
    this.jobAdminService.getJobAdminById(jobAdminId).subscribe(
      {next:(response: JobAdmin) => {
        console.log('Job Admin:', response);
 
 
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
       this.sections['home'].title = response.jobAdminCompanyName ||'';
       this.companyName="Welcome to " + response.jobAdminCompanyName ||'';
       this.mapLocation = response.jobAdminCompanyName ;
      //  console.log(  this.sections['home'].additionalInfo['title'])
      this.sections['industry'].additionalInfo['Type of Industry :'] = response.companyTypeOfIndustry || 'N/A'; // Bind companyTypeOfIndustry
      this.sections['home'].additionalInfo[''] = response.companyDescription || 'No description available.'; // Bind companyDescription
      this.sections['about'].additionalInfo[''] = response.companyAboutDescription || 'No description available.'; // Bind companyDescription
      this.sections['industry'].additionalInfo['']  = response.companyOverviewDescription|| 'No description available.';
 
      this.initMap(response.companyLatitude,response.companyLongitude);/*---Popup Map------*/
 
 
        // Sanitize the logo URL
        this.companyLogo = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.companyLogo}`);
        console.log(this.companyLogo+"this is COMPANY logo")
 
 
 
        if(response.descriptionBackground!=null){
          this.descriptionBackground = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.descriptionBackground}`);
          this.descriptionBackground = `url('${this.descriptionBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`
        }
        
 
        if(response.aboutBackground!=null){
          this.aboutBackground = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.aboutBackground}`);
          this.aboutBackground = `url('${this.aboutBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`
        }
       
 
 
        if(response.addJobBackground!=null){
           this.addJobBackground = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.addJobBackground}`);
            this.addJobBackground = `url('${this.addJobBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`
        }  
 

 
 
        if(response.overviewBackground!=null){
          this.overviewBackground = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.overviewBackground}`);
          this.overviewBackground = `url('${this.overviewBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`;
        }
        
 
 
        if(response.contactBackground!=null){
          this.contactBackground = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.contactBackground}`);
          this.contactBackground =`url('${this.contactBackground.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`;
        }
        
      },
   
      error:(error: any) => {
        console.error('Error fetching Job Admin:', error);
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
 
  sections: { [key: string]: Section } = {
    home: {
      title: '' ,
       description: '',
       additionalInfo: {
        },
      backgroundImage: '',
     
    },
    about: {
      title: 'About Us',
      description: '',
      additionalInfo: {
        Strength: '',  // Placeholder for dynamic value
        Location: '',  // Placeholder for dynamic value
      },
      backgroundImage: '',
    },
    contact: {
      title: 'Contact Us',
      description: 'We\'d love to hear from you! Reach out to us for any business inquiries or support needs.',
      additionalInfo: {
        'GST Number': '',  // Placeholder for dynamic value
        'Email': '',       // Placeholder for dynamic value
        'License': ''      // Placeholder for dynamic value
      },
      backgroundImage: '',
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
      backgroundImage: '',
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
 
 
  viewJob(job: any) {
    // Implement viewing job details
  }
 
  viewApplicants(job: any) {
    // Implement viewing applicants for the job
  }
 
 
  jobs: Job[]=[]
 

 
    /*----------------------------------------------------map---------------------------------------------------------*/
    map: any;
    address: string = '';
   
   
   
   
    initMap(latitude:number,longitude:number): void {
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
            alert('Address not found!');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('There was an error geocoding the address. Please try again later.');
        });
    }


fetchJobs(): void {
 const adminId = Number(localStorage.getItem('adminId'));
 if (adminId) {
   this.jobAdminService.getJobsByAdminId(adminId).subscribe((jobs: any[]) => {
     this.jobs = jobs as Job[];
     console.log('Jobs fetched:', this.jobs);
   });
 }
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

}
 

 
 
 
 