import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormatDocService } from '../../../../core/services/api/format-doc.service';
import { TypeDocService } from './../../../../core/services/api/type-doc.service';
import { ModalService } from '../../../../core/services/api/modal.service';


@Component({
  selector: 'app-gestion-type-doc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './gestion-type-doc.component.html',
  styleUrl: './gestion-type-doc.component.css'
})
export class GestionTypeDocComponent {

    tabTypeDoc: any = [];
    tabFormatDoc: any = [];
    selectedTypeDoc: any = [];
    typeDocForm!: FormGroup;
    typeDocFormUpdate!: FormGroup;
    typeDocFiltered: any[] = [];
    idFormatDocument!: number;
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;

    constructor(
        private formatDocService: FormatDocService,
        private typeDocService: TypeDocService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private modalService: ModalService
    ){
        this.typeDocForm = this.fb.group({
            nom_type: ['', Validators.required],
            description: ['', Validators.required],
            etat: ['ACTIF', Validators.required],
            est_obligatoire: ['false', Validators.required],
            id_format_document: ['', Validators.required],
        })

        this.typeDocFormUpdate = this.fb.group({
            nom_type: ['', Validators.required],
            description: ['', Validators.required],
            etat: ['', Validators.required],
            est_obligatoire: ['', Validators.required],
            id_format_document: ['', Validators.required],
        })
    }

    // Initialisations
    ngOnInit(): void {
        this.getAllFormatDocs();
        this.getAllTypeDocs();
    }

    // Récupérer tous les types docs
    getAllTypeDocs(){
        this.typeDocService.getTypesDoc().subscribe(
            (typeDocs) => {
                // console.log("Typesdocs", typeDocs);
                this.tabTypeDoc = typeDocs;
                this.updatePagination(); // Mettre à jour la pagination
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des typeDocs:', error);
            }
        )
    }

    // Récupérer tous les formats de documents
    getAllFormatDocs(){
        this.formatDocService.getFormatDoc().subscribe(
            (formatDoc) => {
                // console.log("Liste des formats docs", formatDoc);
                this.tabFormatDoc = formatDoc;
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la récupération des formats docs:', error);
            }
        )
    }
    // Ajouter un type de document
    addTypeDoc() {
        if (this.typeDocForm.valid) {
            let type = this.typeDocForm.value;

            // Vérification et conversion des valeurs
            const formatDocId = Number(type.id_format_document);

            if (!formatDocId || isNaN(formatDocId)) {
                this.toastr.error("Le format du document est requis");
                return;
            }

            const typeDocData = {
                nomType: type.nom_type.trim(),
                description: type.description.trim(),
                etat: type.etat,
                estObligatoire: type.est_obligatoire,
                formatDocumentId: type.id_format_document
            };

            // console.log("typeDocData à l'envoi:", typeDocData);

            // Appel à l'API pour ajouter le type de document
            this.typeDocService.createTypeDoc(typeDocData).subscribe({
                next: (typeDoc) => {
                    console.log("Type doc ajouté", typeDoc);
                    this.getAllTypeDocs();
                    this.typeDocForm.reset();
                    this.modalService.closeModal('ajoutTypeDoc');
                    this.toastr.success("TypeDoc ajouté avec succès !");
                },
                error: (error) => {
                    console.error('Une erreur s\'est produite lors de l\'ajout du type doc:', error);
                    this.toastr.error("Une erreur s'est produite lors de l'ajout du type doc.");
                }
            });
        }
    }
    // Afficher les détails d'un tye de document
    showdetailsTypeDoc(id: number) {
        this.selectedTypeDoc = this.tabTypeDoc.find(
            (typeDoc: any) => typeDoc.id === id
        );

        if (this.selectedTypeDoc) {
            // console.log("details type doc: ", this.selectedTypeDoc);
        } else {
            console.error("Type de document non trouvé");
            this.toastr.error("Type de document non trouvé");
        }
    }

    // Pré-remplir le formulaire de mise à jour
    preRemplirFormulaire(id: number) {
        this.selectedTypeDoc = this.tabTypeDoc.find(
            (typeDoc: any) => typeDoc.id === id
        );

        if (!this.selectedTypeDoc) {
            // console.error("type doc non trouvée !");
            this.toastr.error("Impossible de trouver le type doc.");
            return;
        }

        // Mettre à jour le formulaire avec les valeurs existantes
        this.typeDocFormUpdate.setValue({
            nom_type: this.selectedTypeDoc.nomType || '',
            description: this.selectedTypeDoc.description || '',
            est_obligatoire: this.selectedTypeDoc.estObligatoire || '',
            etat: this.selectedTypeDoc.etat || '',
            id_format_document: this.selectedTypeDoc.formatDocument?.id || '',
        });

        // console.log("Formulaire pré-rempli :", this.typeDocFormUpdate.value);
    }

    // Mettre à jour un type de document
    updateTypeDoc(id: number) {
        // console.log("ID typeDoc à modifier :", id);

        const formValues = this.typeDocFormUpdate.value;

        // Transformer les données pour correspondre au DTO attendu
        const donnees = {
            nomType: formValues.nom_type,
            description: formValues.description,
            estObligatoire: formValues.est_obligatoire,
            etat: formValues.etat,
            formatDocumentId: formValues.id_format_document
        };

        this.typeDocService.updateTypeDoc(id, donnees).subscribe(
            (updateTypeDoc) => {
                // console.log("Réponse API après mise à jour :", updateTypeDoc);
                this.tabTypeDoc = this.tabTypeDoc.map((typeDoc: any) =>
                    typeDoc.id === id ? { ...typeDoc, ...updateTypeDoc } : typeDoc
                );
                this.selectedTypeDoc = { ...updateTypeDoc };

                this.getAllTypeDocs();
                this.modalService.closeModal('modifierTypeDoc');

                this.toastr.success("Type doc mis à jour avec succès !");
            },
            (error) => {
                console.error("Erreur lors de la mise à jour du type doc :", error);
                this.toastr.error("Une erreur s'est produite lors de la mise à jour.");
            }
        );
    }

    // Supprimer une type de document
    deleteTypeDoc(id: number){
        this.typeDocService.deleteTypeDoc(id).subscribe(
            (typeDoc) => {
                // console.log("type doc supprimé", typeDoc);
                this.getAllTypeDocs();
                this.toastr.success("type doc supprimé avec succes !")
            },
            (error) => {
                console.error('Une erreur s\'est produite lors de la suppression du type doc:', error);
                this.toastr.error("Une erreur s'est produite lors de la suppression du type doc.");
            }
        )
    }

    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.typeDocFiltered = [...this.tabTypeDoc];
        // console.log("typeDocFiltered: ", this.typeDocFiltered);
        this.totalPages = Math.ceil(this.tabTypeDoc.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les types de documents paginées
    getPaginatedTypeDoc(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.typeDocFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchTypeDoc(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.typeDocFiltered = this.tabTypeDoc.filter((typDoc:any) =>
            typDoc.nomType.toLowerCase().includes(searchValue) ||
            typDoc.description.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.typeDocFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

}
