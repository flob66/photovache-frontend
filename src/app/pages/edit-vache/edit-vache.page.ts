import { Component, OnDestroy } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Subscription } from 'rxjs';

type PhotoSide = 'photo_avant' | 'photo_arriere' | 'photo_cote_gauche' | 'photo_cote_droit';

interface Vache {
  id: number | null;
  numero: string;
  nom: string | null;
  photo_avant: string | null;
  photo_arriere: string | null;
  photo_cote_gauche: string | null;
  photo_cote_droit: string | null;
}

@Component({
  selector: 'app-edit-vache',
  templateUrl: './edit-vache.page.html',
  styleUrls: ['./edit-vache.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class EditVachePage implements OnDestroy {
  vache: Vache = this.getEmptyVache();
  private querySub?: Subscription;

  photoSides: PhotoSide[] = ['photo_avant', 'photo_arriere', 'photo_cote_gauche', 'photo_cote_droit'];

  constructor(
    private vacheService: VacheService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.listenToQueryParams();
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
  }

  private listenToQueryParams() {
    this.querySub?.unsubscribe(); 
    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          this.vache = JSON.parse(decodeURIComponent(params['data']));
          console.log('📥 Vache chargée depuis queryParams :', this.vache);
        } catch (e) {
          console.error('❌ Erreur décodage vache :', e);
          this.vache = this.getEmptyVache();
        }
      } else {
        this.vache = this.getEmptyVache();
        console.log('🧹 Aucune vache passée — formulaire réinitialisé');
      }
    });
  }

  private getEmptyVache(): Vache {
    return {
      id: null,
      numero: '',
      nom: null,
      photo_avant: null,
      photo_arriere: null,
      photo_cote_gauche: null,
      photo_cote_droit: null
    };
  }

  async savePhotoToDevice(dataUrl: string, side: PhotoSide): Promise<string> {
    const fileName = `${side}_${new Date().getTime()}.jpeg`;
    const path = `vache_photos/${fileName}`;

    const savedFile = await Filesystem.writeFile({
      path,
      data: dataUrl.split(',')[1],
      directory: Directory.External,
      recursive: true
    });

    return Capacitor.convertFileSrc(savedFile.uri);
  }

  async takePhoto(side: PhotoSide) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      if (image.dataUrl) {
        if (this.vache[side]) {
          await this.deletePhotoFromStorage(this.vache[side]!);
        }
        this.vache[side] = await this.savePhotoToDevice(image.dataUrl, side);
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      this.showToast('Erreur lors de la capture photo', 'danger');
    }
  }

  async removePhoto(side: PhotoSide) {
    if (this.vache[side]) {
      await this.deletePhotoFromStorage(this.vache[side]!);
      this.vache[side] = null;
      this.showToast('Photo supprimée', 'medium');
    }
  }

  private async deletePhotoFromStorage(photoUri: string) {
    try {
      const fileName = photoUri.split('/').pop();
      if (!fileName) return;

      await Filesystem.deleteFile({
        path: `vache_photos/${fileName}`,
        directory: Directory.External
      });

      console.log('✅ Photo supprimée du stockage :', fileName);
    } catch (err) {
      console.warn('⚠️ Erreur suppression photo :', err);
    }
  }

  async save() {
    if (!this.vache.numero.trim()) {
      this.showToast('Le numéro est obligatoire', 'warning');
      return;
    }

    const dataToSend = { ...this.vache };

    try {
      if (this.vache.id) {
        await this.vacheService.update(this.vache.id, dataToSend);
        await this.showToast('Vache mise à jour avec succès !', 'success');
      } else {
        await this.vacheService.create(dataToSend);
        await this.showToast('Vache ajoutée avec succès !', 'success');
      }

      this.router.navigate(['/liste-vaches']);
    } catch (err: any) {
      console.error('Erreur:', err);
      this.showToast('Erreur lors de l’enregistrement', 'danger');
    }
  }

  async deleteVache() {
    if (!this.vache.id) return;

    const confirmDelete = confirm('Supprimer définitivement cette vache ?');
    if (!confirmDelete) return;

    try {
      for (const side of this.photoSides) {
        if (this.vache[side]) {
          await this.deletePhotoFromStorage(this.vache[side]!);
        }
      }

      await this.vacheService.delete(this.vache.id);
      await this.showToast('Vache supprimée avec succès !', 'success');
      this.router.navigate(['/liste-vaches']);
    } catch (err) {
      console.error('Erreur suppression vache:', err);
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

  goToHome() { this.router.navigate(['/']); }
  goToAddVache() { this.router.navigate(['/edit-vache']); }
  goToListe() { this.router.navigate(['/liste-vaches']); }
}