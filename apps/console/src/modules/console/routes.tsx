import { AlertCircleIcon } from 'lucide-react';
import * as v from 'valibot';
import { BucketId } from '@buckethub/rpc-contract';
import { Button, Icon, State } from '@buckethub/ui';
import { ORPCError } from '@orpc/client';
import { useQueryClient } from '@tanstack/react-query';
import { createRoute, ErrorComponentProps, redirect } from '@tanstack/react-router';
import { RootRoute } from '@/router';
import { preloadBucket, preloadBucketMetrics, setLastVisitedBucketId } from '@/services/buckets';
import { preloadInvitations } from '@/services/invitations';
import { preloadObjects } from '@/services/objects';
import { preloadPermissions } from '@/services/permissions';
import { preloadUsers } from '@/services/users';
import { getKeyPrefix } from '@/shared/lib';
import { Layout, View } from './layout';
import { BucketView } from './views/bucket';
import { BucketLoadingView } from './views/bucket/loading';
import { ConnectionsView } from './views/connections';
import { HomeView } from './views/home';
import { AppearanceView, ProfileView, SecurityView, SettingsLayout } from './views/settings';
import {
  InvitationsLoadingView,
  InvitationsView,
  PermissionsLoadingView,
  PermissionsView,
  UserManagementLayout
} from './views/users';
import { UsersLoadingView, UsersView } from './views/users/users';

const ErrorComponent: React.FunctionComponent<ErrorComponentProps> = ({ error, reset }) => {
  const message = error instanceof ORPCError ? error.message : undefined;

  const queryClient = useQueryClient();

  return (
    <View css={{ alignItems: 'center', justifyContent: 'center' }}>
      <State>
        <State.Header>
          <State.Media variant="icon">
            <Icon as={AlertCircleIcon} size="xl" color="error" />
          </State.Media>

          <State.Title>{message ?? 'Something went wrong'}</State.Title>

          {!message && <State.Description>An unexpected error occurred.</State.Description>}
        </State.Header>

        <State.Content>
          <State.Actions>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                reset();
                queryClient.resetQueries();
              }}
            >
              Try Again
            </Button>
          </State.Actions>
        </State.Content>
      </State>
    </View>
  );
};

export function createConsoleRoutesTree(rootRoute: RootRoute) {
  const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: 'main-layout',
    beforeLoad: ({ context }) => {
      const session = context.authClient.$store.atoms.session?.get();

      if (!session?.data) {
        throw redirect({ to: '/sign-in' });
      }

      const { collections } = context;

      collections.bucketsCollection.preload();
      collections.connectionsCollection.preload();
      collections.tagsCollection.preload();
      collections.bucketTagsCollection.preload();
      collections.connectionTagsCollection.preload();
    },
    component: Layout,
    errorComponent: ErrorComponent
  });

  const consoleRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/',
    component: HomeView,
    errorComponent: ErrorComponent
  });

  const connectionsRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/connections',
    component: ConnectionsView,
    errorComponent: ErrorComponent
  });

  const bucketRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/buckets/$bucketId/{-$key}',
    component: BucketView,
    errorComponent: ErrorComponent,
    wrapInSuspense: true,
    pendingComponent: BucketLoadingView,
    validateSearch: v.object({
      search: v.optional(v.string())
    }),
    beforeLoad: ({ params, context }) => {
      const { bucketId, key } = params;

      setLastVisitedBucketId(bucketId);

      preloadObjects(context.queryClient, context.orpcQuery, {
        bucketId: bucketId as BucketId,
        prefix: getKeyPrefix(key)
      });

      preloadBucket(context.queryClient, context.orpcQuery, bucketId as BucketId);
      preloadBucketMetrics(context.queryClient, context.orpcQuery, bucketId as BucketId);
    }
  });

  const usersRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/users',
    component: UserManagementLayout,
    errorComponent: ErrorComponent,
    beforeLoad: ({ location, context }) => {
      preloadInvitations(context.queryClient, context.orpcQuery);

      if (location.pathname === '/users') {
        throw redirect({ to: '/users/users' });
      }
    }
  });

  const usersInvitationsRoute = createRoute({
    getParentRoute: () => usersRoute,
    path: '/invitations',
    component: InvitationsView,
    errorComponent: ErrorComponent,
    wrapInSuspense: true,
    pendingComponent: InvitationsLoadingView,
    beforeLoad: ({ context }) => {
      preloadInvitations(context.queryClient, context.orpcQuery);
    }
  });

  const usersUsersRoute = createRoute({
    getParentRoute: () => usersRoute,
    path: '/users',
    component: UsersView,
    errorComponent: ErrorComponent,
    wrapInSuspense: true,
    pendingComponent: UsersLoadingView,
    beforeLoad: ({ context }) => {
      preloadUsers(context.queryClient, context.orpcQuery);
    }
  });

  const usersPermissionsRoute = createRoute({
    getParentRoute: () => usersRoute,
    path: '/permissions',
    component: PermissionsView,
    errorComponent: ErrorComponent,
    wrapInSuspense: true,
    pendingComponent: PermissionsLoadingView,
    beforeLoad: ({ context }) => {
      preloadPermissions(context.queryClient, context.orpcQuery);
    }
  });

  const usersTree = usersRoute.addChildren([
    usersInvitationsRoute,
    usersUsersRoute,
    usersPermissionsRoute
  ]);

  const settingsRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: '/settings',
    component: SettingsLayout,
    errorComponent: ErrorComponent,
    beforeLoad: ({ location }) => {
      if (location.pathname === '/settings') {
        throw redirect({ to: '/settings/profile' });
      }
    }
  });

  const settingsProfileRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/profile',
    component: ProfileView,
    errorComponent: ErrorComponent
  });

  const settingsAppearanceRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/appearance',
    component: AppearanceView,
    errorComponent: ErrorComponent
  });

  const settingsSecurityRoute = createRoute({
    getParentRoute: () => settingsRoute,
    path: '/security',
    component: SecurityView,
    errorComponent: ErrorComponent
  });

  const settingsTree = settingsRoute.addChildren([
    settingsProfileRoute,
    settingsAppearanceRoute,
    settingsSecurityRoute
  ]);

  return layoutRoute.addChildren([
    consoleRoute,
    connectionsRoute,
    bucketRoute,
    usersTree,
    settingsTree
  ]);
}
