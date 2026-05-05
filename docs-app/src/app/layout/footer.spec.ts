import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';

describe('Footer', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
