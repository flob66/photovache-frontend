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

  constructor(private router: Router, private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.vache = JSON.parse(decodeURIComponent(params['data']));
      }
    });
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
