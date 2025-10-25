import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacheDetailsPage } from './vache-details.page';

describe('VacheDetailsPage', () => {
  let component: VacheDetailsPage;
  let fixture: ComponentFixture<VacheDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VacheDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
