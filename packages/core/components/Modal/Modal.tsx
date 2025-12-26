import { nanoid } from 'nanoid';
import React, {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { DragOptions, useDraggable } from '@neodrag/react';

import { Button } from '../Button/Button';
import { fixedForwardRef, Frame, FrameProps } from '../Frame/Frame';
import { List } from '../List/List';
import {
  TitleBar,
  TitleBarBackgroundProps,
  OptionProps,
  OptionReturnType,
} from '../TitleBar/TitleBar';
import * as styles from './Modal.css';

import cn from 'classnames';
import { useOnClickOutside } from 'usehooks-ts';
import { ModalEvents, useModal } from '../shared/events';

// track zindex order for modals in a simple local module-scoped map
const modalZOrder: Record<string, number> = {};
let zCounter = 1000; // start zindex at 1000 so it sits above most stuff

// set this modal to the highest zindex
function bringToFront(id: string) {
  zCounter += 1;
  modalZOrder[id] = zCounter;
}

// remove modal from zindex map
function removeFromZOrder(id: string) {
  delete modalZOrder[id];
}

export type ModalButtons = {
  value: string;
  onClick(event: MouseEvent): void;
};

export type ModalMenu = {
  name: string;
  list: ReactElement<typeof List>;
};

export type ModalDefaultPosition = {
  x: number;
  y: number;
};

type TitleBarOptions =
  | typeof TitleBar.Close
  | typeof TitleBar.Help
  | typeof TitleBar.Maximize
  | typeof TitleBar.Minimize
  | typeof TitleBar.Restore;

export type ModalProps = {
  id?: string;
  // `defaultClosed` will keep the modal minimized/hidden on first mount
  defaultClosed?: boolean;
  buttons?: Array<ModalButtons>;
  menu?: Array<ModalMenu>;
  dragOptions?: Omit<DragOptions, 'handle'>;
  hasWindowButton?: boolean;
  buttonsAlignment?: FrameProps<'div'>['justifyContent'];
  isResizeable?: boolean;
  titleBarOptions?:
    | ReactElement<TitleBarOptions>
    | ReactElement<TitleBarOptions>[];
} & Omit<FrameProps<'div'>, 'as'> &
  HTMLAttributes<HTMLDivElement> &
  Pick<TitleBarBackgroundProps<'div'>, 'title' | 'icon'>;

const ModalContent = fixedForwardRef<HTMLDivElement, FrameProps<'div'>>(
  (rest, ref) => (
    <Frame {...rest} ref={ref} className={cn(styles.content, rest.className)} />
  ),
);

const ModalMinimize = fixedForwardRef<HTMLButtonElement, OptionProps<'button'>>(
  (props, ref) => {
    const [id, setId] = useState<string>('');
    const { minimize, focus, subscribe } = useModal();

    useEffect(() => {
      const handleVisibilityChange = ({ id: activeId }: { id: string }) => {
        setId(activeId);
      };

      const unsubscribe = subscribe(
        ModalEvents.ModalVisibilityChanged,
        handleVisibilityChange,
      );

      return unsubscribe;
    }, [subscribe]);

    const handleMinimize = () => {
      minimize(id);
      focus('no-id');
    };

    return <TitleBar.Minimize {...props} ref={ref} onClick={handleMinimize} />;
  },
) as OptionReturnType;

const ModalRenderer = (
  {
    id: providedId,
    hasWindowButton: hasButton = true,
    buttons = [],
    buttonsAlignment = 'flex-end',
    children,
    icon,
    menu = [],
    title,
    dragOptions,
    titleBarOptions,
    defaultClosed = false,
    isResizeable = false,
    className,
    ...rest
  }: ModalProps,
  ref: Ref<HTMLDivElement | null>,
) => {
  const [id] = useState<string>(providedId || nanoid());
  const [menuOpened, setMenuOpened] = useState('');
  const [isActive, setIsActive] = useState(false);
  // `isModalMinimized` starts from `defaultMinimized` so we don't flash on mount
  const [isModalMinimized, setIsModalMinimized] = useState<boolean>(
    !!defaultClosed,
  );
  const { add, remove, focus, subscribe, minimize } = useModal();

  // track zindex for this modal
  const [, forceUpdate] = useState(0);

  const draggableRef = useRef<HTMLDivElement>(null);
  useDraggable(draggableRef, {
    ...dragOptions,
    handle: '.draggable',
  });

  // resizing support
  const isResizingRef = useRef(false);
  const minWidth = 140;
  const minHeight = 80;

  type ResizeDirection = 'right' | 'bottom-right' | 'bottom';

  const startResize = (direction: ResizeDirection) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const el = draggableRef.current;
    if (!el) return;
    isResizingRef.current = true;

    const startX = e.clientX;
    const startY = e.clientY;
    const rect = el.getBoundingClientRect();
    const startWidth = rect.width;
    const startHeight = rect.height;
    // const startLeft = rect.left;

    let raf = 0;

    const onMove = (mv: MouseEvent) => {
      const dx = mv.clientX - startX;
      const dy = mv.clientY - startY;
      let newW = startWidth;
      let newH = startHeight;

      if (direction === 'right') {
        newW = Math.max(minWidth, startWidth + dx);
      } else if (direction === 'bottom-right') {
        newW = Math.max(minWidth, startWidth + dx);
        newH = Math.max(minHeight, startHeight + dy);
      } else if (direction === 'bottom') {
        newH = Math.max(minHeight, startHeight + dy);
      }

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.width = `${Math.round(newW)}px`;
        el.style.height = `${Math.round(newH)}px`;
      });
    };

    const onUp = () => {
      isResizingRef.current = false;
      document.removeEventListener(
        'mousemove',
        onMove as unknown as EventListener,
      );
      document.removeEventListener('mouseup', onUp as unknown as EventListener);
      if (raf) cancelAnimationFrame(raf);
    };

    document.addEventListener('mousemove', onMove as unknown as EventListener);
    document.addEventListener('mouseup', onUp as unknown as EventListener);
  };

  const menuRef = useRef<HTMLUListElement>(null);
  useOnClickOutside(menuRef, () => {
    setMenuOpened('');
  });

  useEffect(() => {
    const unsubscribeVisibility = subscribe(
      ModalEvents.ModalVisibilityChanged,
      ({ id: activeId }) => {
        setIsActive(activeId === id);
        if (activeId === id) {
          bringToFront(id);
          forceUpdate(n => n + 1);
        }
      },
    );

    // if `defaultMinimized` is set, keep it minimized and don't steal focus
    if (defaultClosed) {
      minimize(id);
    } else {
      add({
        id,
        icon,
        title: title || '',
        hasButton,
      });

      focus(id);
      // add to zorder and bring to front on mount
      bringToFront(id);
      forceUpdate(n => n + 1);
    }

    return () => {
      remove(id);
      removeFromZOrder(id);

      unsubscribeVisibility();
    };
  }, [
    id,
    icon,
    title,
    hasButton,
    providedId,
    add,
    remove,
    focus,
    subscribe,
    minimize,
    defaultClosed,
  ]);

  useEffect(() => {
    const unsubscribeMinimize = subscribe(
      ModalEvents.MinimizeModal,
      ({ id: activeId }) => {
        if (activeId === id) {
          setIsModalMinimized(true);
        }
      },
    );

    const unsubscribeRestore = subscribe(
      ModalEvents.RestoreModal,
      ({ id: activeId }) => {
        if (activeId === id) {
          setIsModalMinimized(false);
        }
      },
    );

    return () => {
      unsubscribeMinimize();
      unsubscribeRestore();
    };
  }, [id, subscribe]);

  useImperativeHandle(ref, () => {
    return draggableRef.current;
  });

  return (
    <Frame
      {...rest}
      className={cn(
        styles.modalWrapper({ minimized: isModalMinimized }),
        className,
      )}
      role="dialog"
      aria-hidden={isModalMinimized}
      ref={draggableRef}
      style={{ zIndex: modalZOrder[id] || 1000, ...(rest.style || {}) }}
      onMouseDown={() => {
        focus(id);
        bringToFront(id);
        forceUpdate(n => n + 1);
      }}
    >
      <TitleBar
        active={isActive}
        icon={icon}
        title={title}
        className="draggable"
        mb="$2"
      >
        {titleBarOptions && (
          <TitleBar.OptionsBox>{titleBarOptions}</TitleBar.OptionsBox>
        )}
      </TitleBar>

      {menu && menu.length > 0 && (
        <ul className={styles.menuWrapper} ref={menuRef}>
          {menu.map(({ name, list }) => {
            const active = menuOpened === name;
            return (
              <li
                key={name}
                onMouseDown={() => setMenuOpened(name)}
                className={styles.menuItem({ active })}
              >
                {name}
                {active && list}
              </li>
            );
          })}
        </ul>
      )}

      {children}

      {buttons && buttons.length > 0 && (
        <Frame
          className={styles.buttonWrapper}
          justifyContent={buttonsAlignment}
        >
          {buttons.map(button => (
            <Button
              key={button.value}
              onClick={button.onClick}
              value={button.value}
            >
              {button.value}
            </Button>
          ))}
        </Frame>
      )}

      {isResizeable && (
        <>
          {/* <div
            className={styles.resizerLeft}
            onMouseDown={startResize('left')}
            aria-hidden
          /> */}
          <div
            className={styles.resizerRight}
            onMouseDown={startResize('right')}
            aria-hidden
          />
          <div
            className={styles.resizerBottomRight}
            onMouseDown={startResize('bottom-right')}
            aria-hidden
          />
          <div
            className={styles.resizerBottom}
            onMouseDown={startResize('bottom')}
            aria-hidden
          />
        </>
      )}
    </Frame>
  );
};

type ModalWithStatics = (
  props: ModalProps & { ref?: Ref<HTMLDivElement | null> },
) => ReactElement;

type ModalComponent = ModalWithStatics & {
  Content: typeof ModalContent;
  Minimize: typeof ModalMinimize;
};

export const Modal = Object.assign(
  fixedForwardRef<HTMLDivElement, ModalProps>(ModalRenderer),
  {
    Content: ModalContent,
    Minimize: ModalMinimize,
  },
) as ModalComponent;
