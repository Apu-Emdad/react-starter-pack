import { ActionIcon, Group, Select, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  DEPARTMENT_LABELS,
  EMPLOYMENT_TYPE_LABELS,
  type EmployeesFiltersState,
} from '../types';

interface Props {
  filters: EmployeesFiltersState;
  setFilters: Dispatch<SetStateAction<EmployeesFiltersState>>;
}

export const EMPTY_FILTERS: EmployeesFiltersState = {
  search: '',
  department: '',
  employmentType: '',
  isRemote: '',
  page: 1,
  pageSize: 10,
};

const DEPARTMENT_OPTIONS = Object.entries(DEPARTMENT_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const EMPLOYMENT_TYPE_OPTIONS = Object.entries(EMPLOYMENT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const REMOTE_OPTIONS = [
  { value: 'true', label: 'Remote' },
  { value: 'false', label: 'On site' },
];

export const EmployeesFilters = ({ filters, setFilters }: Props) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState(filters.search);

  const applySearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, 400);

  const handleSearch = (value: string) => {
    setSearchText(value);
    applySearch(value);
  };

  const handleChange = (
    key: 'department' | 'employmentType' | 'isRemote',
    value: string | null,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value ?? '', page: 1 }));
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilters(EMPTY_FILTERS);
    // Refetches only when the filters were already empty; otherwise the new filters load the list.
    queryClient.refetchQueries({
      queryKey: ['employees', EMPTY_FILTERS],
      exact: true,
    });
  };

  return (
    <Group gap="sm" grow={false}>
      <TextInput
        style={{ flex: 1, minWidth: 220 }}
        placeholder="Search by name, user name or email"
        leftSection={<IconSearch size={16} />}
        value={searchText}
        onChange={(event) => handleSearch(event.currentTarget.value)}
      />
      <Select
        w={160}
        placeholder="All departments"
        data={DEPARTMENT_OPTIONS}
        value={filters.department || null}
        onChange={(value) => handleChange('department', value)}
        clearable
      />
      <Select
        w={150}
        placeholder="All types"
        data={EMPLOYMENT_TYPE_OPTIONS}
        value={filters.employmentType || null}
        onChange={(value) => handleChange('employmentType', value)}
        clearable
      />
      <Select
        w={140}
        placeholder="Any location"
        data={REMOTE_OPTIONS}
        value={filters.isRemote || null}
        onChange={(value) => handleChange('isRemote', value)}
        clearable
      />
      <ActionIcon
        variant="default"
        size={36}
        aria-label="Refresh"
        onClick={handleRefresh}
      >
        <IconRefresh size={18} />
      </ActionIcon>
    </Group>
  );
};
