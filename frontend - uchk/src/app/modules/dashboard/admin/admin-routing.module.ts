import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import { UsersComponent } from './users/users.component';
import { AnnoncesComponent } from './annonces/annonces.component';
import { CandidaturesComponent } from './candidatures/candidatures.component';
import { DocumentsComponent } from './documents/documents.component';
import { AnneeAcademiqueComponent } from './annee-academique/annee-academique.component';
import { ProfilComponent } from './profil/profil.component';
import { GestionFormatDocComponent } from './gestion-format-doc/gestion-format-doc.component';
import { GestionTypeDocComponent } from './gestion-type-doc/gestion-type-doc.component';

const routes: Routes = [
    { path: '', component: AdminDashComponent},
    { path: 'admin', component: AdminDashComponent},
    { path: 'utilisateurs', component: UsersComponent},
    { path: 'annonces', component: AnnoncesComponent},
    { path: 'candidatures', component: CandidaturesComponent},
    { path: 'MesDocuments', component: DocumentsComponent},
    { path: 'formatDocument', component: GestionFormatDocComponent},
    { path: 'typeDocument', component: GestionTypeDocComponent},
    { path: 'anneesAcademiques', component: AnneeAcademiqueComponent},
    { path: 'profil', component: ProfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
