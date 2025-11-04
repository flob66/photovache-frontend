import { Component } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-vache',
  templateUrl: './edit-vache.page.html',
  styleUrls: ['./edit-vache.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule]
})
export class EditVachePage {
  vache = {
    id: null as number | null,
    numero: '',
    nom: '',
    photo_avant: null as string | null,
    photo_arriere: null as string | null,
    photo_cote_gauche: null as string | null,
    photo_cote_droit: null as string | null
  };

  constructor(private vacheService: VacheService, private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if(nav?.extras?.state?.['vache']){
      const v = nav.extras.state['vache'];
      this.vache = {
        id: v.id,
        numero: v.numero,
        nom: v.nom,
        photo_avant: v.photo_avant,
        photo_arriere: v.photo_arriere,
        photo_cote_gauche: v.photo_cote_gauche,
        photo_cote_droit: v.photo_cote_droit
      };
    }
  }

  async takePhoto(side: 'photo_avant' | 'photo_arriere' | 'photo_cote_gauche' | 'photo_cote_droit') {
    try {
      const image = await Camera.getPhoto({
        quality: 80, 
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
      if (image.dataUrl) {
        this.vache[side] = image.dataUrl;
      }
    } catch (error) {
      console.error('Erreur camera:', error);
    }
  }

  removePhoto(side: 'photo_avant' | 'photo_arriere' | 'photo_cote_gauche' | 'photo_cote_droit') {
    this.vache[side] = null;
  }

  async save() {
    if (!this.vache.numero.trim()) {
      alert('Le numéro est obligatoire');
      return;
    }

    const dataToSend = {
      numero: this.vache.numero,
      nom: this.vache.nom || null,
      photo_avant: this.vache.photo_avant,      
      photo_arriere: this.vache.photo_arriere,
      photo_cote_gauche: this.vache.photo_cote_gauche,
      photo_cote_droit: this.vache.photo_cote_droit
    };

    try {
      if(this.vache.id){ 
        await this.vacheService.update(this.vache.id, dataToSend);
        alert('Vache mise à jour !');
      } else { 
        await this.vacheService.create(dataToSend);
        alert('Vache ajoutée !');
        this.vache = { id: null, numero: '', nom: '', photo_avant: null, photo_arriere: null, photo_cote_gauche: null, photo_cote_droit: null };
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'enregistrement: ' + (err.message || 'Erreur inconnue'));
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