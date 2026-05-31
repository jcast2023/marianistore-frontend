import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.inicializarTema();
  }

  private inicializarTema(): void {
    const temaGuardado = localStorage.getItem('theme');

    if (temaGuardado === 'dark') {
      this.activarModoOscuro();
    } else {
      this.activarModoClaro();
    }
  }

  toggleTheme(): void {
    if (this.darkModeSubject.value) {
      this.activarModoClaro();
    } else {
      this.activarModoOscuro();
    }
  }

  private activarModoOscuro(): void {
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    this.darkModeSubject.next(true);
  }

  private activarModoClaro(): void {
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
    this.darkModeSubject.next(false);
  }
}
