import { ChangeDetectorRef, Component } from '@angular/core';
import { CandidatureService } from '../../../../core/services/api/candidature.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { FileService } from '../../../../core/services/api/file.service';
import { DocumentService } from '../../../../core/services/api/document.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dash-candidat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dash-candidat.component.html',
  styleUrl: './dash-candidat.component.css'
})
export class DashCandidatComponent {
    data: any;
    options: any;
    tabDocuments: any = [];
    documentsFiltered: any = [];
    tabCandidatures: any = [];
    tabCandidaturesFiltered: any = [];
    selectedCandidature: any = [];
    selectedFile: File | null = null;
    selectedDocuments: any[] = [];
    annoncePostule: any = [];
    formcandidatureUpdate: FormGroup;
    userConnected: any = [];
    currentPage = 1;
    rowsPerPage = 4;
    totalPages = 0;

    constructor(
        private toastrService: ToastrService,
        private authService: AuthService,
        private fileService: FileService,
        private candidatureService: CandidatureService,
        private documentService: DocumentService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef
    ) {
        this.formcandidatureUpdate = this.fb.group({
            userId: ['', Validators.required],
            annonceId: ['', Validators.required],
            documentIds: ['', Validators.required],
            etat: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.getAllCandidatures();
        this.getAllDocuments();
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

    getSelectedDocumentIds(): string {
        return this.selectedDocuments.map(doc => doc.id).join(',');
    }

    getinfosUser(){
        const userConnected = this.authService.getCurrentUser();
        if(userConnected){
            this.userConnected = userConnected;
            // console.log("user infos: ", userConnected);
        }else{
            this.toastrService.error('Erreur lors de la récupération des informations de l\'utilisateur');
        }
    }

    // Liste des candidatures
    getAllCandidatures(){
        const userConnected = this.authService.getCurrentUser();
        // console.log("Uc: ", userConnected);
        if (userConnected) {
            this.candidatureService.getCandidatures().subscribe({
                next: (candidatures) => {
                    // console.log("Liste candidatures: ", candidatures);
                    this.tabCandidatures = candidatures;
                    // Filtrer les candidatures pour n'afficher que ceux de l'utilisateur connecté
                    this.tabCandidatures = this.tabCandidatures.filter((candidature: any) => candidature.user?.id === userConnected.userId);
                    this.tabCandidaturesFiltered = [...this.tabCandidatures];
                    this.updatePagination();
                    this.initChart();
                    // console.log("Candidatures de l'utilisateur:", this.tabCandidaturesFiltered);
                },
                error: (error) => this.toastrService.error('Erreur lors du chargement des candidatures de l\'utilisateur')
            });
        }
    }

    getAllDocuments(){
        const userConnected = this.authService.getCurrentUser();
        if (userConnected) {
            this.documentService.getDocuments().subscribe({
                next: (documents) => {
                    // console.log("docmentsList: ", documents);
                    // Filtrer les documents pour n'afficher que ceux de l'utilisateur connecté
                    this.tabDocuments = documents.filter(doc => doc.user?.id === userConnected.userId);
                    this.documentsFiltered = [...this.tabDocuments];
                    // this.updatePagination();
                    // console.log("documents de l'utilisateur:", this.tabDocuments);
                },
                error: (error) => this.toastrService.error('Erreur lors du chargement des documents')
            });
        }
    }

    showDetailsCandidature(candidature: any){
        this.selectedCandidature = {...candidature};
        // console.log("Candidature sélectionnée: ", this.selectedCandidature);
    }

    prepareCandidature(annonce: any) {
        this.annoncePostule = annonce;
        // console.log("Annonce pour candidature selectionné: ", this.annoncePostule);
        this.formcandidatureUpdate.patchValue({
            annonceId: annonce.id,
            userId: this.userConnected.userId,
            documentIds: this.getSelectedDocumentIds(),
            etat: 'PENDING'
        });
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

    onDocumentSelect(event: any, document: any) {
        if (event.target.checked) {
            // Vérifier si le document n'est pas déjà sélectionné
            if (!this.selectedDocuments.some(doc => doc.id === document.id)) {
                this.selectedDocuments.push(document);
            }
        } else {
            this.selectedDocuments = this.selectedDocuments.filter(doc => doc.id !== document.id);
        }

        this.formcandidatureUpdate.patchValue({
            documentIds: this.getSelectedDocumentIds()
        });
    }

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
            this.toastrService.error('Erreur lors du téléchargement');
        }
        );
    }

    // Met à jour la liste filtrée et le nombre total de pages
    updatePagination() {
        this.tabCandidaturesFiltered = [...this.tabCandidatures];
        // console.log("tabCandidaturesFiltered: ", this.tabCandidaturesFiltered);
        this.totalPages = Math.ceil(this.tabCandidatures.length / this.rowsPerPage);
    }

    // Change la page actuelle
    setPage(page: number) {
        if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        }
    }

    // Retourne les années annonces paginées
    getPaginatedCandidature(): any[] {
        const start = (this.currentPage - 1) * this.rowsPerPage;
        return this.tabCandidaturesFiltered.slice(start, start + this.rowsPerPage);
    }

    // Filtre la liste selon la recherche
    searchCandidature(event: any) {
        const searchValue = event.target.value.toLowerCase();
        this.tabCandidaturesFiltered = this.tabCandidatures.filter((candidature:any) =>
            candidature.annonce.titre.toLowerCase().includes(searchValue) ||
            candidature.annonce.description.toLowerCase().includes(searchValue) ||
            candidature.etat.toLowerCase().includes(searchValue)
        );


        this.totalPages = Math.ceil(this.tabCandidaturesFiltered.length / this.rowsPerPage);

        // Réinitialiser à la première page après filtrage
        this.currentPage = 1;
    }

    initChart() {
        const ctx = document.getElementById('candidatureChart') as HTMLCanvasElement;
        
        // taille du chart
        ctx.style.width = '400px';
        ctx.style.height = '400px'; 
        ctx.style.margin = 'auto'; 
        ctx.style.display = 'block'; 

        // Compter les différents états
        const pending = this.tabCandidatures.filter((c: any) => c.etat === 'PENDING').length;
        const rejected = this.tabCandidatures.filter((c: any) => c.etat === 'REJECTED').length;
        const cancelled = this.tabCandidatures.filter((c: any) => c.etat === 'CANCELLED').length;
        const hired = this.tabCandidatures.filter((c: any) => c.etat === 'HIRED').length;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['En attente', 'Rejetées', 'Annulées', 'Recruté(e)'],
                datasets: [{
                    data: [pending, rejected, cancelled, hired],
                    backgroundColor: [
                        '#FFA726',  // Orange pour En attente
                        '#EF5350',  // Rouge pour Rejetées
                        '#78909C',  // Gris pour Annulées
                        '#42A5F5'   // Bleu pour Recruté(e)
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '60%'
            }
        });
    }

}
