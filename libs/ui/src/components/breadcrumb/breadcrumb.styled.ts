import { cva } from '@buckethub/styled-system/css';
import { styled } from '@buckethub/styled-system/jsx';

export const StyledBreadcrumb = styled('nav', {
  base: {}
});

export const StyledBreadcrumbList = styled('ol', {
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    listStyle: 'none'
  },
  variants: {
    size: {
      sm: {
        gap: '1.5'
      },
      md: {
        gap: '1.5'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const StyledBreadcrumbItem = styled('li', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1.5'
  },
  variants: {
    size: {
      sm: {
        gap: '1'
      },
      md: {
        gap: '1.5'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const linkRecipe = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    color: 'text-base',
    transition: 'colors',
    cursor: 'pointer',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
      color: 'text-base'
    }
  },
  variants: {
    size: {
      sm: {
        textStyle: 'body-medium'
      },
      md: {
        textStyle: 'body-large'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const StyledBreadcrumbLink = styled('a', linkRecipe);

export const StyledBreadcrumbPage = styled('span', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    color: 'text-muted',
    fontWeight: 'normal'
  },
  variants: {
    size: {
      sm: {
        textStyle: 'body-medium'
      },
      md: {
        textStyle: 'body-large'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const StyledBreadcrumbSeparator = styled('li', {
  base: {
    color: 'text-muted',
    userSelect: 'none'
  },
  variants: {
    size: {
      sm: {
        textStyle: 'body-medium'
      },
      md: {
        textStyle: 'body-large'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});

export const StyledBreadcrumbEllipsis = styled('span', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text-base'
  }
});
