import { Routes } from '@angular/router';

type AppRoutesPathName = 'PLANT_STATUS' | 'DEFAULT';

export const ROUTES_PATH: Record<AppRoutesPathName, string> = {
  PLANT_STATUS: 'plant-status',
  DEFAULT: 'plant-status',
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ROUTES_PATH.DEFAULT,
  },
  {
    path: ROUTES_PATH.PLANT_STATUS,
    loadChildren: () => import('./pages/plant-status/plant-status.routes'),
  },
  {
    path: '**',
    redirectTo: ROUTES_PATH.DEFAULT,
  },
];
