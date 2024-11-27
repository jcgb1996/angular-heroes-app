import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'heroes-hero-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {

    ngOnInit(): void {
      if(!this.hero) throw new Error('heroe es requerido');
    }

    @Input()
    public hero!:Hero;
}
