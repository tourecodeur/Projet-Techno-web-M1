import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccueilComponent} from "./accueil/accueil.component";
import {AboutComponent} from "./about/about.component";
import { ContactComponent } from "./contact/contact.component";
import { DetailAnnonceComponent } from './detail-annonce/detail-annonce.component';
import { AnnoncesClientComponent } from './annonces-client/annonces-client.component';
import { CommunicationComponent } from './communication/communication.component';

const routes: Routes = [
  { path: '', component: AccueilComponent},
  { path: 'accueil', component: AccueilComponent},
  { path: 'about', component: AboutComponent},
  { path: 'annonces', component: AnnoncesClientComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'detailAnnonce/:id', component: DetailAnnonceComponent},
  { path: 'communication', component: CommunicationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
