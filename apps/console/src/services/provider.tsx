import { ServiceContext } from './context';
import { orpc, orpcQuery } from './rpc';

interface ServicesProviderProps {
  children: React.ReactNode;
}

export const ServicesProvider: React.FunctionComponent<ServicesProviderProps> = ({ children }) => {
  return (
    <ServiceContext.Provider
      value={{
        orpc,
        orpcQuery
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
