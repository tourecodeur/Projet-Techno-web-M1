import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { FileService } from '../../../../core/services/api/file.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/api/user.service';

@Component({
  selector: 'app-gestion-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-profil.component.html',
  styleUrl: './gestion-profil.component.css'
})
export class GestionProfilComponent {
    userConnected: any = [];
    formUpdateCompte: FormGroup;
    selectedFile: File | null = null;

    constructor(
        private toastrService: ToastrService,
        private authService: AuthService,
        private fileService: FileService,
        private userService: UserService,
        private fb: FormBuilder,
    ){
        this.formUpdateCompte = this.fb.group({
            email: ['', Validators.required],
            photoProfil: [''],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            role: ['CANDIDAT']
        });
    }

    ngOnInit(): void {
        this.getUserCompte();
    }

    getUserCompte(){
        this.userConnected = this.authService.getCurrentUser();
        // console.log("UserCompte: ", this.userConnected);

        // Mettre à jour les valeurs du formulaire
        this.formUpdateCompte.patchValue({
            prenom: this.userConnected.prenom,
            nom: this.userConnected.nom,
            email: this.userConnected.email,
            telephone: this.userConnected.telephone,
            adresse: this.userConnected.adresse,
            description: this.userConnected.description,
            photoProfil: this.userConnected.photoProfil,
            role: this.userConnected.role
        });

        // console.log("FormUpdateValue: ", this.formUpdateCompte.value);
    }

    // Méthode pour prévisualiser l'image
    getImageUrl(candidat: any): string {
        if (candidat?.photoProfil) {
            // Extrait le nom du fichier de l'URL complète
            const fileName = candidat.photoProfil.split('/').pop();
            return this.fileService.getFileUrl(fileName);
        }
        return 'assets/images/prf3.jpg';
    }

    // Gestion des fichiers images
    onFileSelected(event: any) {
        const file = event.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (file.size > maxSize) {
                this.toastrService.error('Le fichier est trop volumineux. Taille maximum : 5MB');
                return;
            }
            if (!allowedTypes.includes(file.type)) {
                this.toastrService.error('Format de fichier non supporté. Utilisez JPG, PNG ou GIF');
                return;
            }
            this.selectedFile = file;
        }
    }

    updateUserCompte() {
        if (this.formUpdateCompte.valid) {
            // Create update object with current form values
            const updateData = {
                ...this.formUpdateCompte.value,
                password: this.userConnected.password, // Preserve existing password
                id: this.userConnected.userId         // Include user ID
            };

            // If there's a new file, upload it first
            if (this.selectedFile) {
                this.fileService.uploadFile(this.selectedFile).subscribe({
                    next: (response) => {
                        updateData.photoProfil = response.url;
                        this.processUserUpdate(updateData);
                    },
                    error: (error) => {
                        console.error('Erreur upload image:', error);
                        this.toastrService.error('Erreur lors du téléchargement de l\'image');
                    }
                });
            } else {
                // Keep existing photo if no new file
                updateData.photoProfil = this.userConnected.photoProfil;
                this.processUserUpdate(updateData);
            }
        }
    }

    private processUserUpdate(updateData: any) {
        this.userService.updateUser(this.userConnected.userId, updateData).subscribe({
            next: (response) => {
                // Update local storage with new user data
                const currentUser = this.authService.getCurrentUser();
                const updatedUser = { ...currentUser, ...updateData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                
                this.toastrService.success('Compte mis à jour avec succès');
                this.getUserCompte();
            },
            error: (error) => {
                console.error('Erreur mise à jour:', error);
                this.toastrService.error('Erreur lors de la mise à jour du compte');
            }
        });
    }
}
