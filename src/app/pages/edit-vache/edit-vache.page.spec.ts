import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditVachePage } from './edit-vache.page';

describe('EditVachePage', () => {
  let component: EditVachePage;
  let fixture: ComponentFixture<EditVachePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVachePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
