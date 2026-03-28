import { createContext, useContext } from 'react';
import { ORPCClient, ORPCQuery } from './rpc';

export interface Services {
  orpcQuery: ORPCQuery;
  orpc: ORPCClient;
}

export const ServiceContext = createContext<Services | null>(null);

export function useServicesContext() {
  const context = useContext(ServiceContext);

  if (!context) {
    throw new Error(`useServices hook must be used within a ServiceProvider`);
  }

  return context;
}
