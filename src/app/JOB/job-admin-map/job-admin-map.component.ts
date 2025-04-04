import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {  tileLayer, marker, Map, Marker } from 'leaflet';
import { JobAdminService } from '../../job-admin.service';
import { RouterLink,Router } from '@angular/router';
 
@Component({
  selector: 'app-job-admin-map',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-admin-map.component.html',
  styleUrls: ['./job-admin-map.component.css']
})
export class JobAdminMapComponent {
  companyLatitude: number = 17.360589;
  companyLongitude: number = 78.4740613;
  address: string = '';
  zoom: number = 13;
  map: Map | undefined;
  leafletMarker: Marker | undefined;
  jobAdminId: number = 0; // Default jobAdminId
 
  constructor(
    private http: HttpClient,
    private jobAdminService: JobAdminService,
    private router:Router
  ) {}
 
  ngOnInit(): void {
    console.log('Component initialized.');
    this.setJobAdminIdFromStorage();
    this.initializeMap();
  }
 
  setJobAdminIdFromStorage(): void {
    const storedJobAdminId = localStorage.getItem('adminId');
    if (storedJobAdminId !== null) {
      this.jobAdminId = Number(storedJobAdminId);
      console.log(`Job Admin ID from localStorage: ${this.jobAdminId}`);
    } else {
      console.log(`Using default Job Admin ID: ${this.jobAdminId}`);
    }
  }
 
  initializeMap(): void {
    this.map = new Map('map').setView([this.companyLatitude, this.companyLongitude], this.zoom);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.leafletMarker = marker([this.companyLatitude, this.companyLongitude]).addTo(this.map);
 
    this.map.on('click', (e) => this.onMapClick(e));
  }
 
  onMapClick(event: any): void {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;
 
    this.companyLatitude = lat;
    this.companyLongitude = lon;
 
    if (this.leafletMarker) {
      this.leafletMarker.setLatLng([lat, lon]);
    }
  }
 
  geocodeAddress(): void {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.address)}`;
    this.http.get<any[]>(url).subscribe(
    { next: data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.companyLatitude = lat;
          this.companyLongitude = lon;
 
          if (this.map) this.map.setView([lat, lon], this.zoom);
          if (this.leafletMarker) this.leafletMarker.setLatLng([lat, lon]);
        } else {
          alert('Address not found.');
        }
      },
      error:error => {
        console.error('Error during geocoding:', error);
        alert('Geocoding failed.');
      }}
    );
  }
 
  saveCoordinates(): void {
    console.log(`Saving coordinates with Job Admin ID: ${this.jobAdminId}`);
 
    const formData = new FormData();
    formData.append('companyLatitude', String(this.companyLatitude));
    formData.append('companyLongitude', String(this.companyLongitude));
 
    this.jobAdminService.updateCompanyLocation(this.jobAdminId, formData).subscribe(
    {  next:response => {
        console.log('Coordinates updated successfully', response);
        alert('Coordinates updated successfully!');
        this.router.navigate(['/JobAdmin']);
      },
     error: error => {
        console.error('Error updating coordinates:', error);
        alert('Error updating coordinates.');
      }}
    );
  }

  goBack(): void {
    window.history.back();
  }
}
 
 
 