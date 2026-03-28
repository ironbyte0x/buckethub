import { ConnectionId } from '@buckethub/rpc-contract';
import { generateId } from '@/shared/utils';

export const generateConnectionId = generateId<ConnectionId>;
