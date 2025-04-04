import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import moment from 'moment';
import { AiresumeService ,AIGenerateResponse} from '../airesume.service';
import { ActivatedRoute, Route } from '@angular/router';

interface LoadingStates {
  objective: boolean;
  work: boolean[];
  education: boolean[];
  project: boolean[];
}
@Component({
  selector: 'app-airesumebuilder',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './airesumebuilder.component.html',
  styleUrl: './airesumebuilder.component.css'
})
export class AiresumebuilderComponent {
  resumeForm: FormGroup;
  resumeData: any;
  userId=Number(localStorage.getItem('id'));
  suggestions: { [key: string]: any } = {};
  aiResponses: { [key: string]: AIGenerateResponse } = {};
  selectedSuggestions: { [key: string]: string } = {};
  currentJobId:number|null=0;
  objectiveDescription:string|null='';


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private aiResumeService:AiresumeService,
    private route:ActivatedRoute
  ) {
    this.resumeForm = this.fb.group({
      personalDetails: this.fb.group({
        name: [''],
        email: [''],
        phone: [''],
        location: [''],
        website: [''],
        objective: ['']
      }),
      workExperiences: this.fb.array([]),
      education: this.fb.array([]),
      projects: this.fb.array([]),
      skills: this.fb.array([])
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentJobId = params['jobId'] ? Number(params['jobId']) : null;
      console.log("jobId",this.currentJobId);
    });
 
    this.fetchResumeData(this.userId); 
  }

  fetchResumeData(userId: number) {
    this.http.get(`http://localhost:8080/personalDetails/allDetailsForAIResumeBuilder/${userId}`)
      .subscribe((data: any) => {
        this.resumeData = data;
        this.patchFormData();
      });
  }

  formatDate(date: string | null): string {
    if (!date) return '';
    return moment(date).format('MMM YYYY');
  }

  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br>');
  }
  
  patchFormData() {
    // Patch personal details
    const user = this.resumeData.personalDetails.user;
    this.resumeForm.patchValue({
      personalDetails: {
        name: user.name,
        email: user.email,
        phone: this.resumeData.personalDetails.phoneNumber,
        location: `${this.resumeData.personalDetails.permanentCity}, ${this.resumeData.personalDetails.permanentState}`,
        objective: '' 
      }
    });

    // Patch work experiences
    const workArray = this.resumeForm.get('workExperiences') as FormArray;
    this.resumeData.workExperiences.forEach((exp: any) => {
      workArray.push(this.fb.group({
        companyName: [exp.workCompanyName],
        role: [exp.workRole],
        startDate: [moment(exp.workStartDate).format('YYYY-MM')],
        endDate: [exp.workEndDate ? moment(exp.workEndDate).format('YYYY-MM') : ''],
        description: [exp.workDescription]
      }));
    });

    // Patch education
    const eduArray = this.resumeForm.get('education') as FormArray;
    if (this.resumeData.education && this.resumeData.education.length > 0) {
      const edu = this.resumeData.education[0];
      
      // Add graduation details
      if (edu.graduationCollegeName) {
        eduArray.push(this.fb.group({
          instituteName: [edu.graduationCollegeName],
          degree: ['Graduation'],
          specialization: [edu.graduationCollegeSpecialization],
          percentage: [edu.graduationCollegePercentage],
          startDate: [moment(edu.graduationYearOfJoining.toString()).format('YYYY-MM')],
          endDate: [moment(edu.graduationYearOfPassout.toString()).format('YYYY-MM')],
          additionalInfo: ['']
        }));
      }

      // Add intermediate details
      if (edu.intermediateCollegeName) {
        eduArray.push(this.fb.group({
          instituteName: [edu.intermediateCollegeName],
          degree: ['Intermediate'],
          specialization: [edu.intermediateCollegeSpecialization],
          percentage: [edu.intermediateCollegePercentage],
          startDate: [moment(edu.intermediateYearOfJoining.toString()).format('YYYY-MM')],
          endDate: [moment(edu.intermediateYearOfPassout.toString()).format('YYYY-MM')],
          additionalInfo: ['']
        }));
      }

      // Add school details
      if (edu.schoolName) {
        eduArray.push(this.fb.group({
          instituteName: [edu.schoolName],
          degree: ['School'],
          specialization: [edu.schoolEducationBoard],
          percentage: [edu.schoolPercentage],
          startDate: [moment(edu.schoolYearOfJoining.toString()).format('YYYY-MM')],
          endDate: [moment(edu.schoolYearOfPassout.toString()).format('YYYY-MM')],
          additionalInfo: ['']
        }));
      }
    }

    // Patch projects
    const projArray = this.resumeForm.get('projects') as FormArray;
    this.resumeData.userProjects.forEach((proj: any) => {
      projArray.push(this.fb.group({
        name: [proj.projectName],
        description: [proj.projectDescription],
        skillsUsed: [proj.skillsUsed],
        startDate: [new Date(proj.startDate).toISOString().split('T')[0]],
        endDate: [new Date(proj.endDate).toISOString().split('T')[0]]
      }));
    });

    // Patch skills
    const skillsArray = this.resumeForm.get('skills') as FormArray;
    this.resumeData.userSkills.forEach((skill: any) => {
      skillsArray.push(this.fb.group({
        name: [skill.skillName],
        level: [skill.level]
      }));
    });
  }

  // Helper methods for form arrays
  addExperience() {
    const workArray = this.resumeForm.get('workExperiences') as FormArray;
    workArray.push(this.fb.group({
      companyName: [''],
      role: [''],
      startDate: [''],
      endDate: [''],
      description: ['']
    }));
  }

  addProject() {
    const projArray = this.resumeForm.get('projects') as FormArray;
    projArray.push(this.fb.group({
      name: [''],
      description: [''],
      skillsUsed: [''],
      startDate: [''],
      endDate: ['']
    }));
  }
  addEducation() {
    const eduArray = this.resumeForm.get('education') as FormArray;
    eduArray.push(this.fb.group({
      instituteName: [''],
      degree: [''],
      specialization: [''],
      percentage: [''],
      startDate: [''],
      endDate: [''],
      additionalInfo: [''] // Added additional info to education group
    }));
  }
  addSkill() {
    const skillsArray = this.resumeForm.get('skills') as FormArray;
    skillsArray.push(this.fb.group({
      name: [''],
      level: ['']
    }));
  }

  get skillDetails() {
    return (this.resumeForm.get('skills') as FormArray).controls;
  }

  downloadResume() {
    const pdf = new jsPDF();
    let yPos = 20;
    const margin = 20;
    const pageWidth = pdf.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);
  
    // Helper function to add a section title with underline
    const addSectionTitle = (title: string) => {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title, margin, yPos);
      yPos += 5;
      
      // Add underline
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
      
      // Reset font
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
    };
  
    // Helper function to check and add new page if needed
    const checkPageBreak = (requiredSpace: number) => {
      if (yPos + requiredSpace > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        yPos = margin;
      }
    };
  
    // Personal Details
    const personalDetails = this.resumeForm.get('personalDetails')?.value;
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(personalDetails.name, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
  
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const contactInfo = `${personalDetails.email} | ${personalDetails.phone} | ${personalDetails.location}`;
    pdf.text(contactInfo, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;
  
    // Website if available
    if (personalDetails.website) {
      pdf.text(personalDetails.website, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;
    }
  
    // Objective
    if (personalDetails.objective) {
      checkPageBreak(30);
      addSectionTitle('Objective');
      const objectiveLines = pdf.splitTextToSize(personalDetails.objective, contentWidth);
      pdf.text(objectiveLines, margin, yPos);
      yPos += (objectiveLines.length * 5) + 10;
    }
  
    // Work Experience
    const workExp = this.workExperiences.value;
    if (workExp.length > 0) {
      checkPageBreak(20);
      addSectionTitle('Work Experience');
      
      workExp.forEach((exp: any) => {
        checkPageBreak(40);
        pdf.setFont('helvetica', 'bold');
        pdf.text(exp.companyName, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${this.formatDate(exp.startDate)} - ${exp.endDate ? this.formatDate(exp.endDate) : 'Present'}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 5;
  
        pdf.setFont('helvetica', 'italic');
        pdf.text(exp.role, margin, yPos);
        yPos += 5;
  
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(exp.description, contentWidth);
        checkPageBreak(descLines.length * 5);
        pdf.text(descLines, margin, yPos);
        yPos += (descLines.length * 5) + 10;
      });
    }
  
    // Education
    const education = this.educationDetails.value;
    if (education.length > 0) {
      checkPageBreak(20);
      addSectionTitle('Education');
      
      education.forEach((edu: any) => {
        checkPageBreak(40);
        pdf.setFont('helvetica', 'bold');
        pdf.text(edu.instituteName, margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${this.formatDate(edu.startDate)} - ${this.formatDate(edu.endDate)}`, pageWidth - margin, yPos, { align: 'right' });
        yPos += 5;
  
        const eduDetails = `${edu.degree} - ${edu.specialization} - ${edu.percentage}%`;
        pdf.text(eduDetails, margin, yPos);
        yPos += 5;
  
        if (edu.additionalInfo) {
          const infoLines = pdf.splitTextToSize(edu.additionalInfo, contentWidth);
          checkPageBreak(infoLines.length * 5);
          pdf.text(infoLines, margin, yPos);
          yPos += (infoLines.length * 5) + 10;
        } else {
          yPos += 10;
        }
      });
    }
  
    // Projects
    const projects = this.projectDetails.value;
    if (projects.length > 0) {
      checkPageBreak(20);
      addSectionTitle('Projects');
      
      projects.forEach((proj: any) => {
        checkPageBreak(30);
        pdf.setFont('helvetica', 'bold');
        pdf.text(proj.name, margin, yPos);
        yPos += 5;
  
        pdf.setFont('helvetica', 'normal');
        const descLines = pdf.splitTextToSize(proj.description, contentWidth);
        checkPageBreak(descLines.length * 5);
        pdf.text(descLines, margin, yPos);
        yPos += (descLines.length * 5) + 10;
      });
    }
  
    // Skills - Modified to display each skill on a new line
    const skills = this.skillDetails;
    if (skills.length > 0) {
      checkPageBreak(20 + (skills.length * 5)); // Account for space needed for all skills
      addSectionTitle('Skills');
      
      skills.forEach((skill: AbstractControl) => {
        const skillName = skill.get('name')?.value;
        const skillLevel = skill.get('level')?.value;
        
        // Create bullet point for each skill
        const skillText = `• ${skillName} - ${skillLevel}`;
        pdf.text(skillText, margin, yPos);
        yPos += 5; // Move to next line for next skill
      });
    }
  
    // Save PDF
    pdf.save('resume.pdf');
  }
  get workExperiences(): FormArray {
    return this.resumeForm.get('workExperiences') as FormArray;
  }

  get educationDetails(): FormArray {
    return this.resumeForm.get('education') as FormArray;
  }

  get projectDetails(): FormArray {
    return this.resumeForm.get('projects') as FormArray;
  }

  get personalDetails(): FormGroup {
    return this.resumeForm.get('personalDetails') as FormGroup;
  }
  loadingStates: LoadingStates = {
    objective: false,
    work: Array(10).fill(false),
    education: Array(10).fill(false),
    project: Array(10).fill(false)
  };
  generateWorkDescription(index: number) {
    this.loadingStates.work[index] = true;
    const workExp = this.workExperiences.at(index).value;
   
    const jobId: number | undefined = this.currentJobId ? this.currentJobId : undefined; // If applying for a job, jobId will be set
    const userDescription = workExp.description || null;
 
    this.aiResumeService.generateWorkDescription(workExp, jobId, userDescription).subscribe({
      next: (response) => {
        this.aiResponses[`work_${index}`] = response;
        this.loadingStates.work[index] = false;
      },
      error: (error) => {
        console.error('Error generating work description:', error);
        this.loadingStates.work[index] = false;
      }
    });
  }
 
  generateEducationDescription(index: number) {
    this.loadingStates.education[index] = true;
    const education = this.educationDetails.at(index).value;
 
    const jobId: number | undefined = this.currentJobId ? this.currentJobId : undefined;
    const userDescription = education.description || null;
 
    this.aiResumeService.generateEducationDescription(education, jobId, userDescription).subscribe({
      next: (response) => {
        this.aiResponses[`education_${index}`] = response;
        this.loadingStates.education[index] = false;
      },
      error: (error) => {
        console.error('Error generating education description:', error);
        this.loadingStates.education[index] = false;
      }
    });
  }
 
  generateProjectDescription(index: number) {
    this.loadingStates.project[index] = true;
    const project = this.projectDetails.at(index).value;
 
    const jobId: number | undefined = this.currentJobId ? this.currentJobId : undefined;
    const userDescription = project.description || null;
 
    this.aiResumeService.generateProjectDescription(project, jobId, userDescription).subscribe({
      next: (response) => {
        this.aiResponses[`project_${index}`] = response;
        this.loadingStates.project[index] = false;
      },
      error: (error) => {
        console.error('Error generating project description:', error);
        this.loadingStates.project[index] = false;
      }
    });
  }
 
  generateObjective() {
    this.loadingStates.objective = true;
    const latestWork = this.workExperiences.at(0)?.value;
    const jobTitle = latestWork?.role || '';
   
    const jobId: number | undefined = this.currentJobId ? this.currentJobId : undefined;
    const userDescription: string | undefined = this.objectiveDescription?? undefined;
    // If user has existing description
 
    this.aiResumeService.generateObjective(this.userId, jobTitle, jobId, userDescription).subscribe({
      next: (response) => {
        this.aiResponses['objective'] = response;
        this.loadingStates.objective = false;
      },
      error: (error) => {
        console.error('Error generating objective:', error);
        this.loadingStates.objective = false;
      }
    });
  }
 
 
  showSuggestion(section: string, type: 'suggestions' | 'condensed' | 'extended') {
    const response = this.aiResponses[section];
    if (!response) return;
    
    // Store the selected content
    this.selectedSuggestions[section] = response[type];
  }


  // Apply selected suggestion to form
  applySelectedSuggestion(section: string) {
    const content = this.selectedSuggestions[section];
    if (!content) return;

    if (section === 'objective') {
      this.resumeForm.get('personalDetails.objective')?.patchValue(content);
    } else if (section.startsWith('work_')) {
      const index = parseInt(section.split('_')[1]);
      this.workExperiences.at(index).get('description')?.patchValue(content);
    } else if (section.startsWith('education_')) {
      const index = parseInt(section.split('_')[1]);
      this.educationDetails.at(index).get('additionalInfo')?.patchValue(content);
    } else if (section.startsWith('project_')) {
      const index = parseInt(section.split('_')[1]);
      this.projectDetails.at(index).get('description')?.patchValue(content);
    }
  }
 
}
