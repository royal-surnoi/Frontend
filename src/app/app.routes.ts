
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MentornaddcourseComponent } from './mentornaddcourse/mentornaddcourse.component';
import { LoginComponent } from './login/login.component';
import { EnrollmentPaymentFormComponent } from './enrollment-payment-form/enrollment-payment-form.component';
import { LearningPageComponent } from './learning-page/learning-page.component';
import { ProfileComponent } from './profile/profile.component';
import { MentorquizComponent } from './mentorquiz/mentorquiz.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { FollowcountComponent } from './followcount/followcount.component';
import { CoursecontentComponent } from './coursecontent/coursecontent.component';
import { RegisterComponent } from './register/register.component';
import { CourselandpageComponent } from './courselandpage/courselandpage.component';
import { CandidateDashboardComponentComponent } from './candidate-dashboard-component/candidate-dashboard-component.component';
import { CandidateDashboardComponent } from './candidate-dashboard/candidate-dashboard.component';
import { StudentdashboardComponent } from './studentdashboard/studentdashboard.component';
import { SudentcoursedetailComponent } from './sudentcoursedetail/sudentcoursedetail.component';
import { CandidateActivtiesComponent } from './candidate-activties/candidate-activties.component';
import { CoursedashboardComponent } from './coursedashboard/coursedashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { MentorPerspectiveComponent } from './mentor-perspective/mentor-perspective.component';
import { SubregisterComponent } from './subregister/subregister.component';
import { SubloginComponent } from './sublogin/sublogin.component';
import { MentorupdatecourseComponent } from './mentorupdatecourse/mentorupdatecourse.component';
import { ProjectComponent } from './project/project.component';
import { AssignmentmentorComponent } from './assignmentmentor/assignmentmentor.component';
import { MentorcourseprojectComponent } from './mentorcourseproject/mentorcourseproject.component';
import { MentorcourseassignmentComponent } from './mentorcourseassignment/mentorcourseassignment.component';
import { MentorcourseassignmentupdateComponent } from './mentorcourseassignmentupdate/mentorcourseassignmentupdate.component';
import { MentorcourseprojectupdateComponent } from './mentorcourseprojectupdate/mentorcourseprojectupdate.component';
import { NotificationComponent } from './notification/notification.component';
import { CertificateComponent } from './certificate/certificate.component';
import { UsersprofileComponent } from './usersprofile/usersprofile.component';
import { OnlineclassComponent } from './onlineclass/onlineclass.component';
import { authGuard } from './auth.guard';
import { RecomondcourseComponent } from './recomondcourse/recomondcourse.component';
import { CourseCreateMentorComponent } from './course-create-mentor/course-create-mentor.component';
import { SlotdetailsComponent } from './slotdetails/slotdetails.component';
import { StudentmockComponent } from './studentmock/studentmock.component';
import { MockActivityComponent } from './mock-activity/mock-activity.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { MockFeedbackComponent } from './mock-feedback/mock-feedback.component';
import { MockMentorActivityComponent } from './mock-mentor-activity/mock-mentor-activity.component';
import { MockComponent } from './mock/mock.component';
import { JobHomeComponent } from './JOB/job-home/job-home.component';
import { JobDetailsComponent } from './JOB/job-details/job-details.component';
import { JobAdminComponent } from './JOB/job-admin/job-admin.component';
import { JobRecruiterComponent } from './JOB/job-recruiter/job-recruiter.component';
import { AdminLoginComponent } from './JOB/admin-login/admin-login.component';
import { AdminSignupComponent } from './JOB/admin-signup/admin-signup.component';
import { RecruiterLoginComponent } from './JOB/recruiter-login/recruiter-login.component';
import { RecruiterApplicationComponent } from './JOB/recruiter-application/recruiter-application.component';
import { JobAdminMapComponent } from './JOB/job-admin-map/job-admin-map.component';
import { JobUserProfileComponent } from './JOB/job-user-profile/job-user-profile.component';
import { CompanyProfileComponent } from './JOB/company-profile/company-profile.component';
import { QuizlevelComponent } from './JOB/quizlevel/quizlevel.component';
import { TakeQuizComponent } from './JOB/take-quiz/take-quiz.component';
import { AdminApplicantsComponent } from './JOB/admin-applicants/admin-applicants.component';
import { SkillbasedquizComponent } from './JOB/skillbasedquiz/skillbasedquiz.component';
import { LevelfeedbackComponent } from './levelfeedback/levelfeedback.component';
import { EducationDashBoardComponent } from './education-dash-board/education-dash-board.component';
import { AICourseComponent } from './ai-course/ai-course.component';
import { AcadamicInstituteComponent } from './acadamic/acadamic-institute/acadamic-institute.component';
import { AcadamicLoginComponent } from './acadamic/acadamic-login/acadamic-login.component';
import { AcadamicComponent } from './acadamic/Student-acadamic/acadamic/acadamic.component';
import { AcadamicComponentTeacher } from './acadamic/Teacher-acadamic/acadamic/acadamic.component';
import { SubjectdetailsComponent } from './acadamic/Teacher-acadamic/subjectdetails/subjectdetails.component';
import { LanguagelearningComponent } from './languagelearning/languagelearning.component';
import { AICourseDashBoardComponent } from './ai-course-dash-board/ai-course-dash-board.component';
import { AcadamicHomeComponent } from './acadamic/acadamic-home/acadamic-home.component';
import { AiCarearGuidanceComponent } from './ai-carear-guidance/ai-carear-guidance.component';
import { StudentSubjectDeatilsComponent } from './acadamic/Student-acadamic/student-subject-deatils/student-subject-deatils.component';
import { ForgotPasswordComponent } from './JOB/forgot-password/forgot-password.component';
import { OtpPasswordResetComponent } from './JOB/otp-password-reset/otp-password-reset.component';
import { AiquiznewComponent } from './aiquiznew/aiquiznew.component';
import { AiassignmentComponent } from './aiassignment/aiassignment.component';
import { UserforgotComponent } from './userforgot/userforgot.component';
import { MentorforgotComponent } from './mentorforgot/mentorforgot.component';
import { Mentorforgot1Component } from './mentorforgot1/mentorforgot1.component';
import { MentorsComponent } from './mentors/mentors.component';
import { MentorProfileComponent } from './mentor-profile/mentor-profile.component';
import { AiresumebuilderComponent } from './airesumebuilder/airesumebuilder.component';
import { AiMockQuizComponent } from './ai-mock-quiz/ai-mock-quiz.component';
import { MainCourseCreateComponent } from './Create-Course-mentor/main-course-create/main-course-create.component';
import { CcmCourselandingComponent } from './Create-Course-mentor/ccm-courselanding/ccm-courselanding.component';
import { CcmCoursetrailerComponent } from './Create-Course-mentor/ccm-coursetrailer/ccm-coursetrailer.component';
import { CcmPlanningComponent } from './Create-Course-mentor/ccm-planning/ccm-planning.component';
import { CcmLessonComponent } from './Create-Course-mentor/ccm-lesson/ccm-lesson.component';
import { CcmPricingComponent } from './Create-Course-mentor/ccm-pricing/ccm-pricing.component';

 
export const routes: Routes = [
    {
        path: 'levelfeedback/:recruiterId/:shortlistId/:candidateUserId/:jobid',
        component: LevelfeedbackComponent
    },
    { path: '', redirectTo: '/login', pathMatch: 'full'  },
    { path: 'login', component: LoginComponent },
    { path: 'user-forgot-password', component: UserforgotComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', canActivate: [authGuard], children: [
        // { path: 'mentordashboard', component: MenotperspectveComponent },
        { path: 'addcourse', component: MentornaddcourseComponent },
        { path: 'updatecourse/:courseId', component: MentorupdatecourseComponent },       
        { path: 'courseland', component: CourselandpageComponent },
        { path: 'enrollpaymentform', component: EnrollmentPaymentFormComponent },
        { path: 'learningPage', component: LearningPageComponent },
        { path: 'profile/:id', component: ProfileComponent },
        { path: 'usersprofile/:id', component: UsersprofileComponent },
        { path: 'followcount', component: FollowcountComponent },
        { path: 'coursecontent', component: CoursecontentComponent },
        { path: 'studentdashboard', component: StudentDashboardComponent },
        { path: 'coursedashboard', component: CoursedashboardComponent },
        { path: 'coursedashboard/:id', component: CoursedashboardComponent },
        { path: 'mentorperspective', component: MentorPerspectiveComponent },
        { path: 'mentorperspective/:Field', component: MentorPerspectiveComponent },
        { path: 'candiatedashboardactivites', component: CandidateDashboardComponent },
        { path: 'mentorquiz/:courseId', component: MentorquizComponent },
        { path: 'mentorassignments/:lessonId', component: AssignmentComponent },
        { path: 'module', component: MentornaddcourseComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'subregister', component: SubregisterComponent },
        { path: 'sublogin', component: SubloginComponent },
        { path: 'mentorforgot', component: MentorforgotComponent },
        { path: 'mentorforgot1', component: Mentorforgot1Component },

        { path: 'candidateview', component: StudentdashboardComponent, children: [
            { path: 'home', component: EducationDashBoardComponent },
            { path: 'activities', component: CandidateDashboardComponent },
            { path: 'courses', component: CandidateDashboardComponentComponent },
            { path: 'learningPage/:searchTerm', component: LearningPageComponent },
           { path: 'recomondcourse', component: RecomondcourseComponent },
           { path:'AILanguageLearning',component:LanguagelearningComponent},
           { path:'AcadamicHome',component:AcadamicHomeComponent},
           { path:'AiCarearGuidance', component:AiCarearGuidanceComponent},
           { path: 'studentmock', component: StudentmockComponent },
           { path: 'mentors', component: MentorsComponent },
        ]},
        { path: 'activities/:id', component: CandidateDashboardComponent },
        { path: 'studentdetails/:id', component: SudentcoursedetailComponent },
        { path: 'activitybyid/:id', component: SudentcoursedetailComponent },
        { path: 'activity/:courseId', component: CandidateActivtiesComponent },
        { path: 'candidate-activties', component: CandidateActivtiesComponent },
        { path: 'activity/:id', component: CandidateActivtiesComponent },
        { path: 'activity/:courseId/:activityType', component: CandidateActivtiesComponent },
       
        { path: 'project/:studentId', component: ProjectComponent },
        { path: 'assignment/:studentId', component: AssignmentmentorComponent },
        { path: 'quiz/:studentId', component: MentorquizComponent },
        
        { path: 'notification', component: NotificationComponent },
        { path: 'courseproject/:courseId', component: MentorcourseprojectComponent },
        { path: 'courseassignment/:courseId', component: MentorcourseassignmentComponent },
        { path: 'courseprojectupdate/:projectId', component: MentorcourseprojectupdateComponent },
        { path: 'mentorcourseassignmentupdate/:assignmentId', component: MentorcourseassignmentupdateComponent },
        { path: 'Certificate/:id', component: CertificateComponent },
        { path: 'onlineclass/:courseId', component: OnlineclassComponent },
        {path:"slotdetails",component: SlotdetailsComponent},
        {path:"createcourse/:id",component:CourseCreateMentorComponent},
        // {path:"mock-activity/:mockId",component:MockActivityComponent},
        // {path:"mock-activity/:mockId",component:MockActivityComponent},
        {path:"mock-test/:mockId",component:MockActivityComponent},
        {path:"profile-sett",component:PersonalDetailsComponent},
        {path:"mock-interview",component:MockMentorActivityComponent},
        { path: 'mock-feedback/:projectId/:userId/:type', component:MockFeedbackComponent},
        { path: 'mockcomp', component:MockComponent},
        
        ///////notification//////////////////
 
{ path: 'userprofile/:id', component: ProfileComponent },
{ path: 'profile/:userId', component: ProfileComponent },
{ path: 'profile/:id', component: ProfileComponent },
{ path: 'MentorProfile/:userid', component: MentorProfileComponent },
// { path: 'aiquiz', component: AiquizComponent },

{ path: 'aiquiz', component: AiquiznewComponent },
{ path: "activity/:courseId/:courseType/:activityType/:activityId", component: CandidateActivtiesComponent },
 

// Job Portal

{ path: 'Job', component:  JobHomeComponent},
{ path: 'JobDetails/:Jobid/:type', component:  JobDetailsComponent},
{path:'JobAdminLogin', component:AdminLoginComponent},
{ path: 'forgot-password', component: ForgotPasswordComponent },
{ path: 'otp-password-reset', component: OtpPasswordResetComponent },
{path:'JobAdminSignup', component:AdminSignupComponent},
{path:'JobAdmin', component:JobAdminComponent},
{path:'JobRecruiter', component: JobRecruiterComponent},
{path:'JobRecruiterLogin', component: RecruiterLoginComponent},
{ path: 'Applicants/:Jobid', component:RecruiterApplicationComponent},
{ path: 'JobAdminMap', component:JobAdminMapComponent},
{ path: 'ApplicantData/:userId', component:JobUserProfileComponent},
{ path: 'Organization/:AdminId', component:CompanyProfileComponent},
{ path:'quizlevel',component:QuizlevelComponent},
{ path:'TakeQuiz/:Jobid',component:TakeQuizComponent},
{ path:'AdminApplicants/:Jobid',component:AdminApplicantsComponent},
{ path:'skillbasedquiz',component:SkillbasedquizComponent},
{ path:'AICourse',component:AICourseComponent},
{ path:'AICourseDashBoard/:id',component:AICourseDashBoardComponent},


// Education

{ path:'institute/:id',component:AcadamicInstituteComponent},
{path:'instituteLogin',component:AcadamicLoginComponent},
{path:'StudentAcadamic/:id',component:AcadamicComponent},
{path:'TeacherAcadamic/:id',component:AcadamicComponentTeacher},
{ path: 'subject/:Subjectid', component:SubjectdetailsComponent },
{ path: 'subjectDetails/:Subjectid', component:StudentSubjectDeatilsComponent }, 


// Ai Assignment

{path:'aiassignment',component:AiassignmentComponent},
{path:'airesume',component:AiresumebuilderComponent},
{path:'aimockquiz/:job_role/:job_description/:experience',component:AiMockQuizComponent},


{ path: 'CCM/:CourseId', component: MainCourseCreateComponent, children: [
    { path: 'courselanding/:CourseId', component: CcmCourselandingComponent },
    { path: 'coursetrailer/:CourseId', component: CcmCoursetrailerComponent },
    { path: 'planning/:CourseId', component: CcmPlanningComponent },
    { path: 'lesson/:CourseId', component: CcmLessonComponent },
   { path: 'project/:CourseId', component: CcmPricingComponent },
   { path:'pricing/:CourseId',component:CcmPricingComponent},
]}
 
 
 
]
 
},


 
];
 
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
 
 