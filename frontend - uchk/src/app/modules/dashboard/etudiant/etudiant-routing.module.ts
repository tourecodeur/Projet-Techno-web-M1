import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashEtudiantComponent } from './dash-etudiant/dash-etudiant.component';
import { MesCoursComponent } from './mes-cours/mes-cours.component';
import { MesDiplomesComponent } from './mes-diplomes/mes-diplomes.component';
import { ProfilComponent } from './profil/profil.component';

const routes: Routes = [
    { path: '', component: DashEtudiantComponent},
    { path: 'mes-cours', component: MesCoursComponent},
    { path: 'mes-diplomes', component: MesDiplomesComponent},
    { path: 'profil-etudiant', component: ProfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }
