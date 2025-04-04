import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AcadamicInstituteServiceService } from '../../acadamic-service/acadamic-institute-service.service';
import { DomSanitizer } from '@angular/platform-browser';

 
@Component({
  selector: 'app-acadamic-home',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './acadamic-home.component.html',
  styleUrls: ['./acadamic-home.component.css'], // Fixed 'styleUrl' to 'styleUrls'
})
export class AcadamicHomeComponent {
 
  userAccounts: any[] = []; // Renamed to avoid conflict
 
 
  constructor(private router: Router,private Service: AcadamicInstituteServiceService,private sanitizer: DomSanitizer) {}
 
 
  ngOnInit(): void {
    // Clear the `setId` in localStorage when the page loads
    localStorage.setItem('setId', JSON.stringify(null));
 
    this.fetchAccounts();
  }
 
  fetchAccounts(): void {
    const userId = localStorage.getItem('id'); // Fetch userId from local storage
    if (userId) {
      this.Service.getAccounts(+userId) // Convert userId to number
        .subscribe((accounts: any[]) => {
          this.userAccounts = accounts.map(account => {
            return {
              ...account,
              image: account.Image!= null
                ? this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${account.Image}`)
                : '../../assets/download.png' // Fallback image
            };
          });
        });
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
 
  currentPage = 1;
  itemsPerPage = 7;
   // To store filtered accounts based on search
   filteredAccounts = [...this.userAccounts];
 
 // Calculate total pages dynamically
 get totalPages(): number[] {
  const pageCount = Math.ceil(this.filteredAccounts.length / this.itemsPerPage);
  return Array.from({ length: pageCount }, (_, i) => i + 1); // Array of page numbers
}
 
// Get paginated accounts dynamically
get paginatedAccounts(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredAccounts.slice(startIndex, endIndex);
}
 
// Navigate to a specific page
goToPage(page: number): void {
  this.currentPage = page;
}
 
// Navigate to the previous page
goToPreviousPage(): void {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
 
// Navigate to the next page
goToNextPage(): void {
  if (this.currentPage < this.totalPages.length) {
    this.currentPage++;
  }
}
 
 
 
  onAccountClick(account: any) {
        // Set the `setId` in localStorage on account click
        localStorage.setItem('setId', JSON.stringify(account.id));
       
    if (account.role === 'institute') {
      this.router.navigate(['/institute', account.id]);
    } else if (account.role === 'teacher') {
      this.router.navigate(['/TeacherAcadamic', account.id]);
    } else {
      this.router.navigate(['/StudentAcadamic', account.id]);
    }
  }

  onAccountClick2() {
    // Set the `setId` in localStorage on account click
    localStorage.setItem('setId', "1");
  this.router.navigate(['/StudentAcadamic',1]);
}

  gotonext(){
    this.router.navigate(['/TeacherAcadamic', "1"]);
  }
 
  onAddClick() {
    this.router.navigate(['/instituteLogin']);
  }
 
  // Filter accounts based on search query
  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();
    this.filteredAccounts = this.userAccounts.filter(
      (account) =>
        account.role.toLowerCase().includes(query) ||
      account.instituteName.toLowerCase().includes(query)
    );
    this.currentPage = 1; // Reset to the first page after search
  }
}
 
 
 