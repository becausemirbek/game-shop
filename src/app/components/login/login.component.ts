import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

enum ParamKeys {
  reg = 'registered',
  accD = 'accessDenied'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup;
  aSub: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params[ParamKeys.reg]) {
        MaterialService.toast('registered');
      } else if (params[ParamKeys.accD]) {
        MaterialService.toast('Unauth');
      }
    });
  }

  onSubmit(): void {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      ({error}) => {
        MaterialService.toast(error.message);
        this.form.enable();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

}
