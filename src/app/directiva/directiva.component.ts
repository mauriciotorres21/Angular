import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {

  listaCurso: string[] = ['TypeScript' , 'JAvaScript', 'Java SE', 'PHP', 'C#'];
  habilitar: boolean = true;
  constructor() { }

  setHabilitar():void{
this.habilitar = !this.habilitar;
  }

}
