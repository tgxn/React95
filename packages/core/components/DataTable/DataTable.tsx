import React, { forwardRef } from 'react';
import cn from 'classnames';

import { Frame, FrameProps } from '../Frame/Frame';
import {
  datatable,
  tableHeader,
  tableHeaderCell,
  tableRow,
  tableCell,
  tableBody,
} from './DataTable.css';

export interface DataTableColumn {
  key: string;
  label: string;
  width?: string | number | 'auto' | 'fit-content';
}

export interface DataTableRow {
  [key: string]: React.ReactNode;
}

export type DataTableProps = Omit<FrameProps<'table'>, 'as'> & {
  columns: DataTableColumn[];
  data: DataTableRow[];
};

const DataTableRenderer = forwardRef<HTMLTableElement, DataTableProps>(
  ({ columns, data, className, ...rest }, ref) => (
    <Frame {...rest} ref={ref} className={cn(datatable, className)} as="table">
      <thead className={tableHeader}>
        <tr>
          {columns.map(column => (
            <th
              key={column.key}
              className={tableHeaderCell}
              style={{ width: column.width }}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={tableBody}>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className={tableRow}>
            {columns.map(column => (
              <td key={`${rowIndex}-${column.key}`} className={tableCell}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Frame>
  ),
);

DataTableRenderer.displayName = 'DataTable';

export const DataTable = DataTableRenderer;
