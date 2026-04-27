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
import { NotificationsView } from './features/notifications-view/notifications-view';
import { Myworkspace } from './features/tickets/pages/myworkspace/myworkspace';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },

    {
        // If there are authentication issues, use canActivateChild to validate auth on each child route
        path: "",
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: "dashboard", component: Main, canActivate: [roleGuard(['Admin'])], data: { breadcrumb: 'Dashboard' } },
            { path: "ticket-main", component: TicketMain, data: { breadcrumb: 'Ticket Main' } },
            { path: "control-panel", component: ControlPanel, data: { breadcrumb: 'Control Panel' } },
            { path: "ticket-history", component: TicketHistory, data: { breadcrumb: 'Ticket History' } },
            { path: "ticket-form", component: TicketForm, data: { breadcrumb: 'Ticket Form' } },
            { path: "ticket-edit/:ticketId", component: TicketEdit, data: { breadcrumb: 'Edit Ticket' } },
            { path: "ticket-details/:ticketId", component: TicketDetails, data: { breadcrumb: 'Ticket Details' } },
            { path: "ticket-change-history/:ticketId", component: TicketChangeHistory, data: { breadcrumb: 'Ticket Change History' } },
            { path: "user-admin", component: UserAdmin, canActivate: [roleGuard(['Admin'])], data: { breadcrumb: 'User Administration' } },
            { path: "user-form", component: UserForm, canActivate: [roleGuard(['Admin'])], data: { breadcrumb: 'Create User' } },
            { path: "user-edit-form/:userId", component: UserEditForm, canActivate: [roleGuard(['Admin'])], data: { breadcrumb: 'Edit User' } },
            { path: "notifications", component: NotificationsView, data: { breadcrumb: 'Notifications' } },
            { path: "my-workspace", component: Myworkspace, canActivate: [roleGuard(['Admin', 'Agent'])], data: { breadcrumb: 'My Workspace' } }
        ]
    },

    {
        path: "",
        component: AltLayout,
        children: [
            { path: "home", component: Home, data: { breadcrumb: 'Home' } },
            { path: "login", component: Login, data: { breadcrumb: 'Login' } }
        ]
    },

    {
        path: "",
        component: ErrorLayout,
        children: [
            { path: "unauthorized", component: Unauthorized, data: { breadcrumb: 'Unauthorized' } },
            { path: "forbidden", component: Forbidden, data: { breadcrumb: 'Forbidden' } }
        ]
    }
];
