import { CandidatService } from './../../../../core/services/api/candidat.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../../core/services/api/file.service';
import { ModalService } from '../../../../core/services/api/modal.service';

@Component({
  selector: 'app-gestion-candidat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-candidat.component.html',
  styleUrl: './gestion-candidat.component.css'
})
export class GestionCandidatComponent {

    tabsCandidats: any = [];
    tabsCandidatsFiltered: any[] = [];
    selectedCandidat: any = [];
    candidatFormAdd!: FormGroup;
    candidatFormUpdate!: FormGroup;
    selectedFile: File | null = null;
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;

    constructor(
        private candidatService: CandidatService,
        private toastr: ToastrService,
        private fileService: FileService,
        private authService: AuthService,
        private fb: FormBuilder,
        private modalService: ModalService
    ){
        this.candidatFormAdd = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            photoProfil: [''],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            role: ['CANDIDAT']
        });

        this.candidatFormUpdate = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            photoProfil: [''],
            prenom: ['', Validators.required],
            nom: ['', Validators.required],
            description: ['', Validators.required],
            adresse: ['', Validators.required],
            telephone: ['', Validators.required],
            role: ['CANDIDAT']
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
        this.getAllCandidats();
    }


    // Récupérer toutes les candidats
    getAllCandidats(){
        this.candidatService.getCandidats().subscribe(
            (candidats) => {
                // console.log("Liste des candidats", candidats);
                this.tabsCandidats = candidats;
                this.updatePagination(); // Mettre à jour la pagination
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des candidats:', error);
            }
        )
    }

    // Ajouter un candidat
    addCandidat(){
        if(this.selectedFile){
            // On upload l'image
            this.fileService.uploadFile(this.selectedFile).subscribe(
                (response) => {
                    // On récupère l'URL de l'image uploadée
                    const candidatData = this.candidatFormAdd.value;
                    candidatData.photoProfil = response.url;

                    // console.log("candidatData avant ajout: ", candidatData);

                    // Puis on crée le candidat avec l'URL de l'image
                    this.authService.inscription(candidatData).subscribe(
                        (candidat) => {
                            // console.log("candidat pour ajout", candidat);
                            this.getAllCandidats();
                            this.modalService.closeModal("ajoutCandidat");
                            this.candidatFormAdd.reset();
                            this.selectedFile = null;
                            this.toastr.success("candidat ajouté avec succes!")
                        },
                        (error) => {
                            console.error('Une erreur s\'est produite lors de l\'ajout d\'un candidat:', error);
                            this.toastr.error("Une erreur s'est produite lors de l'ajout d'un candidat'.");
                        }
                    )
                },
                (error) => {
                    console.error('Une erreur s\'est produite lors de l\'upload de l\'image:', error);
                    this.toastr.error("Une erreur s'est produite lors de l'upload de l'image.");
                }
            )
        }else {
            // Si pas d'image, on crée le candiddat directement
            this.candidatService.addCandidat(this.candidatFormAdd.value).subscribe(
                (candidat) => {
                    // console.log("Candidat pour ajout", candidat);
                    this.getAllCandidats();
                    this.modalService.closeModal("ajoutCandidat");
                    this.candidatFormAdd.reset();
                    this.toastr.success("candidat ajouté avec succes !")
                },
                (error) => {
                    console.error('Une erreur s\'est produite lors de l\'ajout du candidat:', error);
                    this.toastr.error("Une erreur s'est produite lors de l'ajout du candidat'.");
                }
            )
        }
    }

    // Méthode utilitaire pour fermer les modals
    private closeModal(modalId: string) {
        document.getElementById(modalId)?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
    }

    // Afficher les détails d'un candidat
    showdetailsCandidat(id:number){
        this.selectedCandidat = this.tabsCandidats.find(
            (candidat: any) => candidat.id === id
        );

        if (this.selectedCandidat) {
            // console.log("details candidat: ", this.selectedCandidat);
        } else {
            console.error("candidat non trouvé");
            this.toastr.error("candidat non trouvé");
        }
    }

    preRemplirFormulaire(id: number) {
        this.selectedCandidat = this.tabsCandidats.find(
            (candidat: any) => candidat.id === id
        );

        if (!this.selectedCandidat) {
            console.error("candidat non trouvée !");
            this.toastr.error("Impossible de trouver ce candidat.");
            return;
        }

        // Mettre à jour le formulaire avec les valeurs existantes
        this.candidatFormUpdate.setValue({
            prenom: this.selectedCandidat.prenom || '',
            nom: this.selectedCandidat.nom || '',
            password: this.selectedCandidat.password || '',
            email: this.selectedCandidat.email || '',
            description: this.selectedCandidat.description || '',
            adresse: this.selectedCandidat.adresse || '',
            telephone: this.selectedCandidat.telephone || '',
            photoProfil: this.selectedCandidat.photoProfil || '',
            role: this.selectedCandidat.role || 'CANDIDAT'
        });

        // console.log("Formulaire pré-rempli :", this.candidatFormUpdate.value);
    }

    // Mettre à jour un candidat
    updateCandidat(id: number) {
        if (this.selectedFile) {
            // Upload de la nouvelle image
            this.fileService.uploadFile(this.selectedFile).subscribe(
                (fileResponse) => {
                    const donnees = this.candidatFormUpdate.value;
                    donnees.photoProfil = fileResponse.url;

                    // console.log("données: ", donnees);

                    this.processUpdateCandidat(id, donnees);
                },
                (error) => {
                    console.error('Erreur upload image:', error);
                    this.toastr.error("Erreur lors de l'upload de l'image");
                }
            );
        } else {
            // Mise à jour sans nouvelle image
            const donnees = this.candidatFormUpdate.value;
            this.processUpdateCandidat(id, donnees);
        }
    }

    // Méthode pour traiter la mise à jour d'un candidat
    private processUpdateCandidat(id: number, donnees: any) {
        this.candidatService.updateCandidat(id, donnees).subscribe(
            (updateCandidat) => {

                // console.log("updatedCandidat: ", updateCandidat);

                this.tabsCandidats = this.tabsCandidats.map((candidat: any) =>
                    candidat.id === id ? { ...candidat, ...updateCandidat } : candidat
                );

                // Mettre à jour selectedCandidat
                this.selectedCandidat = { ...updateCandidat };
                this.getAllCandidats();
                this.candidatFormUpdate.reset();
                this.selectedFile = null;
                this.closeModal('modifierCandidat');
                this.toastr.success("Candidat modifié avec succès!");
            },
            (error) => {
                console.error("Erreur lors de la mise à jour:", error);
                this.toastr.error("Erreur lors de la mise à jour");
            }
        );
    }

    // Supprimer un admin
    deleteCandidat(id: number){
        this.candidatService.deleteCandidat(id).subscribe(
            (candidat) => {
                // console.log("candidat à supprimer", candidat);
                this.getAllCandidats();
                this.toastr.success("candidat supprimé avec succes !")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la suppression du candidat:', error);
                this.toastr.error("Une erreur s'est produite lors de la suppression du candidat.");
            }
        )
    }

    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.tabsCandidatsFiltered = [...this.tabsCandidats];
        // console.log("tabtabsCandidatsFiltered: ", this.tabsCandidatsFiltered);
        this.totalPages = Math.ceil(this.tabsCandidats.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les années admins paginées
    getPaginatedCandidats(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.tabsCandidatsFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchCandidat(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.tabsCandidatsFiltered = this.tabsCandidats.filter((candidat:any) =>
            candidat.prenom.toLowerCase().includes(searchValue) ||
            candidat.nom.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.tabsCandidatsFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

    // Méthode pour prévisualiser l'image
    getImageUrl(candidat: any): string {
        if (candidat?.photoProfil) {
            // Extrait le nom du fichier de l'URL complète
            const fileName = candidat.photoProfil.split('/').pop();
            return this.fileService.getFileUrl(fileName);
        }
        return 'assets/images/default-profile.png';
    }
}



