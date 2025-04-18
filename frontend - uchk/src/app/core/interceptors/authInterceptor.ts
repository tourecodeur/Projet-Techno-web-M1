import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) =>{

    // Vérifier si la requête nécessite une autorisation
    const requiresAuth = req.headers.has('AuthorizationRequired') && req.headers.get('AuthorizationRequired') === 'true';

    // Si un token est disponible et que la requête nécessite une autorisation
    if (requiresAuth) {
        const token = localStorage.getItem('token');
        console.log("object token", token);
        
        if (token) {
            // Cloner la requête pour ajouter l'en-tête Authorization
            const modifiedReq = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            return next(modifiedReq);
        }
    }else {
        // console.error('Token non trouvé');
    }

    // Si aucun token ou aucune autorisation n'est requise, continuer sans modification
    return next(req);
    
};
