import { StyledProgressIndicator, StyledProgressTrack } from './progress.styled';

export interface ProgressProps extends React.ComponentProps<typeof StyledProgressTrack> {
  value: number;
  variant?: 'default' | 'warning' | 'destructive';
}

export const Progress: React.FunctionComponent<ProgressProps> = ({
  value,
  variant = 'default'
}) => {
  return (
    <StyledProgressTrack>
      <StyledProgressIndicator variant={variant} style={{ width: `${value}%` }} />
    </StyledProgressTrack>
  );
};
