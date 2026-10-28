import { Table } from '@mantine/core';
import type { ReactNode } from 'react';
import { getErrorMessage } from '@/shared/api/interceptor';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PageLoader } from './PageLoader';

export interface TableHeader<T> {
  label: string;
  render: (row: T) => ReactNode;
}

interface Props<T> {
  headers: TableHeader<T>[];
  rows: T[];
  isPending: boolean;
  error: unknown;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription?: string;
  minWidth?: number;
}

/** Shows a loader, the error with a retry button, or an empty state before the rows. */
export const CustomTable = <T,>({
  headers,
  rows,
  isPending,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
  minWidth = 640,
}: Props<T>) => {
  if (isPending) return <PageLoader />;

  if (error) {
    return <ErrorState message={getErrorMessage(error)} onRetry={onRetry} />;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table.ScrollContainer minWidth={minWidth}>
      <Table highlightOnHover verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            {headers.map((header, index) => (
              <Table.Th key={index}>{header.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((row, rowIndex) => (
            <Table.Tr key={rowIndex}>
              {headers.map((header, index) => (
                <Table.Td key={index}>{header.render(row)}</Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
};
