import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/authService/auth.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
        });
      }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (response) => {
                    // console.log("response login", response);
                    this.authService.setUserData(response);

                    // Redirection basée sur le rôle
                    if (this.authService.isAdmin()) {
                        this.router.navigate(['/dashboard/admin']);
                    } else {
                        this.router.navigate(['/dashboard/candidat']);
                    }

                    this.toastr.success('Connexion réussie');
                },
                error: (error) => {
                    this.toastr.error('Erreur de connexion');
                    console.error(error);
                    this.router.navigate(['/login']);
                    this.toastr.error('Erreur de connexion');
                }
            });
        }
    }
}
