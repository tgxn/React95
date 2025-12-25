import { style, globalStyle } from '@vanilla-extract/css';
import { contract } from '../themes/contract.css';

export const datatable = style({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  backgroundColor: contract.colors.inputBackground,
  color: contract.colors.materialText,
  boxShadow: contract.shadows.in,
  border: `1px solid ${contract.colors.borderDark}`,
  padding: '2px',
  // margin: '2px',
  fontSize: 12,
});

export const tableHeader = style({
  backgroundColor: contract.colors.inputBackground,
});

export const tableHeaderCell = style({
  padding: contract.space[4],
  paddingLeft: contract.space[8],
  paddingRight: contract.space[8],
  textAlign: 'left',
  fontWeight: 'bold',
  lineHeight: 1,
  backgroundColor: contract.colors.material,
  color: contract.colors.materialText,

  border: '1px solid ' + contract.colors.borderDark,
  boxShadow: `inset 1px 1px 0px 1px ${contract.colors.borderLightest},
    inset 0 1px 1px 1px ${contract.colors.borderDark},
    1px 1px 0 0px ${contract.colors.borderDark}`,
});

export const tableRow = style({
  selectors: {
    '&:hover': {
      backgroundColor: contract.colors.headerBackground,
      color: contract.colors.headerText,
    },
  },
});

export const tableCell = style({
  padding: contract.space[8],
  borderRight: `1px solid ${contract.colors.borderLight}`,
  selectors: {
    '&:last-child': {
      borderRight: 'none',
    },
  },
});
