import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context';

export function useSignUpWithEmail() {
  const { authClient } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string }) => {
      const response = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }
  });
}
