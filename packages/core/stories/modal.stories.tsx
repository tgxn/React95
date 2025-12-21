import type { Meta } from '@storybook/react';
import * as React from 'react';

import {
  Button,
  List,
  TitleBar,
  TaskBar,
  Frame,
  useModal,
  ModalEvents,
} from '../components';
import { Modal } from '../components/Modal/Modal';

import * as styles from './modal.stories.css';

import {
  Computer,
  Mmsys113,
  Mshtml32534,
  ReaderClosed,
  WindowsExplorer,
} from '@react95/icons';

export default {
  title: 'Modal',
  component: Modal,
  tags: ['autodocs'],
} as Meta<typeof Modal>;

export const Simple = {
  render: () => {
    const [showModal, toggleShowModal] = React.useState(true);

    const handleOpenModal = () => toggleShowModal(true);
    const handleCloseModal = () => toggleShowModal(false);
    const handleButtonClick = (e: React.MouseEvent<HTMLLIElement>) =>
      alert(e.currentTarget.value);

    return (
      <>
        <Button onClick={handleOpenModal}>Trigger Modal</Button>
        {showModal && (
          <Modal
            icon={<Computer variant="16x16_4" />}
            title="Browse"
            dragOptions={{
              defaultPosition: {
                x: 0,
                y: 20,
              },
            }}
            titleBarOptions={[
              <TitleBar.Help
                key="help"
                onClick={() => {
                  alert('Help!');
                }}
              />,
              <TitleBar.Close key="close" onClick={handleCloseModal} />,
            ]}
            buttons={[
              { value: 'Ok', onClick: handleButtonClick },
              { value: 'Cancel', onClick: handleButtonClick },
            ]}
            menu={[
              {
                name: 'File',
                list: (
                  <List width="200px">
                    <List.Item onClick={handleCloseModal}>Exit</List.Item>
                  </List>
                ),
              },
              {
                name: 'Edit',
                list: (
                  <List width="200px">
                    <List.Item>Copy</List.Item>
                  </List>
                ),
              },
            ]}
          >
            <Modal.Content
              width="300px"
              height="160px"
              boxShadow="$in"
              bgColor="white"
            >
              Simple modal
            </Modal.Content>
          </Modal>
        )}
      </>
    );
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/2cbigNitjcruBDZT12ixIq/React95-Design-Kit?node-id=3%3A12',
    },
  },
};

const MODAL_IDS = {
  first: 'first-modal',
  second: 'second-modal',
  third: 'third-modal',
};

export const Multiple = () => {
  const { remove, minimize, restore, focus, add } = useModal();

  const handleButtonClick = (e: React.MouseEvent<HTMLLIElement>) =>
    alert(e.currentTarget.value);

  // Handlers for first modal
  const handleMinimizeFirst = () => {
    minimize(MODAL_IDS.first);
    focus('no-id');
  };
  const handleRestoreFirst = () => {
    add({
      id: MODAL_IDS.first,
      title: 'First Modal',
      icon: <Mmsys113 variant="32x32_4" />,
      hasButton: true,
    });
    restore(MODAL_IDS.first);
    focus(MODAL_IDS.first);
  };
  const handleFocusFirst = () => focus(MODAL_IDS.first);
  const handleCloseFirstModal = () => {
    minimize(MODAL_IDS.first);
    remove(MODAL_IDS.first);
  };

  // Handlers for second modal
  const handleMinimizeSecond = () => {
    minimize(MODAL_IDS.second);
    focus('no-id');
  };
  const handleRestoreSecondModal = () => {
    add({
      id: MODAL_IDS.second,
      title: 'Second Modal',
      icon: <Mshtml32534 variant="32x32_4" />,
      hasButton: true,
    });
    restore(MODAL_IDS.second);
    focus(MODAL_IDS.second);
  };
  const handleFocusSecond = () => focus(MODAL_IDS.second);
  const handleCloseSecondModal = () => {
    minimize(MODAL_IDS.second);
    remove(MODAL_IDS.second);
  };

  // Handlers for third modal
  const handleMinimizeThird = () => {
    minimize(MODAL_IDS.third);
    focus('no-id');
  };
  const handleRestoreThirdModal = () => {
    add({
      id: MODAL_IDS.third,
      title: 'Third Modal',
      icon: <Mshtml32534 variant="32x32_4" />,
      hasButton: true,
    });
    restore(MODAL_IDS.third);
    focus(MODAL_IDS.third);
  };
  const handleFocusThird = () => focus(MODAL_IDS.third);
  const handleCloseThirdModal = () => {
    minimize(MODAL_IDS.third);
    remove(MODAL_IDS.third);
  };

  const {  subscribe, } = useModal();
    const eventLogRef = React.useRef<HTMLDivElement>(null);
    const eventCountRef = React.useRef(0);

    // Helper function to add events to the display without causing re-renders
    const addEventToLog = React.useCallback((eventText: string) => {
      if (eventLogRef.current) {
        const eventItem = document.createElement('div');
        eventItem.style.cssText = `
          font-size: 12px;
          padding: 2px 0;
          border-bottom: 1px solid #eee;
          font-family: monospace;
        `;
        eventCountRef.current += 1;
        eventItem.textContent = `${eventCountRef.current}. ${eventText}`;
        eventLogRef.current.appendChild(eventItem);

        // Auto-scroll to bottom
        eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;

        // Keep only last 20 events to prevent memory issues
        if (eventLogRef.current.children.length > 20) {
          const firstChild = eventLogRef.current.firstChild;
          if (firstChild) {
            eventLogRef.current.removeChild(firstChild);
          }
        }
      }
    }, []);

    const clearEventLog = React.useCallback(() => {
      if (eventLogRef.current) {
        eventLogRef.current.innerHTML = '';
        eventCountRef.current = 0;
      }
    }, []);

      React.useEffect(() => {
        const unsubscribes = [
          subscribe(ModalEvents.AddModal, ({ id, title }) => {
            addEventToLog(`➕ Added: ${title} (${id})`);
          }),
          subscribe(ModalEvents.RemoveModal, ({ id }) => {
            addEventToLog(`❌ Removed: ${id}`);
          }),
          subscribe(ModalEvents.MinimizeModal, ({ id }) => {
            addEventToLog(`➖ Minimized: ${id}`);
          }),
          subscribe(ModalEvents.RestoreModal, ({ id }) => {
            addEventToLog(`⬆️ Restored: ${id}`);
          }),
          subscribe(ModalEvents.ModalVisibilityChanged, ({ id }) => {
            addEventToLog(`👁️ Focus changed: ${id}`);
          }),
        ];
  
        return () => {
          unsubscribes.forEach(unsubscribe => unsubscribe());
        };
      }, [subscribe, addEventToLog]);
  
  
  return (
    <Frame>
      <TaskBar />

      <Frame display="flex" flexDirection="column" gap="8px">
        <Frame display="flex" gap="8px" flexWrap="wrap">
          <Button onClick={handleMinimizeFirst}>Minimize First</Button>
          <Button onClick={handleRestoreFirst}>Restore First</Button>
          <Button onClick={handleCloseFirstModal}>Close First</Button>
          <Button onClick={handleFocusFirst}>Focus First</Button>
        </Frame>
        <Frame display="flex" gap="8px" flexWrap="wrap">
          <Button onClick={handleMinimizeSecond}>Minimize Second</Button>
          <Button onClick={handleRestoreSecondModal}>Restore Second</Button>
          <Button onClick={handleCloseSecondModal}>Close Second</Button>
          <Button onClick={handleFocusSecond}>Focus Second</Button>
        </Frame>
        <Frame display="flex" gap="8px" flexWrap="wrap">
          <Button onClick={handleMinimizeThird}>Minimize Third</Button>
          <Button onClick={handleRestoreThirdModal}>Restore Third</Button>
          <Button onClick={handleCloseThirdModal}>Close Third</Button>
          <Button onClick={handleFocusThird}>Focus Third</Button>
        </Frame>
      </Frame>

      <Modal
        key={MODAL_IDS.first}
        id={MODAL_IDS.first}
        icon={<Mmsys113 variant="32x32_4" />}
        title="First Modal"
        dragOptions={{
          defaultPosition: {
            x: 50,
            y: 100,
          },
        }}
        titleBarOptions={<Modal.Minimize />}
        buttons={[
          { value: 'Ok', onClick: handleButtonClick },
          { value: 'Cancel', onClick: handleButtonClick },
        ]}
        menu={[
          {
            name: 'File',
            list: (
              <List width="200px">
                <List.Item onClick={handleCloseFirstModal}>Exit</List.Item>
              </List>
            ),
          },
          {
            name: 'Edit',
            list: (
              <List width="200px">
                <List.Item>Copy</List.Item>
              </List>
            ),
          },
        ]}
      >
        <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
          <Frame as="div" display="flex" flexDirection="column" gap="8px">
            <h4>Modal Control</h4>
            <p>
              This modal is controlled entirely using the{' '}
              <code>useModal()</code> hook:
            </p>
            <ul style={{ fontSize: '14px', margin: '8px 0' }}>
              <li>
                <code>minimize(id)</code> - Minimize modal
              </li>
              <li>
                <code>restore(id)</code> - Restore modal
              </li>
              <li>
                <code>focus(id)</code> - Bring to focus
              </li>
            </ul>
            <p>Try the control buttons above or use the TaskBar below.</p>
          </Frame>
        </Modal.Content>
      </Modal>

      <Modal
        key={MODAL_IDS.third}
        defaultClosed={true}
        id={MODAL_IDS.third}
        icon={<Mshtml32534 variant="32x32_4" />}
        title="Third Modal"
        dragOptions={{
          defaultPosition: {
            x: 300,
            y: 250,
          },
        }}
        titleBarOptions={<TitleBar.Close onClick={handleCloseThirdModal} />}
        buttons={[
          { value: 'Ok', onClick: handleButtonClick },
          { value: 'Cancel', onClick: handleButtonClick },
        ]}
        menu={[
          {
            name: 'File',
            list: (
              <List width="200px">
                <List.Item onClick={handleCloseThirdModal}>Exit</List.Item>
              </List>
            ),
          },
          {
            name: 'Edit',
            list: (
              <List width="200px">
                <List.Item>Copy</List.Item>
              </List>
            ),
          },
        ]}
      >
        <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
          <Frame as="div" display="flex" flexDirection="column" gap="8px">
            <h4>Complete Modal Management</h4>
            <p>Key features demonstrated:</p>
            <Frame as="ul" marginY="$8">
              <li>No React state management needed</li>
              <li>Modals controlled by ID</li>
              <li>Automatic TaskBar integration</li>
              <li>Event-driven architecture</li>
            </Frame>
            <p>Both modals can be controlled independently using their IDs.</p>
          </Frame>
        </Modal.Content>
      </Modal>

      <Modal
        key={MODAL_IDS.second}
        id={MODAL_IDS.second}
        icon={<Mshtml32534 variant="32x32_4" />}
        title="Second Modal"
        dragOptions={{
          defaultPosition: {
            x: 200,
            y: 150,
          },
        }}
        titleBarOptions={<TitleBar.Close onClick={handleCloseSecondModal} />}
        buttons={[
          { value: 'Ok', onClick: handleButtonClick },
          { value: 'Cancel', onClick: handleButtonClick },
        ]}
        menu={[
          {
            name: 'File',
            list: (
              <List width="200px">
                <List.Item onClick={handleCloseSecondModal}>Exit</List.Item>
              </List>
            ),
          },
          {
            name: 'Edit',
            list: (
              <List width="200px">
                <List.Item>Copy</List.Item>
              </List>
            ),
          },
        ]}
      >
        <Modal.Content width="350px" boxShadow="$in" bgColor="white" p="16px">
          <Frame as="div" display="flex" flexDirection="column" gap="8px">
            <h4>Complete Modal Management</h4>
            <p>Key features demonstrated:</p>
            <Frame as="ul" marginY="$8">
              <li>No React state management needed</li>
              <li>Modals controlled by ID</li>
              <li>Automatic TaskBar integration</li>
              <li>Event-driven architecture</li>
            </Frame>
            <p>Both modals can be controlled independently using their IDs.</p>
          </Frame>
        </Modal.Content>
      </Modal>

      <Frame
        display="flex"
        flexDirection="column"
        width="320px"
        height="200px"
        boxShadow="$out"
        bgColor="$material"
        p="$8"
      >
        <Frame as="h4" fontSize="14px" m="$0" mb="$8">
          Event Log
        </Frame>
        <Frame
          boxShadow="$in"
          bgColor="white"
          p="$8"
          ref={eventLogRef}
          overflow="auto"
          backgroundColor="#fafafa"
          flexGrow={1}
        />
      </Frame>
            
    </Frame>
  );
};

export const Minimize = {
  render: () => {
    const [first, toggleFirst] = React.useState(true);
    const [second, toggleSecond] = React.useState(true);

    const closeFirst = () => toggleFirst(false);
    const closeSecond = () => toggleSecond(false);

    return (
      <>
        <TaskBar
          list={
            <List>
              <List.Item
                icon={<ReaderClosed variant="32x32_4" />}
                onClick={() => toggleSecond(true)}
              >
                Local Disk (C:)
              </List.Item>
              <List.Item
                icon={<WindowsExplorer variant="32x32_4" />}
                onClick={() => {
                  toggleFirst(true);
                }}
              >
                Windows Explorer
              </List.Item>
            </List>
          }
        />

        {first && (
          <Modal
            icon={<WindowsExplorer variant="16x16_4" />}
            title="Windows Explorer"
            titleBarOptions={[
              <TitleBar.Minimize
                key="minimize"
                onClick={() => {
                  alert("I'm in control");
                }}
              />,
              <TitleBar.Close key="close" onClick={closeFirst} />,
            ]}
            width="300px"
            height="220px"
          >
            <Modal.Content boxShadow="$in" bgColor="white">
              <Frame as="p" lineHeight="1.1rem">
                You can still use the{' '}
                <code className={styles.code}>{'<TitleBar.Minimize />'}</code>{' '}
                component if you want to add the behavior yourself by handling
                the click event and updating the state or props of your
                component accordingly.
              </Frame>
            </Modal.Content>
          </Modal>
        )}

        {second && (
          <Modal
            dragOptions={{
              defaultPosition: { x: 120, y: 120 },
            }}
            width="300px"
            height="220px"
            icon={<ReaderClosed variant="16x16_4" />}
            title="Local Disk (C:)"
            titleBarOptions={[
              <Modal.Minimize key="minimize" />,
              <TitleBar.Close key="close" onClick={closeSecond} />,
            ]}
          >
            <Modal.Content boxShadow="$in" bgColor="white">
              <Frame as="p" lineHeight="1.1rem">
                The <code className={styles.code}>Modal.Minimize</code>{' '}
                component is a utility component provided by the{' '}
                <code className={styles.code}>Modal</code> component. It allows
                you to easily add minimize functionality to your modal. To use
                it, simply add{' '}
                <code className={styles.code}>{'<Modal.Minimize />'}</code> to
                the <code className={styles.code}>titleBarOptions</code> prop of
                the <code className={styles.code}>Modal</code> component. This
                will add the minimize button to the title bar of your modal, and
                clicking on it will minimize the modal.
              </Frame>
            </Modal.Content>
          </Modal>
        )}
      </>
    );
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/2cbigNitjcruBDZT12ixIq/React95-Design-Kit?node-id=3%3A17',
    },
  },
};

export const Resizeable = {
  render: () => {
    const [first, toggleFirst] = React.useState(true);
    const [second, toggleSecond] = React.useState(true);

    const closeFirst = () => toggleFirst(false);
    const closeSecond = () => toggleSecond(false);

    return (
      <>
        <TaskBar
          list={
            <List>
              <List.Item
                icon={<ReaderClosed variant="32x32_4" />}
                onClick={() => toggleSecond(true)}
              >
                Local Disk (C:)
              </List.Item>
              <List.Item
                icon={<WindowsExplorer variant="32x32_4" />}
                onClick={() => {
                  toggleFirst(true);
                }}
              >
                Windows Explorer
              </List.Item>
            </List>
          }
        />

        {first && (
          <Modal
            icon={<WindowsExplorer variant="16x16_4" />}
            title="First: Windows Explorer"
            titleBarOptions={[
              <TitleBar.Minimize
                key="minimize"
                onClick={() => {
                  alert("I'm in control");
                }}
              />,
              <TitleBar.Close key="close" onClick={closeFirst} />,
            ]}
            width="300px"
            height="220px"
            isResizeable={true}
          >
            <Modal.Content boxShadow="$in" bgColor="white">
              <Frame as="p" lineHeight="1.1rem">
                You can still use the{' '}
                <code className={styles.code}>{'<TitleBar.Minimize />'}</code>{' '}
                component if you want to add the behavior yourself by handling
                the click event and updating the state or props of your
                component accordingly.
              </Frame>
            </Modal.Content>
          </Modal>
        )}

        {second && (
          <Modal
            dragOptions={{
              defaultPosition: { x: 120, y: 120 },
            }}
            width="300px"
            height="220px"
            icon={<ReaderClosed variant="16x16_4" />}
            title="Local Disk (C:)"
            titleBarOptions={[
              <Modal.Minimize key="minimize" />,
              <TitleBar.Close key="close" onClick={closeSecond} />,
            ]}
            isResizeable={true}
          >
            <Modal.Content boxShadow="$in" bgColor="white">
              <Frame as="p" lineHeight="1.1rem">
                The <code className={styles.code}>Modal.Minimize</code>{' '}
                component is a utility component provided by the{' '}
                <code className={styles.code}>Modal</code> component. It allows
                you to easily add minimize functionality to your modal. To use
                it, simply add{' '}
                <code className={styles.code}>{'<Modal.Minimize />'}</code> to
                the <code className={styles.code}>titleBarOptions</code> prop of
                the <code className={styles.code}>Modal</code> component. This
                will add the minimize button to the title bar of your modal, and
                clicking on it will minimize the modal.
              </Frame>
            </Modal.Content>
          </Modal>
        )}
      </>
    );
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/2cbigNitjcruBDZT12ixIq/React95-Design-Kit?node-id=3%3A17',
    },
  },
};
