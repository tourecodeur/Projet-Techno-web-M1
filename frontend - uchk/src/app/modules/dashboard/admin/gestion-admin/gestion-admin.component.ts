import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../../core/services/api/admin.service';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { FileService } from '../../../../core/services/api/file.service';
import { ModalService } from '../../../../core/services/api/modal.service';

@Component({
  selector: 'app-gestion-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-admin.component.html',
  styleUrl: './gestion-admin.component.css'
})
export class GestionAdminComponent {

    tabsAdmins: any = [];
    tabAdminsFiltered: any[] = [];
    selectedAdmin: any = [];
    adminFormAdd!: FormGroup;
    adminFormUpdate!: FormGroup;
    selectedFile: File | null = null;
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;

    constructor(
        private adminService: AdminService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private fileService: FileService,
        private modalService: ModalService
    ){
        this.adminFormAdd = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            photoProfil: [''],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            role: ['ADMIN']
        });

        this.adminFormUpdate = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            photoProfil: [''],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            role: ['ADMIN']
        })
    }

    // Gestion des fichiers images
    onFileSelected(event: any) {
        const file = event.target.files[0];
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (file.size > maxSize) {
                this.toastr.error('Le fichier est trop volumineux. Taille maximum : 5MB');
                return;
            }
            if (!allowedTypes.includes(file.type)) {
                this.toastr.error('Format de fichier non supporté. Utilisez JPG, PNG ou GIF');
                return;
            }
            this.selectedFile = file;
        }
    }

    // Iniialisation
    ngOnInit() {
        this.updatePagination();
        this.getAllAdmins();
    }


    // Récupérer toutes les admins
    getAllAdmins(){
        this.adminService.getAdmins().subscribe(
            (admins) => {
                // console.log("Liste des admins", admins);
                this.tabsAdmins = admins;
                this.updatePagination(); // Mettre à jour la pagination
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des admins:', error);
            }
        )
    }

    // Ajouter un admin
    addAdmin(){
        if(this.selectedFile){
            // On upload l'image
            this.fileService.uploadFile(this.selectedFile).subscribe(
                (response) => {
                    // On récupère l'URL de l'image uploadée
                    const adminData = this.adminFormAdd.value;
                    adminData.photoProfil = response.url;

                    // Puis on crée l'admin avec l'URL de l'image
                    this.adminService.addAdmin(adminData).subscribe(
                        (admin) => {
                            // console.log("admin pour ajout", admin);
                            this.getAllAdmins();
                            this.modalService.closeModal("ajoutAdmin");
                            this.adminFormAdd.reset();
                            this.selectedFile = null;
                            this.toastr.success("admin ajouté avec succes!")
                        },
                        (error) => {
                            console.error('Une erreur s\'est produite lors de l\'ajout d\'un admin:', error);
                            this.toastr.error("Une erreur s'est produite lors de l'ajout d'un admin'.");
                        }
                    )
                },
                (error) => {
                    console.error('Une erreur s\'est produite lors de l\'upload de l\'image:', error);
                    this.toastr.error("Une erreur s'est produite lors de l'upload de l'image.");
                }
            )
        }else {
            // Si pas d'image, on crée l'admin directement
            this.adminService.addAdmin(this.adminFormAdd.value).subscribe(
                (admin) => {
                    // console.log("admin pour ajout", admin);
                    this.getAllAdmins();
                    this.modalService.closeModal("ajoutAdmin");
                    this.adminFormAdd.reset();
                    this.toastr.success("admin ajouté avec succes !")
                },
                (error) => {
                    console.error('Une erreur s\'est produite lors de l\'ajout d \'un admin:', error);
                    this.toastr.error("Une erreur s'est produite lors de l'ajout d \'un admin'.");
                }
            )
        }
    }

    private closeModal(modalId: string) {
        document.getElementById(modalId)?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
    }

    // Afficher les détails d'un admin
    showdetailsAdmin(id:number){
        this.selectedAdmin = this.tabsAdmins.find(
            (admin: any) => admin.id === id
        );

        if (this.selectedAdmin) {
            // console.log("details admin: ", this.selectedAdmin);
        } else {
            console.error("admin non trouvé");
            this.toastr.error("admin non trouvé");
        }
    }

    // Méthode pour pré-remplir le formulaire avec les valeurs existantes
    preRemplirFormulaire(id: number) {
        this.selectedAdmin = this.tabsAdmins.find(
            (admin: any) => admin.id === id
        );

        // console.log("admin selected: ", this.selectedAdmin);

        if (!this.selectedAdmin) {
            console.error("Admin non trouvée !");
            this.toastr.error("Impossible de trouver cet admin.");
            return;
        }

        // Mettre à jour le formulaire avec les valeurs existantes
        this.adminFormUpdate.patchValue({
            prenom: this.selectedAdmin.prenom || '',
            nom: this.selectedAdmin.nom || '',
            password: this.selectedAdmin.password || '',
            email: this.selectedAdmin.email || '',
            description: this.selectedAdmin.description || '',
            adresse: this.selectedAdmin.adresse || '',
            telephone: this.selectedAdmin.telephone || '',
            photoProfil: this.selectedAdmin.photoProfil || '',
            role: this.selectedAdmin.role || 'ADMIN'
        });

        // console.log("Formulaire pré-rempli :", this.adminFormUpdate.value);
    }

    // Mettre à jour un admin
    updateAdmin(id: number) {
        if (this.selectedFile) {
            // Upload de la nouvelle image
            this.fileService.uploadFile(this.selectedFile).subscribe(
                (fileResponse) => {
                    const donnees = this.adminFormUpdate.value;
                    donnees.photoProfil = fileResponse.url;

                    // console.log("données: ", donnees);

                    this.processUpdateAdmin(id, donnees);
                },
                (error) => {
                    console.error('Erreur upload image:', error);
                    this.toastr.error("Erreur lors de l'upload de l'image");
                }
            );
        } else {
            // Mise à jour sans nouvelle image
            const donnees = this.adminFormUpdate.value;
            this.processUpdateAdmin(id, donnees);
        }
    }

    // Méthode pour traiter la mise à jour de l'admin
    private processUpdateAdmin(id: number, donnees: any) {
        this.adminService.updateAdmin(id, donnees).subscribe(
            (updateAdmin) => {

                // console.log("updatedAdmin: ", updateAdmin);

                this.tabsAdmins = this.tabsAdmins.map((admin: any) =>
                    admin.id === id ? { ...admin, ...updateAdmin } : admin
                );
                this.selectedAdmin = { ...updateAdmin };
                this.getAllAdmins();
                this.adminFormUpdate.reset();
                this.selectedFile = null;
                this.closeModal('modifierAdmin');
                this.toastr.success("Admin modifié avec succès!");
            },
            (error) => {
                console.error("Erreur lors de la mise à jour:", error);
                this.toastr.error("Erreur lors de la mise à jour");
            }
        );
    }

    // Supprimer un admin
    deleteAdmin(id: number){
        this.adminService.deleteAdmin(id).subscribe(
            (admin) => {
                // console.log("admin à supprimer", admin);
                this.getAllAdmins();
                this.toastr.success("admin supprimé avec succes !")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la suppression de l\'admin:', error);
                this.toastr.error("Une erreur s'est produite lors de la suppression de l'admin.");
            }
        )
    }

    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.tabAdminsFiltered = [...this.tabsAdmins];
        // console.log("tabAdminFiltered: ", this.tabAdminsFiltered);
        this.totalPages = Math.ceil(this.tabsAdmins.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les années admins paginées
    getPaginatedAdmin(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.tabAdminsFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchAdmin(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.tabAdminsFiltered = this.tabsAdmins.filter((admin:any) =>
            admin.prenom.toLowerCase().includes(searchValue) ||
            admin.nom.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.tabAdminsFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

    // Méthode pour prévisualiser l'image
    getImageUrl(admin: any): string {
        if (admin?.photoProfil) {
            // Extrait le nom du fichier de l'URL complète
            const fileName = admin.photoProfil.split('/').pop();
            return this.fileService.getFileUrl(fileName);
        }
        return 'assets/images/default-profile.png';
    }

}
