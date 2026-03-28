import { Field } from '@buckethub/ui';
import { useStore } from '@tanstack/react-form';
import { useFieldContext } from './contexts';

export const FieldError: React.FunctionComponent = () => {
  const field = useFieldContext();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <Field.Error>
      {errors.length > 0
        ? errors.map((error: { message: string }) => error.message).join(', ')
        : null}
    </Field.Error>
  );
};
