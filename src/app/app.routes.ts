import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: RegisterComponent },
    // { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'dashboard', component: DashboardComponent },

    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },    
    { path: '**', redirectTo: '/auth/login' }];
