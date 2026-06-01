import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroReclamaciones } from './libro-reclamaciones';

describe('LibroReclamaciones', () => {
  let component: LibroReclamaciones;
  let fixture: ComponentFixture<LibroReclamaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroReclamaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroReclamaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
