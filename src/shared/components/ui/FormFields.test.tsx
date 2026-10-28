import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { FormCheckbox, FormSwitch, FormTextInput } from './FormFields';

const schema = z.object({
  name: z.string().min(3, 'Name is too short'),
  agree: z.boolean(),
  active: z.boolean(),
});
type Values = z.infer<typeof schema>;

const TestForm = ({ onSubmit }: { onSubmit: (values: Values) => void }) => {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', agree: false, active: true },
  });
  return (
    <MantineProvider>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormTextInput name="name" label="Name" />
          <FormCheckbox name="agree" label="I agree" />
          <FormSwitch name="active" label="Active" />
          <Button type="submit">Save</Button>
        </form>
      </FormProvider>
    </MantineProvider>
  );
};

describe('FormFields', () => {
  it('shows the schema error under the field', async () => {
    render(<TestForm onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByLabelText('Name'), 'ab');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Name is too short')).toBeInTheDocument();
  });

  it('submits the values of text, checkbox and switch fields', async () => {
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText('Name'), 'maya');
    await userEvent.click(screen.getByLabelText('I agree'));
    await userEvent.click(screen.getByLabelText('Active'));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      name: 'maya',
      agree: true,
      active: false,
    });
  });
});
