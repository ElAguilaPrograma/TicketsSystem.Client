import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './features/home/home';
import { Login } from './features/auth/pages/login/login';
import { Main } from './features/admin/pages/dashboard/dashboard';
import { AltLayout } from './layout/alt-layout/alt-layout';
import { ControlPanel } from './features/tickets/pages/control-panel/control-panel';
import { TicketHistory } from './features/tickets/pages/ticket-history/ticket-history';
import { TicketForm } from './features/tickets/pages/ticket-form/ticket-form';
import { TicketEdit } from './features/tickets/pages/ticket-edit/ticket-edit';
import { TicketDetails } from './features/tickets/pages/ticket-details/ticket-details';
import { TicketChangeHistory } from './features/tickets/pages/ticket-change-history/ticket-change-history';
import { UserAdmin } from './features/admin/pages/user-admin/user-admin';
import { UserForm } from './features/admin/pages/user-form/user-form';
import { authGuard } from './core/guards/auth.guard';
import { Unauthorized } from './errors/unauthorized/unauthorized';
import { Forbidden } from './errors/forbidden/forbidden';
import { UserEditForm } from './features/admin/pages/user-edit-form/user-edit-form';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    {
        path: "",
        component: MainLayout,
        children: [
            { path: "main", component: Main, canActivate: [authGuard] },
            { path: "control-panel", component: ControlPanel, canActivate: [authGuard] },
            { path: "ticket-history", component: TicketHistory, canActivate: [authGuard] },
            { path: "ticket-form", component: TicketForm, canActivate: [authGuard] },
            { path: "ticket-edit", component: TicketEdit, canActivate: [authGuard] },
            { path: "ticket-details", component: TicketDetails, canActivate: [authGuard] },
            { path: "ticket-change-history", component: TicketChangeHistory, canActivate: [authGuard] },
            { path: "user-admin", component: UserAdmin, canActivate: [authGuard] },
            { path: "user-form", component: UserForm, canActivate: [authGuard] },
            { path: "user-edit-form/:userId", component: UserEditForm, canActivate: [authGuard] },
        ]
    },

    {
        path: "",
        component: AltLayout,
        children: [
            { path: "home", component: Home },
            { path: "login", component: Login },
            { path: "unauthorized", component: Unauthorized },
            { path: "forbidden", component: Forbidden }
        ]
    },
];
