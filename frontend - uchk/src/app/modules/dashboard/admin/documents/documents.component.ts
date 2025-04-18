import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../../../core/services/api/document.service';
import { Document } from '../../../../core/models/document';
import { ToastrService } from 'ngx-toastr';
import { TypeDocService } from '../../../../core/services/api/type-doc.service';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { SpinnerComponent } from '../../../../components/ui/spinner/spinner.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SpinnerComponent]
})
export class DocumentsComponent {
  // Stockage de tous les documents
  documents: any[] = [];
  // Stockage des types de documents
  typeDocuments: any[] = [];
  // Formulaire de gestion des documents
  documentForm: FormGroup;
  documentFormUpdate: FormGroup;
  // Fichier sélectionné pour l'upload
  selectedFile: File | null = null;
  // Stockage du document sélectionné pour la suppression
  selectedDocument: any = [];

  // Configuration de la pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  documentsFiltered: any = [];
  isLoading: boolean = false;

constructor (
    private documentService: DocumentService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private typeDocService: TypeDocService,
    private authService: AuthService
)
    {
    // Initialisation du formulaire avec validation
    this.documentForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      typeDocumentId: ['', Validators.required],
      userId: ['', Validators.required],
      file: [null]
    });

    this.documentFormUpdate = this.fb.group({
        titre: ['', Validators.required],
        description: ['', Validators.required],
        typeDocumentId: ['', Validators.required],
        userId: ['', Validators.required],
        file: ['']
    });
}

    /**
     * Initialisation du composant
     * Charge la liste des documents au démarrage
     */
    ngOnInit(): void {
            this.getTypeDocuments();
            this.loadUserDocuments();
            this.getUserConnected();
    }

    /**
     * Gère la sélection d'un fichier
     * @param event Événement de changement du input file
     */
    onFileSelected(event: any): void {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const maxSize = 15 * 1024 * 1024; // 15MB en bytes

            if (file.size > maxSize) {
                this.toastr.error('Le fichier est trop volumineux. Taille maximale: 15MB');
                event.target.value = '';
                return;
            }

            this.selectedFile = file;
        }
    }

    // Afficher les détails d'un tye de document
    showdetailsDoc(id: number) {
        this.selectedDocument = this.documents.find(
            (doc: any) => doc.id === id
        );

        if (this.selectedDocument) {
            // console.log("details doc: ", this.selectedDocument);
        } else {
            console.error("document non trouvé");
            this.toastr.error("document non trouvé");
        }
    }


    preRemplirFormulaire(id: number) {
        this.selectedDocument = this.documents.find(doc => doc.id === id);
        if (this.selectedDocument) {
            this.documentFormUpdate.patchValue({
                titre: this.selectedDocument.titre,
                description: this.selectedDocument.description,
                typeDocumentId: this.selectedDocument.typeDocument.id,
                userId: this.selectedDocument.user.id
            });
        }
    }

    updateDocument(): void {
        if (this.documentFormUpdate.valid) {
            const formData = new FormData();
            formData.append('titre', this.documentFormUpdate.get('titre')?.value);
            formData.append('description', this.documentFormUpdate.get('description')?.value);
            formData.append('typeDocumentId', this.documentFormUpdate.get('typeDocumentId')?.value);
            formData.append('userId', this.documentFormUpdate.get('userId')?.value);

            if (this.selectedFile) {
                formData.append('file', this.selectedFile);
            }

            this.documentService.updateDocument(this.selectedDocument.id, formData).subscribe({
                next: (response) => {
                    this.toastr.success('Document modifié avec succès');
                    this.loadUserDocuments();
                    this.documentFormUpdate.reset();
                    // Fermer la modal
                    document.getElementById('modifierDocument')?.classList.remove('show');
                    document.body.classList.remove('modal-open');
                    document.querySelector('.modal-backdrop')?.remove();
                },
                error: (error) => {
                    this.toastr.error('Erreur lors de la modification du document');
                    console.error('Erreur:', error);
                }
            });
        }
    }

    // Récupérer l'userId depuis le localStorage
    getUserConnected() {
        const userConnected = this.authService.getCurrentUser();
        if (userConnected) {
            // console.log('user connecté', userConnected);
            this.documentForm.patchValue({
                userId: userConnected.userId
            });
        } else {
            this.toastr.error('Utilisateur non connecté');
        }
    }
    /**
     * Gère l'upload d'un nouveau document
     * Crée un FormData avec les informations du document et le fichier
     */
    uploadDocument(): void {
        if (this.documentForm.valid && this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('titre', this.documentForm.get('titre')?.value);
        formData.append('description', this.documentForm.get('description')?.value);
        formData.append('typeDocumentId', this.documentForm.get('typeDocumentId')?.value);
        formData.append('userId', this.documentForm.get('userId')?.value);

        // Ajout de logs pour déboguer
        // console.log('FormData content:');
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        this.documentService.uploadDocument(formData).subscribe({
            next: (response) => {
            // console.log('Document response', response);
            this.toastr.success('Document uploadé avec succès');
            this.loadUserDocuments();
            this.documentForm.reset();
            // Fermeture de la modal
            document.getElementById('ajoutDocument')?.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop')?.remove();
            },
            error: (error) => {
            this.toastr.error('Erreur lors de l\'upload du document');
            }
        });
        }else {
            console.log('Form validation failed:', {
            formValid: this.documentForm.valid,
            fileSelected: !!this.selectedFile,
            formErrors: this.documentForm.errors,
            formValue: this.documentForm.value
            });
        }
    }

    /**
     * Récupère la liste des types de documents depuis l'API
     */
    getTypeDocuments(): void {
        this.typeDocService.getTypesDoc().subscribe({
        next: (typeDocuments) => {
            this.typeDocuments = typeDocuments;
            // console.log("typeDocs: ", typeDocuments);
        },
        error: (error) => {
            this.toastr.error('Erreur lors du chargement des types de documents');
            console.log("Erreur: ", error);
        }
        });
    }

    /**
     * Télécharge un document spécifique
     * @param id ID du document à télécharger
     */
    downloadDocument(id: number): void {
        this.documentService.downloadDocument(id).subscribe(
        (response: any) => {
            // Création du blob et téléchargement du fichier
            const blob = new Blob([response], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'document';
            link.click();
            window.URL.revokeObjectURL(url);
        },
        error => {
            this.toastr.error('Erreur lors du téléchargement');
        }
        );
    }

    /**
     * Charge la liste des documents du user depuis l'API
     * Met à jour les documents filtrés et la pagination
     */
    private loadUserDocuments(): void {
        const userConnected = this.authService.getCurrentUser();
        // console.log("Uc: ", userConnected);
        if (userConnected) {
            this.isLoading = true;
            setTimeout(() => {
                this.documentService.getDocuments().subscribe({
                    next: (documents) => {
                        // console.log("docmentsList: ", documents);
                        // Filtrer les documents pour n'afficher que ceux de l'utilisateur connecté
                        this.documents = documents.filter(doc => doc.user?.id === userConnected.userId);
                        this.documentsFiltered = [...this.documents];
                        this.updatePagination();
                        // console.log("documents de l'utilisateur:", this.documents);
                    },
                    error: (error) => {
                        this.toastr.error('Erreur lors du chargement des documents')
                    },
                    complete: () => {
                        this.isLoading = false;
                    }
                });
            }, 1000);
        }
    }

    /**
     * Filtre les documents selon un terme de recherche
     * @param event Événement de l'input de recherche
     */
    searchDocuments(event: any): void {
        const searchTerm = event.target.value.toLowerCase();
        this.documentsFiltered = this.documents.filter((doc: Document) =>
        doc.titre.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm)
        );
        this.updatePagination();
    }

    /**
     * Met à jour le nombre total d'éléments pour la pagination
     */
    private updatePagination(): void {
        this.totalItems = this.documentsFiltered.length;
    }

    /**
     * Retourne les documents de la page courante
     * @returns Liste des documents paginée
     */
    getPaginatedDocuments(): Document[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.documentsFiltered.slice(startIndex, startIndex + this.itemsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne le nombre total de pages
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.itemsPerPage);
    }

    /**
     * Change la page courante
     * @param page Numéro de la page à afficher
     */
    onPageChange(page: number): void {
        this.currentPage = page;
    }

}
