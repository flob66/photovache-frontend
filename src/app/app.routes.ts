import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'liste-vaches',
    loadComponent: () => import('./pages/liste-vaches/liste-vaches.page').then( m => m.ListeVachesPage)
  },
  {
    path: 'edit-vache',
    loadComponent: () => import('./pages/edit-vache/edit-vache.page').then( m => m.EditVachePage)
  },
  {
    path: 'vache-details',
    loadComponent: () => import('./pages/vache-details/vache-details.page').then( m => m.VacheDetailsPage)
  },
];
