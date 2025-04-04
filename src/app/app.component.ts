
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { HeaderComponent } from "./header/header.component";




 
 
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HeaderComponent]
})
 
 
 
 
 
 

export class AppComponent implements OnInit {
  title = 'FusionProject';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check login state on app initialization and every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });
  }
  checkLoginStatus(): void {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const token = localStorage.getItem('token');
    const allowedRoutes = ['/login', '/register','/user-forgot-password']; // Allow login and register pages

    // Redirect logic based on login state
    if (isLoggedIn && token) {
      // User is logged in, prevent them from going to login or register page
      if (allowedRoutes.includes(this.router.url)) {
        this.router.navigate(['/candidateview/learningPage', '']);
      }
    } else {
      // If not logged in, allow navigation only to login or register page
      if (!allowedRoutes.includes(this.router.url)) {
        this.router.navigate(['/login']);
      }
    }
  }

 

}
 