import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickMessageComponent } from './quick-message.component';


describe('QuickMessageComponent', () => {
  let component: QuickMessageComponent;
  let fixture: ComponentFixture<QuickMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
