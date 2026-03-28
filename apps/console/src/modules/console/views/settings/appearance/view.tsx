import { Theme } from '@buckethub/rpc-contract';
import { useUpdatePreferences } from '@/services/profile';
import { useTheme } from '@/shared/theme';
import {
  StyledAppearanceSection,
  StyledSectionTitle,
  StyledThemeLabel,
  StyledThemeOption,
  StyledThemeOptions,
  StyledThemePreview
} from './appearance.styled';

const themes: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
];

export const AppearanceView: React.FunctionComponent = () => {
  const { theme, setTheme } = useTheme();
  const { mutate: updatePreferences } = useUpdatePreferences();

  const onThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  return (
    <StyledAppearanceSection>
      <StyledSectionTitle>Theme</StyledSectionTitle>

      <StyledThemeOptions>
        {themes.map((option) => (
          <StyledThemeOption
            key={option.value}
            type="button"
            selected={theme === option.value}
            data-selected={theme === option.value}
            onClick={() => onThemeChange(option.value)}
          >
            <StyledThemePreview theme={option.value} />
            <StyledThemeLabel>{option.label}</StyledThemeLabel>
          </StyledThemeOption>
        ))}
      </StyledThemeOptions>
    </StyledAppearanceSection>
  );
};
