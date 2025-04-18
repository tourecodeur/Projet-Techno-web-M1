import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormatDocService } from '../../../../core/services/api/format-doc.service';
import { SpinnerComponent } from '../../../../components/ui/spinner/spinner.component';
import { ModalService } from '../../../../core/services/api/modal.service';

@Component({
  selector: 'app-gestion-format-doc',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SpinnerComponent],
  templateUrl: './gestion-format-doc.component.html',
  styleUrl: './gestion-format-doc.component.css'
})
export class GestionFormatDocComponent {

    tabFormatDoc: any = [];
    selectedFormatDoc: any = [];
    formatDocForm!: FormGroup;
    formatDocFormUpdate!: FormGroup;
    formatDocFiltered: any[] = [];
    isLoading = false;
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;

    constructor(
        private formatDocService: FormatDocService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private modalService: ModalService
    ){
        this.formatDocForm = this.fb.group({
            nomFormat: ['', Validators.required],
            description: ['', Validators.required],
            etat: true,
        })

        this.formatDocFormUpdate = this.fb.group({
            nomFormat: ['', Validators.required],
            description: ['', Validators.required],
            etat: true,
        })
    }

    // Initialisation du composant
    ngOnInit() {
        this.updatePagination();
        this.getAllFormatDocs();
    }

    // Récupérer tous les formats docs
    getAllFormatDocs(){
        this.isLoading = true;
        setTimeout(() => {
            this.formatDocService.getFormatDoc().subscribe({

                next: (formatDoc) => {
                    // console.log("FormatsDocs", formatDoc);
                    this.tabFormatDoc = formatDoc;
                    this.updatePagination(); // Mettre à jour la pagination
                },
                error: (error) => {
                    console.error('Une erreur s\'est produite lors de la récupération des formatsDocs:', error);
                },
                complete: () => {
                    this.isLoading = false;
                }

            })
        }, 1000);
    }

    // Ajouter un format doc
    addFormatDoc(){
        const formatDoc = this.formatDocForm.value;
        this.formatDocService.createFormatDoc(formatDoc).subscribe(
            (formatDoc) => {
                // console.log("formatDoc", formatDoc);
                this.getAllFormatDocs();
                this.modalService.closeModal('ajoutFormatDoc');
                this.formatDocForm.reset();
                this.toastr.success("formatDoc ajouté avec succes!")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de l\'ajout du formatDoc:', error);
                this.toastr.error("Une erreur s'est produite lors de l'ajout du formatDoc.");
            }
        )
    }

    // Modifier un format doc
    updateFormatDoc(id: number) {
        // console.log("ID formatDoc à modifier :", id);

        const donnees = this.formatDocFormUpdate.value;
        this.formatDocService.updateFormatDoc(id, donnees).subscribe(
            (updateFormatDoc) => {
                // console.log("Réponse API après mise à jour :", updateFormatDoc);

                // Mettre à jour l'élément correspondant dans tabAnneesAcademiques
                this.tabFormatDoc = this.tabFormatDoc.map((formatDoc: any) =>
                    formatDoc.id_formatDoc === id ? { ...formatDoc, ...updateFormatDoc } : formatDoc
                );

                // Vérifier que selectedFormatDoc est bien mise à jour
                this.selectedFormatDoc = { ...updateFormatDoc };

                // Réafficher les nouvelles valeurs dans le formulaire
                this.formatDocFormUpdate.patchValue({
                    nomFormat: updateFormatDoc.nomFormat,
                    description: updateFormatDoc.description,
                    etat: updateFormatDoc.etat,
                });

                // console.log("Données mises à jour dans le formulaire :", this.formatDocFormUpdate.value);

                this.getAllFormatDocs();
                this.modalService.closeModal('modifierFormatDoc');


                this.toastr.success("FormatDoc mise à jour avec succès !");
            },
            (error) => {
                console.error("Erreur lors de la mise à jour du formatDoc :", error);
                this.toastr.error("Une erreur s'est produite lors de la mise à jour.");
            }
        );
    }

    // Supprimer un format doc
    deleteFormatDoc(id: number){
        this.formatDocService.deleteFormatDoc(id).subscribe(
            (formatDoc) => {
                // console.log("formatDoc", formatDoc);
                this.getAllFormatDocs();
                this.toastr.success("formatDoc supprimé avec succes!")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la suppression du formatDoc:', error);
                this.toastr.error("Une erreur s'est produite lors de la suppression du formatDoc.");
            }
        )
    }
    // Afficher les détails d'un formatDoc
    showdetailsFormatDoc(id: number) {
        this.selectedFormatDoc = this.tabFormatDoc.find(
            (formatDoc: any) => formatDoc.id === id
        );

        if (this.selectedFormatDoc) {
            // console.log("details format doc: ", this.selectedFormatDoc);
        } else {
            console.error("Format document non trouvé");
            this.toastr.error("Format document non trouvé");
        }
    }
    preRemplirFormulaire(id: number) {
        this.selectedFormatDoc = this.tabFormatDoc.find(
            (formatDoc: any) => formatDoc.id === id
        );

        if (!this.selectedFormatDoc) {
            // console.error("formatDoc non trouvée !");
            this.toastr.error("Impossible de trouver formatDoc.");
            return;
        }

        // Mettre à jour le formulaire avec les valeurs existantes
        this.formatDocFormUpdate.setValue({
            nomFormat: this.selectedFormatDoc.nomFormat || '',
            description: this.selectedFormatDoc.description || '',
            etat: this.selectedFormatDoc.etat || ''
        });

        // console.log("Formulaire pré-rempli :", this.formatDocFormUpdate.value);
    }

    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.formatDocFiltered = [...this.tabFormatDoc];
        this.totalPages = Math.ceil(this.tabFormatDoc.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les formatDocs paginés
    getPaginatedFormatDoc(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.formatDocFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchFormatDoc(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.formatDocFiltered = this.tabFormatDoc.filter(
            (formatDoc: any) =>
            formatDoc.nomFormat.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.formatDocFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

}
