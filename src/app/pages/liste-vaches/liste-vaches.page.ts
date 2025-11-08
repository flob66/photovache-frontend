import { Component } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-liste-vaches',
  templateUrl: './liste-vaches.page.html',
  styleUrls: ['./liste-vaches.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListeVachesPage {
  vaches: any[] = [];
  filteredVaches: any[] = [];
  searchTerm: string = '';
  listening: boolean = false;

  constructor(
    private vacheService: VacheService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.loadVaches();
  }

  async startVoiceSearch() {
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
  }

  loadVaches() {
    this.vacheService.getAll()
      .then(res => {
        this.vaches = res.data;
        this.filteredVaches = [...this.vaches];
      })
      .catch(err => {
        console.error(err);
        this.showToast('Erreur lors du chargement des vaches', 'danger');
      });
  }

  filterVaches() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredVaches = !term
      ? [...this.vaches]
      : this.vaches.filter(v =>
          (v.numero && v.numero.toString().toLowerCase().includes(term)) ||
          (v.nom && v.nom.toLowerCase().includes(term))
        );
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
    this.router.navigate(['/edit-vache'], {
      queryParams: { data: encodeURIComponent(JSON.stringify(vache)) }
    });
  }

  async deleteVache(id: number, event: Event) {
    event.stopPropagation();

    const alert = await this.alertCtrl.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer cette vache et toutes ses photos ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          handler: async () => {
            await this.performDeleteVache(id);
          }
        }
      ]
    });

    await alert.present();
  }

  private async performDeleteVache(id: number) {
    try {
      const vache = this.vaches.find(v => v.id === id);
      if (vache) {
        const photos = [
          vache.photo_avant,
          vache.photo_arriere,
          vache.photo_cote_gauche,
          vache.photo_cote_droit
        ];

        for (const photoUri of photos) {
          if (photoUri) {
            try {
              const fileName = photoUri.split('/').pop();
              if (fileName) {
                await Filesystem.deleteFile({
                  path: `vache_photos/${fileName}`,
                  directory: Directory.External
                });
                console.log(`✅ Photo supprimée du stockage : ${fileName}`);
              }
            } catch (err) {
              console.warn('⚠️ Erreur suppression photo locale :', err);
            }
          }
        }
      }

      await this.vacheService.delete(id);
      this.showToast('Vache supprimée avec succès', 'success');
      this.loadVaches();

    } catch (err) {
      console.error('Erreur lors de la suppression de la vache :', err);
      this.showToast('Erreur lors de la suppression', 'danger');
    }
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' | 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
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