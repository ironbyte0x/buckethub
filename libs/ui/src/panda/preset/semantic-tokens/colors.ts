import { defineSemanticTokens } from '@pandacss/dev';

export const colors = defineSemanticTokens.colors({
  'background-base': {
    value: {
      base: 'white',
      _dark: 'lch(4.8 0.7 272)'
      // _dark: '{colors.grey.900}'
    }
  },
  'background-secondary': {
    value: {
      base: '{colors.grey.100}',
      _dark: '{colors.grey.950}'
    }
  },
  'background-surface': {
    value: {
      base: '{colors.grey.100}',
      _dark: '{colors.grey.900}'
    }
  },
  'background-subtle': {
    value: {
      base: '{colors.grey.50}',
      _dark: '{colors.grey.900}'
    }
  },
  'background-surface-error': {
    value: {
      base: '{colors.error.50}',
      _dark: '{colors.error.800/20}'
    }
  },
  'background-surface-warning': {
    value: {
      base: '{colors.warning.50}',
      _dark: '{colors.warning.950}'
    }
  },
  'background-surface-info': {
    value: {
      base: '{colors.info.50}',
      _dark: '{colors.info.950}'
    }
  },
  'background-surface-success': {
    value: {
      base: '{colors.success.50}',
      _dark: '{colors.success.950}'
    }
  },
  'background-button-primary': {
    value: {
      base: '{colors.grey.950}',
      _dark: '{colors.grey.100}'
    }
  },
  'background-button-primary-hover': {
    value: {
      base: '{colors.grey.800}',
      _dark: '{colors.grey.200}'
    }
  },
  'background-button-primary-disabled': {
    value: {
      base: '{colors.grey.600}',
      _dark: '{colors.grey.400}'
    }
  },
  'background-button-secondary': {
    value: {
      base: 'white',
      _dark: '{colors.grey.900}'
    }
  },
  'background-button-secondary-hover': {
    value: {
      base: '{colors.grey.100}',
      _dark: '{colors.grey.800}'
    }
  },
  'background-button-secondary-disabled': {
    value: {
      base: 'white',
      _dark: '{colors.grey.950}'
    }
  },
  'background-button-destructive': {
    value: {
      base: '{colors.error.700}',
      _dark: '{colors.error.700}'
    }
  },
  'background-button-destructive-hover': {
    value: {
      base: '{colors.error.800}',
      _dark: '{colors.error.800}'
    }
  },
  'background-button-destructive-disabled': {
    value: {
      base: '{colors.error.300}',
      _dark: '{colors.error.900}'
    }
  },
  'background-input': {
    value: {
      base: '{colors.grey.100}',
      _dark: '{colors.grey.800}'
    }
  },
  'text-base': {
    value: {
      base: '{colors.grey.900}',
      _dark: '{colors.grey.100}'
    }
  },
  'text-subtle': {
    value: {
      base: '{colors.grey.700}',
      _dark: '{colors.grey.300}'
    }
  },
  'text-muted': {
    value: {
      base: '{colors.grey.600}',
      _dark: '{colors.grey.400}'
    }
  },
  'text-base-error': {
    value: {
      base: '{colors.error.700}',
      _dark: '{colors.error.400}'
    }
  },
  'text-base-warning': {
    value: {
      base: '{colors.warning.700}',
      _dark: '{colors.warning.200}'
    }
  },
  'text-base-info': {
    value: {
      base: '{colors.info.700}',
      _dark: '{colors.info.200}'
    }
  },
  'text-base-success': {
    value: {
      base: '{colors.success.700}',
      _dark: '{colors.success.200}'
    }
  },
  'text-placeholder': {
    value: {
      base: '{colors.grey.500}',
      _dark: '{colors.grey.500}'
    }
  },
  'text-button-primary': {
    value: {
      base: '{colors.grey.50}',
      _dark: '{colors.grey.950}'
    }
  },
  'text-button-secondary': {
    value: {
      base: '{colors.grey.950}',
      _dark: '{colors.grey.100}'
    }
  },
  'text-button-destructive': {
    value: {
      base: 'white',
      _dark: 'white'
    }
  },
  'border-base': {
    value: {
      base: '{colors.grey.200}',
      _dark: '{colors.grey.800}'
    }
  },
  'border-surface': {
    value: {
      base: '{colors.grey.300}',
      _dark: '{colors.grey.600}'
    }
  },
  'border-input': {
    value: {
      base: '{colors.grey.200}',
      _dark: '{colors.grey.800}'
    }
  },
  'border-input-focus': {
    value: {
      base: '{colors.grey.300}',
      _dark: '{colors.grey.600}'
    }
  },
  'border-mark-input': {
    value: {
      base: '{colors.grey.300}',
      _dark: '{colors.grey.700}'
    }
  },
  'border-active': {
    value: {
      base: '{colors.grey.500}',
      _dark: '{colors.grey.500}'
    }
  },
  'border-button-primary': {
    value: {
      base: '{colors.grey.950}',
      _dark: '{colors.grey.100}'
    }
  },
  'border-button-secondary': {
    value: {
      base: '{colors.grey.200}',
      _dark: '{colors.grey.800}'
    }
  },
  'border-button-destructive': {
    value: {
      base: '{colors.error.700}',
      _dark: '{colors.error.700}'
    }
  },
  'border-error': {
    value: {
      base: '{colors.error.500}',
      _dark: '{colors.error.500}'
    }
  },
  'border-warning': {
    value: {
      base: '{colors.warning.300}',
      _dark: '{colors.warning.300}'
    }
  },
  'border-info': {
    value: {
      base: '{colors.info.300}',
      _dark: '{colors.info.700}'
    }
  },
  'border-success': {
    value: {
      base: '{colors.success.300}',
      _dark: '{colors.success.300}'
    }
  }
});
