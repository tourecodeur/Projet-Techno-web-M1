import { AnneeAcademique } from './../../../../core/models/annee-academique';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DateFormatPipe } from '../../../../shared/pipes/dateFormatPipe';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnneeAcademiqueService } from '../../../../core/services/api/annee-academique.service';
import { AnnonceService } from '../../../../core/services/api/annonce.service';
import { ModalService } from '../../../../core/services/api/modal.service';
import { SpinnerComponent } from '../../../../components/ui/spinner/spinner.component';
import { FileService } from '../../../../core/services/api/file.service';

@Component({
  selector: 'app-annonces',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SpinnerComponent],
  providers: [DateFormatPipe],
  templateUrl: './annonces.component.html',
  styleUrl: './annonces.component.css'
})
export class AnnoncesComponent {

    tabsAnnonces: any = [];
    tabAnneeAcademiques: any = [];
    idAnneeAnnonce!: number;

    // Liste filtrée affichée dans le tableau
    tabAnnoncesFiltered: any[] = [];
    selectedAnnonce: any = [];
    annonceFormAdd!: FormGroup;
    annonceFormUpdate!: FormGroup;
    selectedFile: File | null = null;
    isLoading = false;
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;


    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private annonceService: AnnonceService,
        private modalService: ModalService,
        private fileService: FileService,
        private anneeAcademiqueService: AnneeAcademiqueService
    ){
        this.annonceFormAdd = this.fb.group({
            titre: ['', Validators.required],
            description: ['', Validators.required],
            idAnneeAnnonce: ['', Validators.required],
            auteur: ['', Validators.required],
            date_limite: ['', Validators.required],
            contenu: ['', Validators.required],
            etat: ['OUVERTE']
        });

        this.annonceFormUpdate = this.fb.group({
            titre: ['', Validators.required],
            description: ['', Validators.required],
            image: [''],
            idAnneeAnnonce: ['', Validators.required],
            auteur: ['', Validators.required],
            date_limite: ['', Validators.required],
            contenu: ['', Validators.required],
            etat: ['OUVERTE']
        })
    }

    ngOnInit(){
        this.updatePagination();
        this.getAllAnneeAcademiques();
        this.getAllAnnonces();
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

    // Récupérer toutes les années académiques
    getAllAnneeAcademiques(){
        this.anneeAcademiqueService.getAnneesAcademiques().subscribe(
            (annees) => {
                // console.log("Liste des annees academiques", annees);
                this.tabAnneeAcademiques = annees;
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des années académiques:', error);
            }
        )
    }


    // Récupérer toutes les annonces
    getAllAnnonces(){
        this.isLoading = true;
        setTimeout(() => {
            this.annonceService.getAnnonces().subscribe(
                {
                    next: (annonces) => {
                        // console.log("Liste des annonces", annonces);
                        this.tabsAnnonces = annonces;
                        this.updatePagination(); // Mettre à jour la pagination
                    },
                    error: (error) => {
                        console.error('Une erreur s\'est produite lors de la récupération des annonces:', error);
                    },
                    complete: () => {
                        this.isLoading = false;
                    }
                }
            )
        }, 1000);
    }

    // Ajouter une annonce
    addAnnonce() {
        if(this.selectedFile){
            // On upload l'image
            this.fileService.uploadFile(this.selectedFile).subscribe({
                next: (response) => {

                    // On récupère l'URL de l'image uploadée
                    let annonce = this.annonceFormAdd.value;
                    annonce = {
                        ...annonce,
                        image: response.url
                    }

                    // Vérifie si idAnneeAnnonce est bien défini et est un nombre
                    // console.log('Annonce avant envoi :', annonce);

                    const idAnneeAnnonce = +annonce.idAnneeAnnonce;

                    if (isNaN(idAnneeAnnonce)) {
                        this.annonceFormAdd
                            .get('idAnneeAnnonce')
                            ?.setErrors({ invalid: true });
                        return;
                    }

                    // S'assurer que idAnneeAnnonce ne soit pas envoyé dans le corps de la requête
                    const annonceData = {
                        titre: annonce.titre,
                        description: annonce.description,
                        contenu: annonce.contenu,
                        dateLimite: annonce.date_limite,
                        etat: annonce.etat,
                        auteur: annonce.auteur,
                        imageAnnonce: annonce.image,
                        anneeAcademiqueId: idAnneeAnnonce,
                    };

                    // console.log('annoncedata: ', annonceData);
                    // Appel à l'API pour ajouter l'annonce
                    this.annonceService.addAnnonce(annonceData).subscribe(
                        (annonce) => {
                            // console.log("Annonce ajoutée", annonce);
                            this.getAllAnnonces();
                            this.modalService.closeModal("ajoutAnnonce");
                            this.toastr.success("Annonce ajoutée avec succès !");
                        },
                        (error) => {
                            console.error('Une erreur s\'est produite lors de l\'ajout de l\'annonce:', error);
                            this.toastr.error("Une erreur s'est produite lors de l'ajout de l'annonce.");
                        }
                    );
                },
                error: (error) => {
                    console.error("Erreur lors de l'upload de l'image", error);
                    this.toastr.error(
                        "Une erreur s'est produite lors de l'upload de l'image."
                    );
                },
            });
        }
    }

    // Supprimer une annonce
    deleteAnnonce(id: number){
        this.annonceService.deleteAnnonce(id).subscribe(
            (annonce) => {
                // console.log("response annonce supprimée", annonce);
                this.getAllAnnonces();
                this.toastr.success("annonce supprimée avec succes !")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la suppression de l\'annonce:', error);
                this.toastr.error("Une erreur s'est produite lors de la suppression de l'annonce.");
            }
        )
    }

    // Afficher les détails d'une annonce
    showdetailsAnnonce(annonce:any){
        this.selectedAnnonce = {...annonce};
        // console.log("Annonce sélectionnée: ", this.selectedAnnonce);
    }

    preRemplirFormulaire(id: number) {
        this.selectedAnnonce = this.tabsAnnonces.find(
            (annonce: any) => annonce.id === id
        );

        if (!this.selectedAnnonce) {
            // console.error("annonce non trouvée !");
            this.toastr.error("Impossible de trouver l'annonce.");
            return;
        }

        // Mettre à jour le formulaire avec les valeurs existantes
        this.annonceFormUpdate.setValue({
            titre: this.selectedAnnonce.titre || '',
            description: this.selectedAnnonce.description || '',
            idAnneeAnnonce: this.selectedAnnonce.anneeAcademique?.id  || '',
            image: this.selectedAnnonce.imageAnnonce || '',
            auteur: this.selectedAnnonce.auteur || '',
            date_limite: this.selectedAnnonce.dateLimite || '',
            contenu: this.selectedAnnonce.contenu || '',
            etat: this.selectedAnnonce.etat || '',
        });

        // console.log("Formulaire pré-rempli :", this.annonceFormUpdate.value);
    }

    updateAnnonce(id: number) {
        // console.log("ID annonce à modifier :", id);

        const donnees = this.annonceFormUpdate.value;

        if(this.selectedFile){
            // Upload de la nouvelle image
            this.fileService.uploadFile(this.selectedFile).subscribe(
                (fileResponse) => {
                    const donnees = this.annonceFormUpdate.value;
                    donnees.image = fileResponse.url;

                    // console.log("données: ", donnees);

                    this.processUpdateAnnonce(id, donnees);
                },
                (error) => {
                    console.error('Erreur upload image:', error);
                    this.toastr.error("Erreur lors de l'upload de l'image");
                }
            );
        } else {
            // Mise à jour sans nouvelle image
            const donnees = this.annonceFormUpdate.value;
            this.processUpdateAnnonce(id, donnees);
        }
    }

    // Méthode pour traiter la mise à jour d'une annonce
    private processUpdateAnnonce(id: number, donnees: any) {
        // Format the data correctly before sending to the API
        const annonceData = {
            titre: donnees.titre,
            description: donnees.description,
            contenu: donnees.contenu,
            dateLimite: donnees.date_limite,
            etat: donnees.etat,
            auteur: donnees.auteur,
            imageAnnonce: donnees.image,
            anneeAcademiqueId: donnees.idAnneeAnnonce // Send just the ID instead of the whole object
        };

        this.annonceService.updateAnnonce(id, annonceData).subscribe(
            (updatedAnnonce) => {
                // console.log("updatedAnnonce: ", updatedAnnonce);
                this.tabsAnnonces = this.tabsAnnonces.map((annonce: any) =>
                    annonce.id === id ? { ...annonce, ...updatedAnnonce } : annonce
                );
                this.selectedAnnonce = { ...updatedAnnonce };
                this.getAllAnnonces();
                this.annonceFormUpdate.reset();
                this.selectedFile = null;
                this.modalService.closeModal("modifierAnnonce");
                this.toastr.success("Annonce modifiée avec succès!");
            },
            (error) => {
                console.error("Erreur lors de la mise à jour:", error);
                this.toastr.error("Erreur lors de la mise à jour");
            }
        );
    }


    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.tabAnnoncesFiltered = [...this.tabsAnnonces];
        // console.log("tabAnnoncesFiltered: ", this.tabAnnoncesFiltered);
        this.totalPages = Math.ceil(this.tabsAnnonces.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les années annonces paginées
    getPaginatedAnnonces(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.tabAnnoncesFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchAnnonce(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.tabAnnoncesFiltered = this.tabsAnnonces.filter((annonce:any) =>
            annonce.titre.toLowerCase().includes(searchValue) ||
            annonce.description.toLowerCase().includes(searchValue) ||
            annonce.auteur.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.tabAnnoncesFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

    // Méthode pour prévisualiser l'image
    getImageUrl(annonce: any): string {
        if (annonce?.imageAnnonce) {
            // Extrait le nom du fichier de l'URL complète
            const fileName = annonce.imageAnnonce.split('/').pop();
            return this.fileService.getFileUrl(fileName);
        }
        return 'assets/images/default-profile.png';
    }

}
