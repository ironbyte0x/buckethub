import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Button } from '@buckethub/ui';
import { useFormContext } from '../contexts';

interface SubmitButtonProps {
  css?: SystemStyleObject;
  children?: React.ReactNode;
}

export const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({ css, children }) => {
  const form = useFormContext();

  return (
    <Button
      variant="primary"
      css={css}
      disabled={!form.state.isDirty}
      loading={form.state.isSubmitting}
    >
      {children}
    </Button>
  );
};
