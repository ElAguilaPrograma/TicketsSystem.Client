import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './features/home/home';
import { Login } from './features/auth/pages/login/login';
import { Main } from './features/tickets/pages/main/main';
import { AltLayout } from './layout/alt-layout/alt-layout';
import { ControlPanel } from './features/tickets/pages/control-panel/control-panel';
import { TicketHistory } from './features/tickets/pages/ticket-history/ticket-history';
import { TicketForm } from './features/tickets/pages/ticket-form/ticket-form';
import { TicketEdit } from './features/tickets/pages/ticket-edit/ticket-edit';
import { TicketDetails } from './features/tickets/pages/ticket-details/ticket-details';
import { TicketChangeHistory } from './features/tickets/pages/ticket-change-history/ticket-change-history';
import { UserAdmin } from './features/admin/pages/user-admin/user-admin';
import { UserForm } from './features/admin/pages/user-form/user-form';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    {
        path: "",
        component: MainLayout,
        children: [
            { path: "main", component: Main },
            { path: "control-panel", component: ControlPanel },
            { path: "ticket-history", component: TicketHistory },
            { path: "ticket-form", component: TicketForm },
            { path: "ticket-edit", component: TicketEdit },
            { path: "ticket-details", component: TicketDetails },
            { path: "ticket-change-history", component: TicketChangeHistory },
            { path: "user-admin", component: UserAdmin },
            { path: "user-form", component: UserForm }
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
