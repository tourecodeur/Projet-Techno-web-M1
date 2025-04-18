import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/authService/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    registerForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            description: [''],
            photoProfil: [''],
            role: "CANDIDAT"
        });
    }

    inscriptionForm() {
        if (this.registerForm.valid) {
            // console.log(this.registerForm.value);
            this.authService.inscription(this.registerForm.value).subscribe({
                next: (response) => {
                    // console.log('Inscription réussie', response);
                    this.toastr.success('Inscription réussie');
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Une erreur s\'est produite lors de l\'inscription', error);
                    this.toastr.error('Une erreur s\'est produite lors de l\'inscription');
                }
            })
        }
    }
}
