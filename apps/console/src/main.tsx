import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { UIProvider } from '@buckethub/ui';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { App } from './app';
import { DemoAuthProvider, DemoServicesProvider } from './demo';
import { environment } from './environment';
import { queryClient } from './instances';
import { router } from './router';
import { AuthProvider } from './services/auth';
import { CollectionsProvider } from './services/collections/provider';
import { ServicesProvider } from './services/provider';
import { ThemeProvider } from './shared/theme';
import './styles.css';

const ServicesProviderComponent = environment.VITE_DEMO_MODE
  ? DemoServicesProvider
  : ServicesProvider;

const AuthProviderComponent = environment.VITE_DEMO_MODE ? DemoAuthProvider : AuthProvider;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ServicesProviderComponent>
        <CollectionsProvider>
          <AuthProviderComponent>
            <ThemeProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </ThemeProvider>
          </AuthProviderComponent>
        </CollectionsProvider>
      </ServicesProviderComponent>

      <TanStackDevtools
        plugins={[
          {
            name: 'TanStack Query',
            render: <ReactQueryDevtoolsPanel />,
            defaultOpen: true
          },
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
            defaultOpen: false
          }
        ]}
      />
    </QueryClientProvider>
  </StrictMode>
);
