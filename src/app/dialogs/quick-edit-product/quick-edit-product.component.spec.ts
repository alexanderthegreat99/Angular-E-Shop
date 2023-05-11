import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickEditProductComponent } from './quick-edit-product.component';

describe('QuickEditProductComponent', () => {
  let component: QuickEditProductComponent;
  let fixture: ComponentFixture<QuickEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickEditProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
