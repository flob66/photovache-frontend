import { Component, OnInit } from '@angular/core';
import { VacheService } from '../../services/vache.service';

@Component({
  selector: 'app-liste-vaches',
  templateUrl: './liste-vaches.page.html',
  styleUrls: ['./liste-vaches.page.scss'],
})
export class ListeVachesPage implements OnInit {
  vaches: any[] = [];

  constructor(private vacheService: VacheService) { }

  ngOnInit() {
    this.loadVaches();
  }

  loadVaches() {
    this.vacheService.getAll().then(res => {
      this.vaches = res.data;
    }).catch(err => console.error(err));
  }
}
