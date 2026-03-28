import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context';

export function useSignInWithEmail() {
  const { authClient } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; rememberMe: boolean }) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    }
  });
}
