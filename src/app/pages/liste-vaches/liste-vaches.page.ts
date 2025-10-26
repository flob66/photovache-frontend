import { Component } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-liste-vaches',
  templateUrl: './liste-vaches.page.html',
  styleUrls: ['./liste-vaches.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class ListeVachesPage {
  vaches: any[] = [];

  constructor(private vacheService: VacheService, private router: Router) { }

  ionViewWillEnter() {
    this.loadVaches();
  }

  loadVaches() {
    this.vacheService.getAll().then(res => {
      this.vaches = res.data;
    }).catch(err => console.error(err));
  }

  goToDetails(vache: any) {
    this.router.navigate(['/vache-details'], { state: { vache } });
  }

  editVache(vache: any, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/edit-vache'], { state: { vache } });
  }

  deleteVache(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Voulez-vous vraiment supprimer cette vache ?')) {
      this.vacheService.delete(id).then(() => {
        alert('Vache supprimée !');
        this.loadVaches(); 
      }).catch(err => console.error(err));
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToAddVache() {
    this.router.navigate(['/edit-vache']);
  }

  goToListe() {
    this.router.navigate(['/liste-vaches']);
  }
}
