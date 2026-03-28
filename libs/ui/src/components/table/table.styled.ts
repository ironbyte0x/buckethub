import { styled } from '@buckethub/styled-system/jsx';

export const StyledTable = styled('table', {
  base: {
    width: 'full',
    captionSide: 'bottom'
  }
});

export const StyledTableHeader = styled('thead', {
  base: {
    '& tr': {
      borderBlock: 'base'
    }
  }
});

export const StyledTableBody = styled('tbody', {
  base: {
    // '& tr': {
    //   _last: {
    //     borderBottom: 'transparent',
    //   },
    // },
  }
});

export const StyledTableFooter = styled('tfoot', {
  base: {
    color: 'text-muted'
  }
});

export const StyledTableRow = styled('tr', {
  base: {
    borderBottom: 'base',
    transition: 'all 0.1s ease-out',

    '&:hover': {
      backgroundColor: 'background-surface'
    },

    '&[data-state=selected]': {
      backgroundColor: 'background-surface'
    },

    '& td:first-of-type, & th:first-of-type': {
      paddingInline: '3',

      sm: {
        paddingLeft: '6'
      }
    },

    '& td:last-of-type, & th:last-of-type': {
      paddingInline: '3',

      sm: {
        paddingRight: '6'
      }
    }
  }
});

export const StyledTableHead = styled('th', {
  base: {
    padding: '3',
    textAlign: 'left',
    verticalAlign: 'middle',
    color: 'text-muted',
    textStyle: 'table-head',
    cursor: 'default',
    textWrap: 'nowrap',

    '&:has([role=checkbox])': {
      paddingRight: '0'
    }
  }
});

export const StyledTableCell = styled('td', {
  base: {
    padding: '3',
    verticalAlign: 'middle',
    color: 'text-base',
    textStyle: 'table-cell',
    cursor: 'default',

    '&:has([role=checkbox])': {
      paddingRight: '0'
    }
  }
});
