import { AlertCircleIcon } from 'lucide-react';
import { SystemStyleObject } from '@buckethub/styled-system/types';
import { Alert, Icon, Reveal } from '@buckethub/ui';

interface ErrorAlertProps {
  show: boolean;
  title?: string;
  description?: string;
  css?: SystemStyleObject;
}

export const ErrorAlert: React.FunctionComponent<ErrorAlertProps> = ({
  show,
  title,
  description,
  css
}) => {
  return (
    <Reveal>
      {show && (
        <Reveal.Content>
          <Alert role="alert" variant="error" css={css}>
            <Alert.Icon>
              <Icon as={AlertCircleIcon} size="md" />
            </Alert.Icon>

            <Alert.Content>
              <Alert.Title>{title}</Alert.Title>
              <Alert.Description>{description}</Alert.Description>
            </Alert.Content>
          </Alert>
        </Reveal.Content>
      )}
    </Reveal>
  );
};
