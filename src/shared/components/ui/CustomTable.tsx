import { Group, Pagination, Table, Text } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import { getErrorMessage } from '@/shared/api/interceptor';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { PageLoader } from './PageLoader';

export interface TableHeader<T> {
  label: string;
  render: (row: T) => ReactNode;
}

interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
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
  maxTableHeight?: CSSProperties['maxHeight'];
  pagination?: TablePagination;
}

/**
 * Shows a loader, the error with a retry button, or an empty state before the rows.
 * Renders pagination under the rows when `pagination` is passed and there is more than one page.
 */
export const CustomTable = <T,>({
  headers,
  rows,
  isPending,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
  minWidth = 640,
  maxTableHeight = '65vh',
  pagination,
}: Props<T>) => {
  if (isPending) return <PageLoader />;

  if (error) {
    return <ErrorState message={getErrorMessage(error)} onRetry={onRetry} />;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <>
      <Table.ScrollContainer minWidth={minWidth} maxHeight={maxTableHeight}>
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

      {pagination && totalPages > 1 && (
        <Group
          justify="space-between"
          px="md"
          py="sm"
          style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}
        >
          <Text size="sm" c="dimmed">
            Page {pagination.page} of {totalPages}
          </Text>
          <Pagination
            value={pagination.page}
            total={totalPages}
            onChange={pagination.onChange}
          />
        </Group>
      )}
    </>
  );
};
