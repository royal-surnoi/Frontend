import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EducationDetail,JobUserService , Experience } from '../../job-user.service';
import { RouterLink } from '@angular/router';
 
interface ExtendedEducationDetail extends EducationDetail {
  id: number;  // Ensure there's an 'id' property for each education entry
  isEditingSchool?: boolean;
  isEditingIntermediate?: boolean;
  isEditingDiploma?: boolean;
  isEditingGraduation?: boolean;
  isEditingPostGraduate?: boolean;
}
 
interface ExperienceUpdatePayload {
  id: number; // Ensure this matches the type used in your backend
  workRole: string;
  workCompanyName: string;
  workStartDate: string;
  workEndDate: string;
  workDescription: string;
  currentlyWorking: boolean;
  isEditing: boolean;
}
@Component({
  selector: 'app-education-experiance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './education-experiance.component.html',
  styleUrls: ['./education-experiance.component.css'],
})
export class EducationExperianceComponent implements OnInit {
  @Input() theme2: string = '';
  experiences: Experience[] = [];
  educationDetails: ExtendedEducationDetail[] = [];
  showPopup: boolean = false;
  popupMessage: string = '';
 
  constructor(private JobUserService: JobUserService,
    private jobUserService:JobUserService
  ) {}
 
  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.loadExperiences(userId);
      this.loadEducation(userId);
    } else {
      this.showPopup = true;
      this.popupMessage = 'User ID not found in local storage. Please log in.';
      console.error('User ID is missing from local storage');
    }
  }
 
  loadExperiences(userId: number) {
    this.jobUserService.getExperiencesByUserId(userId).subscribe((data) => {
      this.experiences = data || [];
      if (this.experiences.length === 0) {
        this.showPopup = true;
        this.popupMessage = 'Please navigate to the experience section to add your details.';
      }
    });
  }
 
  loadEducation(userId: number) {
    this.jobUserService.getEducationByUserId(userId).subscribe((data) => {
      this.educationDetails = data as ExtendedEducationDetail[] || [];
      if (this.educationDetails.length === 0) {
        this.showPopup = true;
        this.popupMessage = 'Please navigate to the education section to add your details.';
      }
    });
  }
 
  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('id');
    return userId ? +userId : null;
  }
 
  addExperience() {
    const newExperience: Experience = {
      id: this.experiences.length + 1,
      workRole: '',
      workCompanyName: '',
      workStartDate: '',
      workEndDate: '',
      workDescription: '',
      currentlyWorking: false,
      isEditing: true,
    };
    this.experiences.push(newExperience);
  }
 
  editExperience(index: number) {
    this.experiences[index].isEditing = true;
  }
 
  private saveExperienceDetail(index: number): void {
    const userId = this.getUserIdFromLocalStorage();
    const experience = this.experiences[index];
    const experienceId = experience?.id;
 
    if (!userId || !experienceId) {
        console.error('User ID or Experience ID is missing');
        return;
    }
 
    // Prepare data for the API request
    const experienceToUpdate = {
        id: experienceId,
        workRole: experience.workRole,
        workCompanyName: experience.workCompanyName,
        workStartDate: experience.workStartDate,
        workEndDate: experience.workEndDate,
        workDescription: experience.workDescription,
        currentlyWorking: experience.currentlyWorking
    };
 
    this.jobUserService.updateExperience(userId, experienceId, experienceToUpdate)
        .subscribe(
           { next:(updatedExperience) => {
                console.log(`Experience detail updated for ID: ${experienceId}`);
 
                // Update frontend state to reflect the changes and exit edit mode
                this.experiences[index] = { ...experience, ...updatedExperience, isEditing: false };
            },
           error: (error) => {
                console.error('Error updating experience detail:', error);
                this.showPopup = true;
                this.popupMessage = 'Failed to update experience detail. Please try again.';
            }
}        );
}
 
 
 
 
 
 
 
 
 
  saveExperience(index: number) {
    this.saveExperienceDetail(index);
  }
 
 
 
 
 
  cancelEditExperience(index: number) {
    this.experiences[index].isEditing = false;
  }
 
  addEducation() {
    const newEducation: ExtendedEducationDetail = {
      id: this.educationDetails.length + 1, // Generate a unique id for each new education entry
      schoolName: '',
      schoolYearOfJoining: 0,
      schoolYearOfPassout: 0,
      schoolPercentage: '0',
      schoolEducationBoard: '',
      intermediateCollegeName: '',
      intermediateYearOfJoining: 0,
      intermediateYearOfPassout: 0,
      intermediateCollegePercentage: '0',
      graduationCollegeName: '',
      graduationCollegeSpecialization: '',
      graduationYearOfJoining: 0,
      graduationYearOfPassout: 0,
      postGraduateStatus: 'Not Pursued',
      postGraduateCollegeName: '',
      postGraduateCollegeSpecialization: '',
      postGraduateYearOfJoining: 0,
      postGraduateYearOfPassout: 0,
      postGraduateCollegePercentage: '0',
      diplomaYearOfJoining: 0,
      diplomaYearOfPassout: 0,
      diplomaCollegeName: '',
      diplomaCollegePercentage: '0',
      isEditing: true,
    };
    this.educationDetails.push(newEducation);
  }
 
  resetEditFlags() {
    this.educationDetails.forEach((item) => {
      item.isEditingSchool = false;
      item.isEditingIntermediate = false;
      item.isEditingDiploma = false;
      item.isEditingGraduation = false;
      item.isEditingPostGraduate = false;
    });
  }
 
  editSchoolEducation(index: number) {
    this.resetEditFlags();
    this.educationDetails[index].isEditingSchool = true;
  }
 
  saveSchoolEducation(index: number) {
    this.saveEducationDetail(index, 'isEditingSchool');
  }
 
  editIntermediateEducation(index: number) {
    this.resetEditFlags();
    this.educationDetails[index].isEditingIntermediate = true;
  }
 
  saveIntermediateEducation(index: number) {
    this.saveEducationDetail(index, 'isEditingIntermediate');
  }
 
  editDiplomaEducation(index: number) {
    this.resetEditFlags();
    this.educationDetails[index].isEditingDiploma = true;
  }
 
  saveDiplomaEducation(index: number) {
    this.saveEducationDetail(index, 'isEditingDiploma');
  }
 
  editGraduationEducation(index: number) {
    this.resetEditFlags();
    this.educationDetails[index].isEditingGraduation = true;
  }
 
  saveGraduationEducation(index: number) {
    this.saveEducationDetail(index, 'isEditingGraduation');
  }
 
  editPostGraduateEducation(index: number) {
    this.resetEditFlags();
    this.educationDetails[index].isEditingPostGraduate = true;
  }
 
  savePostgraduateEducation(index: number) {
    this.saveEducationDetail(index, 'isEditingPostGraduate');
  }
 
  cancelEditSchoolEducation(index: number) {
    this.educationDetails[index].isEditingSchool = false;
}
 
cancelEditIntermediateEducation(index: number) {
    this.educationDetails[index].isEditingIntermediate = false;
}
 
cancelEditDiplomaEducation(index: number) {
    this.educationDetails[index].isEditingDiploma = false;
}
 
cancelEditGraduationEducation(index: number) {
    this.educationDetails[index].isEditingGraduation = false;
}
 
cancelEditPostGraduateEducation(index: number) {
    this.educationDetails[index].isEditingPostGraduate = false;
}
 
private saveEducationDetail(index: number, editingProperty: keyof ExtendedEducationDetail) {
  const userId = this.getUserIdFromLocalStorage();
  const educationId = this.educationDetails[index].id;
 
  if (userId && educationId) {
      // Create a new object to send only the necessary fields
      const educationToUpdate = {
          id: this.educationDetails[index].id, // Ensure id is sent for the update
          schoolName: this.educationDetails[index].schoolName,
          schoolYearOfJoining: this.educationDetails[index].schoolYearOfJoining,
          schoolYearOfPassout: this.educationDetails[index].schoolYearOfPassout,
          schoolPercentage: this.educationDetails[index].schoolPercentage,
          schoolEducationBoard: this.educationDetails[index].schoolEducationBoard,
          intermediateCollegeName: this.educationDetails[index].intermediateCollegeName,
          intermediateYearOfJoining: this.educationDetails[index].intermediateYearOfJoining,
          intermediateYearOfPassout: this.educationDetails[index].intermediateYearOfPassout,
          intermediateCollegePercentage: this.educationDetails[index].intermediateCollegePercentage,
          graduationCollegeName: this.educationDetails[index].graduationCollegeName,
          graduationCollegeSpecialization: this.educationDetails[index].graduationCollegeSpecialization,
          graduationYearOfJoining: this.educationDetails[index].graduationYearOfJoining,
          graduationYearOfPassout: this.educationDetails[index].graduationYearOfPassout,
          postGraduateStatus: this.educationDetails[index].postGraduateStatus,
          postGraduateCollegeName: this.educationDetails[index].postGraduateCollegeName,
          postGraduateCollegeSpecialization: this.educationDetails[index].postGraduateCollegeSpecialization,
          postGraduateYearOfJoining: this.educationDetails[index].postGraduateYearOfJoining,
          postGraduateYearOfPassout: this.educationDetails[index].postGraduateYearOfPassout,
          postGraduateCollegePercentage: this.educationDetails[index].postGraduateCollegePercentage,
          diplomaYearOfJoining: this.educationDetails[index].diplomaYearOfJoining,
          diplomaYearOfPassout: this.educationDetails[index].diplomaYearOfPassout,
          diplomaCollegeName: this.educationDetails[index].diplomaCollegeName,
          diplomaCollegePercentage: this.educationDetails[index].diplomaCollegePercentage
      };
 
      this.jobUserService.updateEducation(userId, educationId, educationToUpdate)
          .subscribe(
            { next: () => {
                  console.log(`Education detail updated for ${editingProperty}`);
                  this.educationDetails[index][editingProperty] = false; // This line will no longer give an error
              },
              error:(error) => {
                  console.error('Error updating education detail:', error);
                  this.showPopup = true;
                  this.popupMessage = 'Failed to update education detail. Please try again.';
              }}
          );
  }
}
 
 
  closePopup() {
    this.showPopup = false;
  }
 
  getYear(date: string): string {
    return new Date(date).getFullYear().toString();
  }
}
 
 