import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
  export class NewPageComponent implements OnInit {

    public heroForm = new FormGroup({
        id: new FormControl<string>(''),
        superhero: new FormControl<string>('', { nonNullable:false }),
        publisher: new FormControl<Publisher>(Publisher.DCComics),
        alter_ego: new FormControl(''),
        first_appearance: new FormControl(''),
        characters: new FormControl(''),
        alt_img: new FormControl(''),
    });

    public publisher= [
      {
        id: 'DC Comics',
        desc: 'DC - Comics'
      },
      {
        id: 'Marvel Comics',
        desc: 'Marvel - Comics'
      }
    ]

    get currentHero(): Hero{
      const hero = this.heroForm.value as Hero;
      return hero;
    }

    constructor(
        private heroesService:HeroesService,
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog
      ){}

    ngOnInit(): void {
      if(!this.route.url.includes('edit'))return;

      this.activatedRoute.params
      .pipe(
        switchMap( ({id})=> this.heroesService.getHeroesById(id)  ),
      )
      .subscribe(
        hero => {
            if(!hero) return this.route.navigateByUrl('/');

            this.heroForm.reset(hero);
            return;
        }
      );
    }

    onSubmite(): void{

      if(this.heroForm.invalid)return;

      if(this.currentHero.id){
        this.heroesService.updateHero(this.currentHero)
        .subscribe(
          hero => {
            this.showSnackBar(`${hero.superhero} actualizado!`);
          }
        );
        return;
      }

      this.heroesService.addHero(this.currentHero) .subscribe(
        hero => {
          this.route.navigate(['/heroes/edit', hero.id]);
          this.showSnackBar(`${hero.superhero} Guardado!`);
        }
      );


    }


    oncDeleteHero(): void{
      if(!this.currentHero.id) throw Error('Heroe es requerido');

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: this.heroForm.value,
      });

      dialogRef.afterClosed()
      .pipe(
        filter((resut:boolean) => resut),
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((result:boolean)=>  result)
      )
      .subscribe(() => {
        this.route.navigate(['/heroes']);
      });


      // dialogRef.afterClosed().subscribe(result => {
//        if(!result) return;
//
//        this.heroesService.deleteHeroById(this.currentHero.id)
//        .subscribe(r=> {
//          if(r) return this.route.navigate(['/heroes']);
//
//          return;
//        });
//
//      });
    }

    showSnackBar(mensaje: string): void {
      this.snackbar.open( mensaje, 'done', {
        duration: 2500
      } )
    }
}
