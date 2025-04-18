import { ChangeDetectorRef, Component } from '@angular/core';
import { CandidatureService } from '../../../../core/services/api/candidature.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService/auth.service';
import { FileService } from '../../../../core/services/api/file.service';
import { DocumentService } from '../../../../core/services/api/document.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { AnnonceService } from '../../../../core/services/api/annonce.service';
import { CandidatService } from '../../../../core/services/api/candidat.service';

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dash.component.html',
  styleUrl: './admin-dash.component.css'
})
export class AdminDashComponent {

    data: any;
    options: any;
    tabDocuments: any = [];
    tabAnnonces: any = [];
    tabCandidats: any = [];
    documents: any = [];
    documentsFiltered: any = [];
    tabCandidatures: any = [];
    tabCandidaturesFiltered: any = [];
    selectedDocuments: any[] = [];
    selectedCandidature: any = [];
    annoncePostule: any = [];
    selectedFile: File | null = null;
    formcandidatureUpdate: FormGroup;
    userConnected: any = [];
    currentPage = 1;
    rowsPerPage = 3;
    totalPages = 0;

    constructor(
        private toastrService: ToastrService,
        private authService: AuthService,
        private fileService: FileService,
        private candidatureService: CandidatureService,
        private annonceService: AnnonceService,
        private candidatService: CandidatService,
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
        this.getAllAnnonces();
        this.getAllCandidats();
        this.getAllDocuments();
    }

    getSelectedDocumentIds(): string {
        return this.selectedDocuments.map(doc => doc.id).join(',');
    }

    getAllCandidatures(){
        this.candidatureService.getCandidatures().subscribe(
            (data) => {
                this.tabCandidatures = data;
                // console.log("dataCandidatures: ", this.tabCandidatures);
                this.tabCandidaturesFiltered = [...this.tabCandidatures];
                this.updatePagination();
                this.initChart();
            },
            (error) => {
                console.log("Erreur lors de la récupération des candidatures: ", error)
            }
        )
    }

    getAllAnnonces(){
        this.annonceService.getAnnonces().subscribe(
            (data) => {
                this.tabAnnonces = data;
                // console.log("datAnnonces: ", this.tabAnnonces);

            },
            (error) => {
                console.log("Erreur lors de la récupération des annonces: ", error)
            }
        )
    }

    getAllCandidats(){
        this.candidatService.getCandidats().subscribe(
            (data) => {
                this.tabCandidats = data;
                // console.log("dataCandidats: ", this.tabCandidats);
            },
            (error) => {
                console.log("Erreur lors de la récupération des candidats: ", error)
            }
        )
    }

    getAllDocuments(){
        const userConnected = this.authService.getCurrentUser();
        // console.log("Uc: ", userConnected);
        if (userConnected) {
            this.documentService.getDocuments().subscribe({
                next: (documents) => {
                    // console.log("docmentsList: ", documents);
                    // Filtrer les documents pour n'afficher que ceux de l'utilisateur connecté
                    this.documents = documents.filter(doc => doc.user?.id === userConnected.userId);
                    this.documentsFiltered = [...this.documents];
                    // console.log("documents de l'utilisateur:", this.documents);
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
        // console.log("ctx: ", ctx);

        // Compter les différents états
        const pending = this.tabCandidaturesFiltered.filter((c: any) => c.etat === 'PENDING').length;
        const rejected = this.tabCandidaturesFiltered.filter((c: any) => c.etat === 'REJECTED').length;
        const cancelled = this.tabCandidaturesFiltered.filter((c: any) => c.etat === 'CANCELLED').length;
        const hired = this.tabCandidaturesFiltered.filter((c: any) => c.etat === 'HIRED').length;

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
