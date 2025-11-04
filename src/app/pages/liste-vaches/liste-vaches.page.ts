import { Component } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

@Component({
  selector: 'app-liste-vaches',
  templateUrl: './liste-vaches.page.html',
  styleUrls: ['./liste-vaches.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ]
})
export class ListeVachesPage {
  vaches: any[] = [];
  filteredVaches: any[] = [];
  searchTerm: string = '';
  listening: boolean = false;

  constructor(private vacheService: VacheService, private router: Router) {}

  ionViewWillEnter() {
    this.loadVaches();
  }

  async startVoiceSearch() {
    // try {
      await SpeechRecognition.requestPermissions();
    
      this.listening = true;
      const result = await SpeechRecognition.start({
        language: 'fr-FR',
        maxResults: 1,
        prompt: 'Parlez maintenant pour rechercher une vache',
        partialResults: false
      });
      this.listening = false;
      const spokenText = result.matches?.[0] || '';
      if (spokenText) {
        this.searchTerm = spokenText;
        this.filterVaches();
      }
    // } catch (err) {
    //   console.error('Erreur reconnaissance vocale:', err);
    //   this.listening = false;
    // }
  }

  loadVaches() {
    this.vacheService.getAll().then(res => {
      this.vaches = res.data;
      this.filteredVaches = [...this.vaches];
    }).catch(err => console.error(err));
  }

  filterVaches() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredVaches = [...this.vaches];
    } else {
      this.filteredVaches = this.vaches.filter(v =>
        (v.numero && v.numero.toString().toLowerCase().includes(term)) ||
        (v.nom && v.nom.toLowerCase().includes(term))
      );
    }
  }

  goToDetails(vache: any) {
    this.router.navigate(['/vache-details'], {
      queryParams: {
        data: encodeURIComponent(JSON.stringify(vache))
      }
    });
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
