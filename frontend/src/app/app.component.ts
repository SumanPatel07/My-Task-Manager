import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  collapsed = false;
  screenWidth = window.innerWidth; // Initialize with current screen width

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  onToggleSideNav(toggle: { screenWidth: number; collapsed: boolean }) {
    this.screenWidth = toggle.screenWidth;
    this.collapsed = toggle.collapsed;
  }
}
