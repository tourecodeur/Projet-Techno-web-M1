import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth.service';

export const authGuardGuard= () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    if(authService.isLoggedIn()){
        return true;
    }

    window.location.href = '/login';

    return false;
};
