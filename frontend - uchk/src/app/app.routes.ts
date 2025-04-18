import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ClientLayoutComponent } from './layouts/client-layout/client-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuardGuard } from './core/guards/auth-guard.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  // route l'authentification
  { path: 'login', component:  LoginComponent},
  { path: 'register', component:  RegisterComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  // route pour la page de déconnexion
  // { path: 'logout', component: LogoutComponent },
  // route pour les pages d'erreurs
  // { path: '404', component: NotFoundComponent },
  // { path: '500', component: ServerErrorComponent },

  // routes pour les pages publiques
  {path: '',
    component: ClientLayoutComponent,
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)
  },

  // Route vers le module dashboard
  {path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuardGuard]
  },

  // route par défaut
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  // Route pour les pages non trouvées
  { path: '**', component: NotFoundComponent },
  { path: '**', redirectTo: 'accueil' }
];
