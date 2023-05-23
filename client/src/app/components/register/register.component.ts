import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerUser;
  public userName = '';
  constructor(private router: Router, private authService: AuthService, private hotelService: HotelService) { }

  customError = (statusText, statusMessage) => {
    return {
      statusText,
      message: statusMessage
    };
  }

  openRegisterModal = async () => {
    await Swal.fire({
      icon: 'info',
      title: 'Реєстрація',
      html:
      '<input id="email" type="email" class="swal2-input" autocomplete="off" placeholder="Email" required>' +
      '<input id="username" type="text" class="swal2-input" autocomplete="off" placeholder="Імʼя коритсувача" required>' +
      '<input id="password" type="password" class="swal2-input" autocomplete="off" placeholder="Пароль" required>' +
      '<br>' +
      '<b>Уже маєте акаунт</b> <br>' +
      '<a href="/login">Натисніть тут для входу</a> ',
      focusConfirm: false,
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
          this.registerUser = {
            email: (document.getElementById('email') as HTMLInputElement).value,
            username: (document.getElementById('username') as HTMLInputElement).value,
            password: (document.getElementById('password') as HTMLInputElement).value
          };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (!this.registerUser.username || !this.registerUser.password || !this.registerUser.email) {
          const error = this.customError('Деякі поля не заповнені', 'Будь ласка, заповніть всі поля');
          this.showError(error);
        }
        else {
          if (!this.validateEmail(this.registerUser.email)) {
            const error = this.customError('Невірний формат email', 'Будь ласка, введіть правильний Email (напр. example@example.com)');
            this.showError(error);
          }
          else {
            this.authService.register(this.registerUser).subscribe(
              (res) => {
                this.redirectToHomePage();
                localStorage.setItem('order-my-food-token', res.token);
                localStorage.setItem('order-my-food-username', res.username);
                localStorage.setItem('order-my-food-email', res.email);
                localStorage.setItem('order-my-food-userId', res.userId);
                this.router.navigateByUrl('/hotels');
              },
              (error) => {
                if (error.error === 'Email already exist!') {
                  this.showError(this.customError('Такий Email вже існує', 'Будь ласка, спробуйте інший Email'));
                }
              }
            );
          }
        }
      }
    });
  }

  validateEmail = (emailID) => {
    const atpos = emailID.indexOf('@');
    const dotpos = emailID.lastIndexOf('.');
    if (atpos < 1 || ( dotpos - atpos < 2 )) {
      return false;
    }
    return true;
  }

  redirectToHomePage = () => {
    Swal.fire({
      icon: 'success',
      title: 'Ваш акаунт було успішно зареєстровано',
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
      confirmButtonText: 'Повернутися до реєстрації',
      confirmButtonColor: '#9c27b0',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.openRegisterModal();
      }
    });
  }

  ngOnInit(): void {
    this.openRegisterModal();
  }

}
