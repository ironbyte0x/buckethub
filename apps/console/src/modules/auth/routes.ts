import * as v from 'valibot';
import { createRoute } from '@tanstack/react-router';
import { RootRoute } from '@/router/types';
import { AuthenticatedGuard } from './guards/authenticated-guard';
import { AcceptInvitationView } from './views/accept-invitation';
import { ForgotPasswordView } from './views/forgot-password';
import { ResetPasswordView } from './views/reset-password';
import { SignInView } from './views/sign-in';

export function createAuthRoutesTree(rootRoute: RootRoute) {
  const authRootRoute = createRoute({
    id: 'auth',
    getParentRoute: () => rootRoute,
    component: AuthenticatedGuard
  });

  const signInRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: '/sign-in',
    component: SignInView
  });

  const forgotPasswordRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: '/forgot-password',
    component: ForgotPasswordView
  });

  const resetPasswordRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: '/reset-password',
    component: ResetPasswordView,
    validateSearch: v.object({
      token: v.optional(v.string()),
      error: v.optional(v.string())
    })
  });

  const acceptInvitationRoute = createRoute({
    getParentRoute: () => authRootRoute,
    path: '/accept-invitation',
    component: AcceptInvitationView
  });

  return authRootRoute.addChildren([
    signInRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    acceptInvitationRoute
  ]);
}
