import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message: string = '';
  type: 'success' | 'wishlist' = 'success';
  show: boolean = false;

  showToast(message: string, type: 'success' | 'wishlist' = 'success') {
    this.message = message;
    this.type = type;
    this.show = true;
    setTimeout(() => this.show = false, 3000);
  }
  cerrarToast() {
  this.show = false;
}
}
