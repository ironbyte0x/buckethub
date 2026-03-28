import { useMemo } from 'react';
import { ServiceContext } from '@/services/context';
import { createServices } from '@/services/rpc';
import { createDemoLink } from './link';

interface DemoServicesProviderProps {
  children: React.ReactNode;
}

export const DemoServicesProvider: React.FunctionComponent<DemoServicesProviderProps> = ({
  children
}) => {
  const value = useMemo(() => createServices(createDemoLink()), []);

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};
