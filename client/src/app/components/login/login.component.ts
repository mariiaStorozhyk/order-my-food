import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginUser;

  constructor(private router: Router, private authService: AuthService, private hotelService: HotelService) { }

  customError = (statusText, statusMessage) => {
    return {
      statusText,
      message: statusMessage
    };
  }

  openLoginModal = async () => {
    await Swal.fire({
      icon: 'info',
      title: 'Вхід',
      html:
      '<input id="email" type="email" class="swal2-input" autocomplete="off" placeholder="Email" required>' +
      '<input id="password" type="password" class="swal2-input" autocomplete="off" placeholder="Пароль" required>' +
      '<b>Новий користувач?</b> <br>' +
      '<a href="/register">Натисніть тут для реєстрації</a> ',
      focusConfirm: false,
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
          this.loginUser = {
            email: (document.getElementById('email') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value
          };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.loginUser.email || !this.loginUser.password) {
          const error = this.customError('Здається не вистачає імені користувача або паролю', 'Будь ласка, заповніть всі поля');
          this.showError(error);
        }
        else {
          this.authService.login(this.loginUser).subscribe(
            (res) => {
              this.redirectToHomePage();
              localStorage.setItem('order-my-food-token', res.token);
              localStorage.setItem('order-my-food-username', res.username);
              localStorage.setItem('order-my-food-email', res.email);
              localStorage.setItem('order-my-food-userId', res.userId);
              this.router.navigateByUrl('/hotels');
            },
            (error) => {
              if (error.statusText === 'Unauthorized') {
                this.showError(this.customError('Невірне імʼя користувача або пароль', 'Будь ласка, введіть вірні дані'));
              }
              if (error.error === 'Email doesn\'t exist!') {
                this.showError(this.customError('Такий email не існує', 'Будь ласка, введіть вірні дані'));
              }
              if (error.error === 'Incorrect Password!') {
                this.showError(this.customError('Невірний пароль!', 'Будь ласка, введіть вірні дані'));
              }
            }
          );
        }
      }
    });
  }

  redirectToHomePage = () => {
    Swal.fire({
      icon: 'success',
      title: 'Вхід виконано успішно',
      html: 'Завантажується головна сторінка...',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    }).then((result) => { });
  }

  showError = (error) => {
    Swal.fire({
      icon: 'error',
      title: error.statusText,
      text: error.message,
      showConfirmButton: true,
      confirmButtonText: 'Повернутися до входу',
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.openLoginModal();
      }
    });
  }

  ngOnInit(): void {
    this.openLoginModal();
  }

}
