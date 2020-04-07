import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService:AuthService, private route:Router) { }

  logout():void{
    let username =this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username} has cerrado sección con éxito!`, 'success');
    this.route.navigate(['/login'])

  }

  ngOnInit() {
  }

}
