import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashLayoutComponent } from '../../layouts/dash-layout/dash-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashLayoutComponent, // layout du dashboard
    children: [
       { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
       { path: 'candidat', loadChildren: () => import('./candidat/candidat.module').then(m => m.CandidatModule) },
       // Redirection par défaut
       { path: '', redirectTo: 'admin', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
