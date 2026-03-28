import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context';

export function useChangePassword() {
  const { authClient } = useAuth();

  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }
  });
}
