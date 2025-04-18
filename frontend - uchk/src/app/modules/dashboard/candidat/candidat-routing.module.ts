import { Candidat } from './../../../core/models/candidat';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashCandidatComponent } from './dash-candidat/dash-candidat.component';
import { CandidaturesComponent } from './candidatures/candidatures.component';
import { GestionProfilComponent } from './gestion-profil/gestion-profil.component';
import { DocumentsComponent } from '../candidat/documents/documents.component';
import { AnnoncesComponent } from '../candidat/annonces/annonces.component';

const routes: Routes = [
    { path: '', component: DashCandidatComponent},
    { path: 'dashboard', component: DashCandidatComponent},
    { path: 'candidatures', component: CandidaturesComponent},
    { path: 'compte', component: GestionProfilComponent},
    { path: 'Documents', component: DocumentsComponent},
    { path: 'annonces', component: AnnoncesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatRoutingModule { }
