import { Component } from '@angular/core';
import { VacheService } from '../../services/vache.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-edit-vache',
  templateUrl: './edit-vache.page.html',
})
export class EditVachePage {
  vache = {
    numero: '',
    nom: '',
    photo_avant: '',
    photo_arriere: '',
    photo_cote_gauche: '',
    photo_cote_droit: ''
  };

  constructor(private vacheService: VacheService) {}

  async takePhoto(side: 'photo_avant' | 'photo_arriere' | 'photo_cote_gauche' | 'photo_cote_droit') {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    if (image.dataUrl) {
      this.vache[side] = image.dataUrl;
    }
  }

  save() {
    this.vacheService.create(this.vache).then(() => {
      alert('Vache ajoutée !');
    }).catch(err => console.error(err));
  }
}
