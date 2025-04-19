import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashFormateurComponent } from './dash-formateur/dash-formateur.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { MesEvaluationsComponent } from './mes-evaluations/mes-evaluations.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
    { path: '', component: DashFormateurComponent},
    { path: 'mes-cours', component: MesCoursComponent},
    { path: 'mes-evaluations', component: MesEvaluationsComponent},
    { path: 'profil', component: ProfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormateurRoutingModule { }
