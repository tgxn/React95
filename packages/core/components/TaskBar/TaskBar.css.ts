import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { contract } from '../themes/contract.css';
import { calc } from '@vanilla-extract/css-utils';

export const truncate = style({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  textAlign: 'left',
});

export const tooltip = style({});

globalStyle(`${tooltip} div:first-child`, {
  right: 0,
});

export const windowsButton = recipe({
  base: {
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: contract.colors.material,
    paddingBlock: contract.space[2],
    paddingInline: contract.space[3],
    marginRight: contract.space[2],
    maxWidth: '150px',
    border: 'none',
    outline: 'none',
    color: contract.colors.materialText,
  },
  variants: {
    small: {
      true: {
        paddingInline: contract.space[5],
      },
      false: {
        width: '100%',
      },
    },
    active: {
      true: {
        boxShadow: contract.shadows.in,
      },
      false: {
        boxShadow: contract.shadows.out,
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        active: true,
        small: true,
      },
      style: {
        paddingTop: contract.space[4],
        paddingBottom: contract.space[0],
        outline: `${contract.space[1]} dotted ${contract.colors.borderDarkest}`,
        outlineOffset: calc.negate(contract.space[4]),
      },
    },
    {
      variants: {
        active: true,
        small: false,
      },
      style: {
        backgroundColor: contract.colors.borderLighter,
      },
    },
  ],
});

export const icon = style({});

globalStyle(`${icon} svg`, {
  marginTop: contract.space[4],
  marginRight: contract.space[4],
  marginLeft: contract.space[2],
  minWidth: contract.space[2],
  width: '16px',
  height: '16px',
  shapeRendering: 'auto',
});
