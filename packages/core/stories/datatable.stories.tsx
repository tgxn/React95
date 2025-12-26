import type { Meta } from '@storybook/react';
import * as React from 'react';

import { Frame } from '../components/Frame/Frame';
import { DataTable, DataTableProps } from '../components/DataTable/DataTable';
import { Modal } from '../components/Modal/Modal';
import { FolderFile, Computer3, FileFind } from '@react95/icons';

export default {
  title: 'DataTable',
  component: DataTable,
  tags: ['autodocs'],
} as Meta<DataTableProps>;

const columns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name', width: '150px' },
  { key: 'email', label: 'Email', width: '200px' },
  { key: 'status', label: 'Status', width: '100px' },
];

const data = [
  {
    id: '001',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
  },
  {
    id: '002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Active',
  },
  {
    id: '003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'Inactive',
  },
  {
    id: '004',
    name: 'Alice Williams',
    email: 'alice@example.com',
    status: 'Active',
  },
  {
    id: '005',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'Inactive',
  },
];

export const Default = {
  render: () => (
    <Modal title="User Data" width={600}>
      <DataTable columns={columns} data={data} />
    </Modal>
  ),
};

export const SmallTable = {
  render: () => (
    <Modal title="Settings" width={400}>
      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'value', label: 'Value' },
        ]}
        data={[
          { name: 'Option 1', value: '100' },
          { name: 'Option 2', value: '200' },
          { name: 'Option 3', value: '300' },
        ]}
      />
    </Modal>
  ),
};

export const Empty = {
  render: () => (
    <Modal title="Empty State" width={600}>
      <DataTable columns={columns} data={[]} />
    </Modal>
  ),
};

export const Resizeable = {
  render: () => (
    <Modal title="Files" width={700} isResizeable>
      <DataTable columns={columns} data={data} />
    </Modal>
  ),
};

export const WithIcons = {
  render: () => (
    <Modal title="File Browser" width={600} isResizeable>
      <DataTable
        columns={[
          { key: 'icon', label: '', width: '32px' },
          { key: 'name', label: 'Filename' },
          { key: 'size', label: 'Size', width: '100px' },
          { key: 'type', label: 'Type', width: '100px' },
        ]}
        data={[
          {
            icon: <FolderFile variant="16x16_4" />,
            name: 'Documents',
            size: '-',
            type: 'Folder',
          },
          {
            icon: <Computer3 variant="16x16_4" />,
            name: 'Computer',
            size: '-',
            type: 'Folder',
          },
          {
            icon: <FileFind variant="16x16_4" />,
            name: 'search.txt',
            size: '2.4 KB',
            type: 'Text File',
          },
        ]}
      />
    </Modal>
  ),
};
