import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HotelService } from '../services/hotel.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private hotelService: HotelService) { }

  canActivate(): boolean {
    if (this.authService.isAuthenticatedUser()) {
      const userName = localStorage.getItem('order-my-food-username');
      const email = localStorage.getItem('order-my-food-email');
      const userId = localStorage.getItem('order-my-food-userId');
      this.hotelService.setUserName(userName);
      this.hotelService.setEmail(email);
      this.hotelService.setUserId(userId);
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }

}
