import type { Meta } from '@storybook/react';
import * as React from 'react';

import {
  ReaderClosed,
  WindowsExplorer,
  FolderExe,
  FolderExe2,
  FolderFile,
  FolderPrint,
  FolderSettings,
  MicrosoftExchange,
  MicrosoftNetwork,
  MsDos,
  Settings,
} from '@react95/icons';
import { List, Modal, TitleBar } from '../components';
import { TaskBar } from '../components/TaskBar/TaskBar';

export default {
  title: 'TaskBar',
  component: TaskBar,
  tags: ['autodocs'],
} as Meta<typeof TaskBar>;

export const Simple = {
  render: () => {
    const [first, toggleFirst] = React.useState(false);
    const [second, toggleSecond] = React.useState(false);

    const closeFirst = () => toggleFirst(false);
    const closeSecond = () => toggleSecond(false);

    return (
      <>
        {first && (
          <Modal
            icon={<WindowsExplorer variant="16x16_4" />}
            title="Windows Explorer"
            titleBarOptions={[
              <TitleBar.Close key="close" onClick={closeFirst} />,
            ]}
            width="300px"
            height="200px"
          />
        )}

        {second && (
          <Modal
            dragOptions={{
              defaultPosition: { x: 50, y: 50 },
            }}
            width="300px"
            height="200px"
            icon={<ReaderClosed variant="16x16_4" />}
            title="Local Disk (C:)"
            titleBarOptions={[
              <TitleBar.Close key="close" onClick={closeSecond} />,
            ]}
          />
        )}

        <TaskBar
          list={
            <List>
              <List.Item icon={<FolderExe2 variant="32x32_4" />}>
                <List width={'200px'}>
                  <List.Item icon={<FolderExe variant="16x16_4" />}>
                    Accessories
                  </List.Item>
                  <List.Item icon={<FolderExe variant="16x16_4" />}>
                    StartUp
                  </List.Item>
                  <List.Item icon={<MicrosoftExchange variant="16x16_4" />}>
                    Microsoft Exchange
                  </List.Item>
                  <List.Item icon={<MsDos variant="16x16_32" />}>
                    MS-DOS Prompt
                  </List.Item>
                  <List.Item icon={<MicrosoftNetwork variant="16x16_4" />}>
                    The Microsoft Network
                  </List.Item>
                  <List.Item icon={<WindowsExplorer variant="16x16_4" />}>
                    Windows Explorer
                  </List.Item>
                </List>
                Programs
              </List.Item>
              <List.Item icon={<FolderFile variant="32x32_4" />}>
                Documents
              </List.Item>
              <List.Item icon={<Settings variant="32x32_4" />}>
                <List width={'200px'}>
                  <List.Item icon={<FolderSettings variant="16x16_4" />}>
                    Control Panel
                  </List.Item>
                  <List.Item icon={<FolderPrint variant="16x16_4" />}>
                    Printers
                  </List.Item>
                </List>
                Settings
              </List.Item>
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
