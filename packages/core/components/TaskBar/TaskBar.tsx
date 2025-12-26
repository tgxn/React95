import React, { forwardRef, useEffect, useState, useRef } from 'react';
import type { ReactElement } from 'react';

import { Frame, FrameProps } from '../Frame/Frame';
import { List } from '../List/List';

import { SystemTray } from './SystemTray';
import { WindowButton } from './WindowButton';
import { Logo } from '@react95/icons';
import { truncate } from './TaskBar.css';
import { ModalEvents, ModalWindow, useModal } from '../shared/events';

export type TaskBarProps = {
  list?: ReactElement<typeof List>;
  trayIcons?: React.ReactNode;
  showClock?: boolean;
  clockAmPm?: boolean;
  clockOnClick?: () => void;
} & FrameProps<'div'>;

export const TaskBar = forwardRef<HTMLDivElement, TaskBarProps>(
  ({ list, trayIcons, showClock, clockAmPm, clockOnClick, className }, ref) => {
    const [showList, toggleShowList] = useState(false);
    const [activeStart, toggleActiveStart] = useState(false);
    const [modalWindows, setModalWindows] = useState<ModalWindow[]>([]);
    const [activeWindow, setActiveWindow] = useState<string>();
    const { minimize, restore, focus, subscribe } = useModal();

    useEffect(() => {
      const addModal = (window: ModalWindow) => {
        if (!window.id) {
          console.warn('Modal added without ID');
          return;
        }
        setModalWindows(prevModals => {
          // Prevent duplicates
          if (prevModals.some(modal => modal.id === window.id)) {
            return prevModals;
          }
          return [...prevModals, window];
        });
      };

      const removeModal = (data: Pick<ModalWindow, 'id'>) => {
        setModalWindows(prevModals => {
          const filteredModals = prevModals.filter(
            modal => modal.id !== data.id,
          );

          // handle focussing the last modal if the active one is closed
          const lastModal = filteredModals.at(-1);
          if (activeWindow === data.id && lastModal) {
            focus(lastModal.id);
          }

          return filteredModals;
        });
      };

      const updateVisibleModal = ({ id }: Pick<ModalWindow, 'id'>) => {
        setActiveWindow(id);
      };

      const unsubscribeAdd = subscribe(ModalEvents.AddModal, addModal);
      const unsubscribeRemove = subscribe(ModalEvents.RemoveModal, removeModal);
      const unsubscribeVisibility = subscribe(
        ModalEvents.ModalVisibilityChanged,
        updateVisibleModal,
      );

      return () => {
        unsubscribeAdd();
        unsubscribeRemove();
        unsubscribeVisibility();
      };
    }, [activeWindow, subscribe, focus]);

    const listRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          buttonRef.current &&
          listRef.current &&
          !listRef.current.contains(e.target as Node) &&
          !buttonRef.current.contains(e.target as Node)
        ) {
          toggleActiveStart(false);
          toggleShowList(false);
        }
      };

      window.addEventListener('click', handleClickOutside);

      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }, []);

    return (
      <Frame
        position="fixed"
        bottom="0px"
        left="0px"
        right="0px"
        display="flex"
        justifyContent="space-between"
        h="28px"
        w="100%"
        padding="$2"
        zIndex="4000"
        backgroundColor="$material"
        boxShadow="$out"
        ref={ref}
        className={className}
      >
        {showList && (
          <Frame
            position="absolute"
            bottom="28px"
            ref={listRef}
            onClick={(e: React.MouseEvent) => {
              const target = e.target as Element | null;
              const li = target?.closest('li');

              // if clicked inside a list item that has a nested `ul`, assume it's a parent with a submenu
              // and don't close the start menu (fixes touch devices opening submenus)
              if (li && li.querySelector('ul')) {
                return;
              }

              toggleActiveStart(false);
              toggleShowList(false);
            }}
          >
            {list}
          </Frame>
        )}
        <WindowButton
          small
          icon={<Logo variant="32x32_4" />}
          active={activeStart}
          ref={buttonRef}
          onClick={() => {
            toggleActiveStart(!activeStart);
            toggleShowList(!showList);
          }}
        >
          Start
        </WindowButton>

        <Frame w="100%" paddingLeft="$0" ml="$2" display="flex">
          {modalWindows.map(
            ({ icon, title, hasButton, id }) =>
              hasButton && (
                <WindowButton
                  key={id}
                  icon={icon}
                  active={id === activeWindow}
                  onClick={() => {
                    if (id === activeWindow) {
                      minimize(id);
                      setActiveWindow(undefined);
                    } else {
                      restore(id);
                      focus(id);
                    }
                  }}
                  small={false}
                >
                  <div className={truncate}>{title}</div>
                </WindowButton>
              ),
          )}
        </Frame>

        <SystemTray
          trayIcons={trayIcons}
          showClock={showClock}
          clockAmPm={clockAmPm}
          clockOnClick={clockOnClick}
        />
      </Frame>
    );
  },
);
