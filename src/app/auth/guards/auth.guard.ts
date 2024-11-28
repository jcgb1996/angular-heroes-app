import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, tap } from 'rxjs';

// Función común para verificar autenticación y redirigir
const checkAuthentication = (authService: AuthService, router: Router): boolean | Observable<boolean> => {
  return authService.checkAuthenticationStatus().pipe(
    tap((resp) => {
      if (!resp) router.navigate(['./auth/login']);
    })
  );
};

// Implementación de CanActivateFn como función
export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | Observable<boolean> => {
  const authService = inject(AuthService);  // Inyectar AuthService
  const router = inject(Router);  // Inyectar Router

  console.log('canActivateGuard', { route, state });

  return checkAuthentication(authService, router);  // Usar la función común
};

// Implementación de CanMatchFn como función
export const canMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | Observable<boolean> => {
  const authService = inject(AuthService);  // Inyectar AuthService
  const router = inject(Router);  // Inyectar Router

  console.log('canMatchGuard', { route, segments });

  return checkAuthentication(authService, router);  // Usar la función común
};
