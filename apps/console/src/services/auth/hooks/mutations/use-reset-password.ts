import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context';

export function useResetPassword() {
  const { authClient } = useAuth();

  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const response = await authClient.resetPassword({
        token: data.token,
        newPassword: data.newPassword
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }
  });
}
