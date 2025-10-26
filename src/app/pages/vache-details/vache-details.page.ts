import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if(nav?.extras?.state?.['vache']) {
      this.vache = nav.extras.state['vache'];
    }
  }

  ngOnInit() {}

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
