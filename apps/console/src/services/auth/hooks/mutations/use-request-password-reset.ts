import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context';

export function useRequestPasswordReset() {
  const { authClient } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }
  });
}
