import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarProductoComponent } from './adicionar-producto.component';

describe('AdicionarProductoComponent', () => {
  let component: AdicionarProductoComponent;
  let fixture: ComponentFixture<AdicionarProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdicionarProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
