import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeVachesPage } from './liste-vaches.page';

describe('ListeVachesPage', () => {
  let component: ListeVachesPage;
  let fixture: ComponentFixture<ListeVachesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeVachesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
