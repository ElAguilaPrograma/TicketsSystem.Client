import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './features/home/home';
import { Login } from './features/auth/pages/login/login';
import { Main } from './features/tickets/pages/main/main';
import { AltLayout } from './layout/alt-layout/alt-layout';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    {
        path: "",
        component: MainLayout,
        children: [
            { path: "main", component: Main }
        ]
    },

    {
        path: "",
        component: AltLayout,
        children: [
            { path: "home", component: Home },
            { path: "login", component: Login },
        ]
    }
];
