import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkillsProjectsComponent } from "../skills-projects/skills-projects.component";
import { EducationExperianceComponent } from "../education-experiance/education-experiance.component";

interface User {
  id: number;
  userDescription: string;
  profession: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;
  phoneNumber: string;
  theme: string;
  bannerImage?: string | SafeUrl;
  resume: string | null;
  user: {
    name: string;
    email: string;
    userImage?: string | SafeUrl;
  };
}


@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, RouterLink, SkillsProjectsComponent, EducationExperianceComponent],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent {

  @Input() user_deatils?: User;

  theme:string = this.user_deatils?.theme || 'blue'
  theme2:string = this.user_deatils?.theme || 'blue'

  
  

  selectedPage:string = 'Details';

  goBack() {
    window.location.reload();
  }
  



}
