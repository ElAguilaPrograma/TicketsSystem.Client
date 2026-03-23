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
import { TicketMain } from './features/tickets/pages/ticket-main/ticket-main';
import { roleGuard } from './core/guards/role.guard';
import { ErrorLayout } from './layout/error-layout/error-layout';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    {
        // Si hay fallos con la autenticación, usar canActivateChild para que se verifique la autenticación en cada ruta hija
        path: "",
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: "dashboard", component: Main, canActivate: [roleGuard(['Admin'])] },
            { path: "ticket-main", component: TicketMain },
            { path: "control-panel", component: ControlPanel, canActivate: [roleGuard(['Admin', 'Agent'])] },
            { path: "ticket-history", component: TicketHistory },
            { path: "ticket-form", component: TicketForm },
            { path: "ticket-edit/:ticketId", component: TicketEdit },
            { path: "ticket-details/:ticketId", component: TicketDetails },
            { path: "ticket-change-history", component: TicketChangeHistory },
            { path: "user-admin", component: UserAdmin, canActivate: [roleGuard(['Admin'])] },
            { path: "user-form", component: UserForm, canActivate: [roleGuard(['Admin'])] },
            { path: "user-edit-form/:userId", component: UserEditForm, canActivate: [roleGuard(['Admin'])] },
        ]
    },

    {
        path: "",
        component: AltLayout,
        children: [
            { path: "home", component: Home },
            { path: "login", component: Login }
        ]
    },

    {
        path: "",
        component: ErrorLayout,
        children: [
            { path: "unauthorized", component: Unauthorized },
            { path: "forbidden", component: Forbidden }
        ]
    }
];
