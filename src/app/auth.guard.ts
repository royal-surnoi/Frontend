import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
 
 
// Define the authGuard function
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
 
  // Get authentication status from localStorage (whether user is logged in)
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const currentUrl = state.url;
 
  // Check if token is available in localStorage (for session persistence)
  const token = localStorage.getItem('token');
 
  if (isLoggedIn && token) {
    // If user is logged in, define allowed routes (e.g., feed page)
    const allowedRoutes = ['/candidateview/home'];
 
    // If the current URL is in the allowed routes, permit access
    if (allowedRoutes.includes(currentUrl)) {
      return true;
    } else {
      // If it's a page reload, allow staying on the current page
      const navEntries = performance.getEntriesByType('navigation');
      const isReload = navEntries.length > 0 &&
        (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
       
      if (isReload) {
      return true;
      } else {
        // For any other route, redirect to the feed page
        return router.navigate(['/candidateview/home']);
      }
    }
  } else {
    // If user is not logged in or token is missing, redirect to the login page
    return router.navigate(['/login']);
  }
};
 
 