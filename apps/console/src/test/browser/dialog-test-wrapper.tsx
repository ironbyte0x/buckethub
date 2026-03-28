import { ResponsiveDialog } from '@buckethub/ui';
import { TestWrapper, TestWrapperProps } from './test-wrapper';

type DialogTestWrapperProps = TestWrapperProps;

export const DialogTestWrapper: React.FunctionComponent<DialogTestWrapperProps> = ({
  children,
  mockOrpc,
  queryClient,
  collections
}) => {
  return (
    <TestWrapper mockOrpc={mockOrpc} queryClient={queryClient} collections={collections}>
      <ResponsiveDialog defaultOpen modal={false}>
        <ResponsiveDialog.Content>{children}</ResponsiveDialog.Content>
      </ResponsiveDialog>
    </TestWrapper>
  );
};
