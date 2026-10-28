import { ActionIcon, Group, Select, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type Dispatch, type SetStateAction } from 'react';
import { ROLE } from '@/shared/constants/roles';
import type { UsersFiltersState } from '../types';

interface Props {
  filters: UsersFiltersState;
  setFilters: Dispatch<SetStateAction<UsersFiltersState>>;
}

export const EMPTY_FILTERS: UsersFiltersState = {
  search: '',
  role: '',
  isActive: '',
  page: 1,
  pageSize: 10,
};

const ROLE_OPTIONS = Object.values(ROLE);
const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export const UsersFilters = ({ filters, setFilters }: Props) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState(filters.search);

  const applySearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, 400);

  const handleSearch = (value: string) => {
    setSearchText(value);
    applySearch(value);
  };

  const handleChange = (key: 'role' | 'isActive', value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value ?? '', page: 1 }));
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilters(EMPTY_FILTERS);
    // Refetches only when the filters were already empty; otherwise the new filters load the list.
    queryClient.refetchQueries({
      queryKey: ['users', EMPTY_FILTERS],
      exact: true,
    });
  };

  return (
    <Group gap="sm" grow={false}>
      <TextInput
        style={{ flex: 1, minWidth: 220 }}
        placeholder="Search by name or email"
        leftSection={<IconSearch size={16} />}
        value={searchText}
        onChange={(event) => handleSearch(event.currentTarget.value)}
      />
      <Select
        w={150}
        placeholder="All roles"
        data={ROLE_OPTIONS}
        value={filters.role || null}
        onChange={(value) => handleChange('role', value)}
        clearable
      />
      <Select
        w={150}
        placeholder="All status"
        data={STATUS_OPTIONS}
        value={filters.isActive || null}
        onChange={(value) => handleChange('isActive', value)}
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
