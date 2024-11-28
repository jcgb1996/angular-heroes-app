import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, tap } from 'rxjs';

// Función común para verificar autenticación y redirigir
const checkAuthentication = (authService: AuthService, router: Router): boolean | Observable<boolean> => {
  return authService.checkAuthenticationStatus().pipe(
    tap((resp) => {
      console.log(resp);
      if (resp) router.navigate(['./']);
    }),
    map(
      resp => !resp
    )
  );
};

// Implementación de CanActivateFn como función
export const canActivatePublic: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | Observable<boolean> => {
  const authService = inject(AuthService);  // Inyectar AuthService
  const router = inject(Router);  // Inyectar Router

  console.log('canActivateGuardPublic', { route, state });

  return checkAuthentication(authService, router);  // Usar la función común
};

// Implementación de CanMatchFn como función
export const canMatchPublic: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | Observable<boolean> => {
  const authService = inject(AuthService);  // Inyectar AuthService
  const router = inject(Router);  // Inyectar Router

  console.log('canMatchGuardPublic', { route, segments });

  return checkAuthentication(authService, router);  // Usar la función común
};
