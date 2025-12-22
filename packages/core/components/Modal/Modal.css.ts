import { globalStyle, style } from '@vanilla-extract/css';
import { contract } from '../themes/contract.css';
import { recipe } from '@vanilla-extract/recipes';

export const modalWrapper = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    padding: contract.space[2],
    top: '50px',
    backgroundColor: contract.colors.material,
    boxShadow: contract.shadows.out,
  },
  variants: {
    active: {
      true: {
        // zIndex: contract.zIndices.modal,
      },
    },
    minimized: {
      true: {
        display: 'none',
      },
      false: {
        display: 'flex',
      },
    },
  },
});

export const buttonWrapper = style({
  display: 'flex',
  gap: contract.space[6],
  flexDirection: 'row',
  padding: contract.space[6],
});

globalStyle(`${buttonWrapper} button`, {
  minWidth: '70px',
});

export const content = style({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'row',
  padding: contract.space[6],
  marginBlockStart: contract.space[4],
  marginInlineEnd: contract.space[1],
});

export const menuWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  listStyle: 'none',
  margin: '0',
  paddingLeft: '0',
  paddingTop: '0',
  paddingBottom: '1px',
  borderBottomStyle: 'solid',
  borderWidth: '1px',
  borderBottomColor: contract.colors.borderDark,
  boxShadow: `0 1px 0 0 ${contract.colors.borderLighter}`,
});

export const menuItem = recipe({
  base: {
    position: 'relative',
    paddingLeft: '6px',
    paddingRight: '6px',
    paddingTop: '1px',
    paddingBottom: '1px',
    userSelect: 'none',
  },
  variants: {
    active: {
      true: {
        backgroundColor: "#0000a8",
        color: contract.colors.materialTextInvert,
      },
    },
  },
});

globalStyle(`${menuItem.classNames.base} ul`, {
  position: 'absolute',
  left: '0',
  color: contract.colors.materialText,
});

// resizer handles for simple resizing from left, right, bottom-left and bottom-right
export const resizer = style({
  position: 'absolute',
  zIndex: 20,
  background: 'transparent',
  pointerEvents: 'auto',
});

export const resizerLeft = style([
  resizer,
  {
    left: '-6px',
    top: 0,
    bottom: '12px',
    width: '12px',
    cursor: 'ew-resize',
  },
]);
export const resizerRight = style([
  resizer,
  {
    right: '-6px',
    top: 0,
    bottom: '12px',
    width: '12px',
    cursor: 'ew-resize',
  },
]);
export const resizerBottom = style([
  resizer,
  {
    left: 0,
    right: 0,
    bottom: '-6px',
    height: '12px',
    cursor: 'ns-resize',
  },
]);
export const resizerBottomRight = style([
  resizer,
  {
    right: '-6px',
    bottom: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'se-resize',
  },
]);
export const resizerBottomLeft = style([
  resizer,
  {
    left: '-6px',
    bottom: '-6px',
    width: '12px',
    height: '12px',
    cursor: 'sw-resize',
  },
]);
