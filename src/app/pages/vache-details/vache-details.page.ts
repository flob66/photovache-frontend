import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vache-details',
  templateUrl: './vache-details.page.html',
  styleUrls: ['./vache-details.page.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class VacheDetailsPage implements OnInit {
  vache: any = null;
  isPhotoModalOpen = false;
  currentPhoto: string | null = null;
  currentPhotoTitle: string = '';
  zoomed = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.vache = JSON.parse(decodeURIComponent(params['data']));
      }
    });
  }

  onDoubleTap(event: TouchEvent) {
    const img = event.target as HTMLImageElement;
    if (!this.zoomed) {
      img.style.transform = 'scale(2)';
      this.zoomed = true;
    } else {
      img.style.transform = 'scale(1)';
      this.zoomed = false;
    }
  }

  openPhoto(photoUrl: string, title: string) {
    this.currentPhoto = photoUrl;
    this.currentPhotoTitle = title;
    this.isPhotoModalOpen = true;
  }

  closePhoto() {
    this.isPhotoModalOpen = false;
    this.currentPhoto = null;
    this.currentPhotoTitle = '';
  }

  goToHome() { this.router.navigate(['/']); }
  goToAddVache() { this.router.navigate(['/edit-vache']); }
  goToListe() { this.router.navigate(['/liste-vaches']); }
}