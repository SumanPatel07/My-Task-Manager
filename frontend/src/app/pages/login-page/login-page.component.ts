import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        if (res.status === 200) {
          // Successfully logged in
          this.router.navigate(['/lists']);
        } else {
          console.log('Unexpected response:', res);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }
  
}
