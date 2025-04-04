import { Component, Input, SecurityContext } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobUserService, UserSkills,UserProjects } from '../../job-user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 
// Interfaces for Skill and Project
interface Skill {
  id:number
  skillName: string;
  level: string;
  isEditing?: boolean;
}
 
interface Project {
  projectTitle: string;
  projectDescription: string;
  client: string;
  startDate: string;
  endDate: string;
  details: string;
  skillsUsed: string;
  videoUrl: string | ArrayBuffer | null;
  backgroundImage: string | ArrayBuffer | null;
 
}
 
@Component({
  selector: 'app-skills-projects',
  standalone: true,
  imports: [CommonModule, FormsModule,ToastModule,ButtonModule],
  templateUrl: './skills-projects.component.html',
  styleUrls: ['./skills-projects.component.css'], // Corrected to styleUrls
  providers: [MessageService]
})
export class SkillsProjectsComponent {
onSubmit(_t67: NgForm) {
throw new Error('Method not implemented.');
}
  @Input() theme: string = "";
 
  // Skills array
  skills: Skill[] = [];
 
 
  showInfoCard = false;
  isPopupOpen = false;
  skillName = '';
  skillLevel = '';
  savedSkill: UserSkills | undefined;
  userSkills: UserSkills[] = [];
 
  constructor(private jobUserService: JobUserService, private sanitizer:
    DomSanitizer,private router: Router, private messageService: MessageService) {}
  userId: any;
  ngOnInit(): void {
    this.userId=localStorage.getItem('id');
    this.getSkills();
   this.fetchProjects();
  }
 
  // Fetch skills for a user
  getSkills(): void {
    this.jobUserService.getSkillsByUserId(this.userId).subscribe(
      {next:(data) => {
        this.skills = data;
      },
      error:(error) => {
        console.error('Error fetching skills:', error);
      }}
    );
  }
 
  // Save a new skill
  saveSkill(): void {
    if (this.skillName && this.skillLevel) {
      const newskill={skillName:this.skillName,level:this.skillLevel}
      this.jobUserService.addSkill(this.userId, newskill).subscribe(
        {next:(response) => {
          console.log(response.body)
          this.skills.push(response);  // Update local skills list
          alert(`Skill: ${this.skillName} - Level: ${this.skillLevel} saved!`);
          this.skillName = '';
          this.skillLevel = '';
        },
        error:(error) => {
          console.error('Error saving skill:', error);
        }}
      );
    } else {
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Please fill in both fields.'
 
      });
    }
  }
 
openPopup(): void {
    this.isPopupOpen = true;
  }
 
  closePopup(): void {
    this.isPopupOpen = false;
    this.skillName = '';
    this.skillLevel = '';
  }
 
  editSkill(index: number): void {
    this.skills[index].isEditing = true;
  }
 
  saveEditedSkill(index: number): void {
    const skill = { ...this.skills[index] }; // Make a shallow copy to avoid mutating the original
    delete skill.isEditing; // Remove isEditing before sending it
 
    this.jobUserService.updateSkill(skill.id, skill).subscribe(
      {next:(updatedSkill) => {
        // Update the skill in the list with the backend response
        this.skills[index] = updatedSkill;
        this.skills[index].isEditing = false;
        alert(`Skill updated: ${skill.skillName} - Level: ${skill.level}`);
      },
      error:(error) => {
        console.error('Error updating skill:', error);
      }}
    );
  }
 
 
  cancelEdit(index: number): void {
    this.skills[index].isEditing = false;
  }
 
  takeTest(): void {
    const newskill = { skillName: this.skillName, level: this.skillLevel };
    alert("Take the skill test here! " + newskill.skillName + newskill.level);
 
    // Navigate to the skillbasedquiz route with query parameters
    this.router.navigate(['/skillbasedquiz'], {
      queryParams: {
        skillName: newskill.skillName,
        skillLevel: newskill.level
      }
    });
  }
 
  getSkillMessage(skill: any): string {
  return `${skill.level.charAt(0).toUpperCase() + skill.level.slice(1).toLowerCase()} in ${skill.skillName}`;
}
 
 
 
    // Projects array
    projects: UserProjects[] = [];
    newProject: UserProjects = this.initializeNewProject();
    selectedVideo: File | null = null;
sanitizedVideoUrl: SafeResourceUrl | null = null;
sanitizedImageUrl: SafeResourceUrl | null = null; // Add this line
showVideoPlayer = false;
showImageViewer = true;
 
// Component state variables
isProjectPopupOpen = false;
projectTitle = '';
clientName = '';
projectDescription = '';
startDate: string | null = null;
endDate: string | null = null;
projectDetails = '';
skillsUsed = '';
projectVideoUrl = '';
currentProjectIndex: number | null = null;
 
showSuccessPopup = false;
 
// Project management functionality
isEditMode = false;  // Track if we are in edit mode
//newProject: Project = this.initializeNewProject();
currentEditingIndex: number | null = null; // Store the index of the project being edited
 
// Open the popup to add/edit project
openProjectPopup(project?: UserProjects, index?: number): void {
  if (project && index !== undefined) {
    this.newProject = { ...project };
    this.isEditMode = true;
    this.currentEditingIndex = index;
  } else {
    this.newProject = this.initializeNewProject();
    this.isEditMode = false;
    this.currentEditingIndex = null;
  }
  this.isProjectPopupOpen = true;
}
 
closeProjectPopup(): void {
  this.isProjectPopupOpen = false;
  this.currentEditingIndex = null; // Clear the editing index when closing
}
 
saveProject(): void {
    // Reset all validation errors
    Object.keys(this.validationErrors).forEach(key => {
      this.validationErrors[key as keyof typeof this.validationErrors] = '';
    });
 
    // Perform all validations
    const isProjectNameValid = this.validateProjectName(this.newProject.projectName);
    const isSkillsValid = this.validateSkillsUsed(this.newProject.skillsUsed);
    const areDatesValid = this.validateDates(
    );
 
    // If any validation fails, return early
    if (!isProjectNameValid || !isSkillsValid || !areDatesValid) {
      return;
    }
   
  const userProfileId = this.userId;
  const startDate = new Date(this.newProject.startDate);
  const endDate = new Date(this.newProject.endDate);
 
  if (this.isEditMode && this.currentEditingIndex !== null) {
    // Update project in edit mode
    this.jobUserService.updateProject(
      userProfileId,
      this.projects[this.currentEditingIndex].id!,
      this.newProject.projectName,
      this.newProject.client,
      this.newProject.projectDescription,
      startDate,
      endDate,
      this.newProject.skillsUsed,
      this.newProject.projectLink,
      this.newProject.projectImage,
      this.newProject.projectVideo
     
    ).subscribe(
      {next:(updatedProject) => {
        this.projects[this.currentEditingIndex!] = updatedProject;
        this.closeProjectPopup();
        this.showSuccessPopup = true;
        this.fetchProjects();
      },
      error:(error) => {
        console.error("Error updating project:", error);
      }}
    );
  } else {
    // Create a new project if not in edit mode
    this.jobUserService.addOrUpdateProject(
      userProfileId,
      this.newProject.projectName,
      // this.newProject.projectDescription,
      this.newProject.client,
      this.newProject.projectDescription,
      startDate.toISOString(),
      endDate.toISOString(),
      this.newProject.client,
      startDate.toISOString(),
      endDate.toISOString(),
      this.newProject.projectLink,
      this.newProject.skillsUsed,
      "SampleTechUsed",
      this.newProject.projectName,
      this.newProject.projectLink,
      this.newProject.projectImage,
      this.newProject.projectVideo
    ).subscribe(
      {next:(newProject) => {
        this.fetchProjects();
        console.log(
          newProject
        )
        this.closeProjectPopup();
        this.fetchProjects();
      },
      error:(error) => {
        console.error("Error adding project:", error);
      }}
    );
  }
}
 
 
// Optional: Add method to handle error popup if needed
showErrorPopup(message: string): void {
  // Implementation for error popup
  console.error(message);
}
videoFileName: string | null = null; // For video file name
imageFileName: string | null = null; // For image file name
 
onVideoSelected(event: Event): void {
  const input = event.target as HTMLInputElement; // ✅ Correctly typed as HTMLInputElement
  if (input.files && input.files[0]) {
    this.newProject.projectVideo = input.files[0]; // ✅ No need for 'as File'
  }
  if (input.files && input.files.length > 0) {
    this.videoFileName = input.files[0].name; // ✅ Clean and correct
  }
}

 
onBackgroundImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    this.newProject.projectImage = input.files[0]; // Directly storing as File
  }
  if (input.files && input.files.length > 0) {
    this.imageFileName = input.files[0].name; // Get image file name
  }
}
 
private initializeNewProject(): UserProjects {
  return {
    projectName: '',
    client: '',
    projectDescription: '',
    startDate: new Date(),
    endDate: new Date(),
    skillsUsed: '',
    projectLink: '',
    projectImage: undefined,
    projectVideo: undefined,
    SafeurlVideo: null
  };
}
 
loadAndPlayProjectVideo(project: UserProjects, index: number): void {
  const projectVideo = project.projectVideo;
 
  // Set the selected project index for conditional rendering
  this.currentProjectIndex = index;
  this.showImageViewer = true;  // Ensure image viewer is closed
  this.showVideoPlayer = false;
 
  if (projectVideo instanceof File) {
    const url = URL.createObjectURL(projectVideo);
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showVideoPlayer = true;
  } else if (typeof projectVideo === 'string') {
    if (this.isValidUrl(projectVideo)) {
      this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(projectVideo);
      this.showVideoPlayer = true;
    } else if (this.isBase64(projectVideo)) {
      const url = `data:video/mp4;base64,${projectVideo}`;
      this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showVideoPlayer = true;
    } else {
      console.error("The project video string is not a valid URL or base64 encoded string.");
      this.showVideoPlayer = false;
    }
  } else {
    console.error("The project video is neither a File object nor a valid URL or base64 string.");
    this.showVideoPlayer = false;
  }
}
 
 
// Helper functions to check if a string is a valid URL or base64 encoded
isValidUrl(str: string): boolean {
try {
  new URL(str);
  return true;
} catch {
  return false;
}
}
 
isBase64(str: string): boolean {
try {
  return btoa(atob(str)) == str;
} catch {
  return false;
}
}
 
 
 
 
 
// Add this method to your component class
getBackgroundImageUrl(project: UserProjects): string {
if (!project.projectImage) {
  return 'url(assets/default-project-image.jpg)';
}
 
if (project.projectImage instanceof File) {
  const url = URL.createObjectURL(project.projectImage);
  return `url(${this.sanitizer.sanitize(SecurityContext.URL, url)})`;
}
 
if (typeof project.projectImage === 'string') {
  if (this.isValidUrl(project.projectImage)) {
    return `url(${this.sanitizer.sanitize(SecurityContext.URL, project.projectImage)})`;
  }
 
  if (this.isBase64(project.projectImage)) {
    const url = `data:image/jpeg;base64,${project.projectImage}`;
    return `url(${this.sanitizer.sanitize(SecurityContext.URL, url)})`;
  }
}
 
return 'url(assets/default-project-image.jpg)';
}
 
// Update fetchProjects method
fetchProjects(): void {
this.jobUserService.getProjectsByUserId(this.userId).subscribe(
  {next:projects => {
    this.projects = projects;
    this.projects.forEach((project, index) => {
      this.loadAndPlayProjectVideo(project, index);
      this.projects[index].SafeurlVideo = this.sanitizedVideoUrl;
    });
  },
  error:error => {
    console.error("Error fetching projects:", error);
  }}
);
}
 
closeSuccessPopup(): void {
this.showSuccessPopup = false;
}
 
//////////////////////////////////////////////////////////////
 // Validation error messages
 validationErrors: {
  projectName: string;
  client: string;
  startDate: string;
  endDate: string;
  skillsUsed: string;
} = {
  projectName: '',
  client: '',
  startDate: '',
  endDate: '',
  skillsUsed: ''
};
 
// Validation functions
validateProjectName(name: string): boolean {
  const hasNumbers = /\d/.test(name);
  if (hasNumbers) {
    this.validationErrors.projectName = 'Project title cannot contain numbers';
    return false;
  }
  if (!name.trim()) {
    this.validationErrors.projectName = 'Project title is required';
    return false;
  }
  this.validationErrors.projectName = '';
  return true;
}
 
validateSkillsUsed(skills: string): boolean {
  const hasNumbers = /\d/.test(skills);
  if (hasNumbers) {
    this.validationErrors.skillsUsed = 'Skills cannot contain numbers';
    return false;
  }
  if (!skills.trim()) {
    this.validationErrors.skillsUsed = 'Skills are required';
    return false;
  }
  const o=50
  if(skills.length == o ){
    this.validationErrors.skillsUsed = 'you reached the limit';
    return false;
  }
  this.validationErrors.skillsUsed = '';
  return true;
}
 // validateclientUsed(client: string): boolean {
//   if (!client.trim()) {
//     this.validationErrors.client = 'client are required';
//     return false;
//   }
//   const c=50;
//   if(client.length == c ){
//     this.validationErrors.client = 'you reached the limit';
//     return false;
//   }
 

validateClient(client: string): boolean {
  const hasNumbers = /\d/.test(client);
  if (hasNumbers) {
    this.validationErrors.client = 'Client name cannot contain numbers';
    return false;
  }
 
  if (!client.trim()) {
    this.validationErrors.client = 'Client name is required';
    return false;
  }
 
  const maxLength = 50;
  if (client.length > maxLength) {
    this.validationErrors.client = `Client name cannot exceed ${maxLength} characters`;
    return false;
  }
 
  this.validationErrors.client = ''; // Clear errors if valid
  return true;
}
 
validateDates(): boolean {
  if (!this.newProject.startDate || !this.newProject.endDate) {
    return false;
  }
 
  const start = new Date(this.newProject.startDate);
  start.setHours(0, 0, 0, 0);
 
  const end = new Date(this.newProject.endDate);
  end.setHours(0, 0, 0, 0);
 
  // Clear previous errors
  this.validationErrors.startDate = '';
  this.validationErrors.endDate = '';
 
  // Only validate that end date is after start date
  if (end < start) {
    this.validationErrors.endDate = 'End date must be after start date';
    return false;
  }
 
  return true;
}
getIconColor(theme: string): string {
  switch (theme) {
    case 'blue':
      return ' #e7f5ff'; // Blue theme color
    case 'orange':
      return '#fff4e6'; // Orange theme color
    case 'yellow':
      return '#fff3bf'; // Yellow theme color
    default:
      return '#ffffff'; // Default color (white)
  }
}
 
 
// selectedVideoFile: File | null = null;
// selectedImageFile: File | null = null;
//  // Handle video file selection
//  handleVideoSelection(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files[0]) {
//     this.selectedVideoFile = input.files[0].name; // Get video file name
//   }
// }
 
// // Handle image file selection
// handleImageSelection(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   if (input.files && input.files[0]) {
//     this.selectedImageFile = input.files[0].name; // Get image file name
//   }
// }
// onVideoSelected(event: any) {
//   this.selectedVideoFile = event.target.files[0];
// }
 
// onBackgroundImageSelected(event: any) {
//   this.selectedImageFile = event.target.files[0];
// }
 
}
 