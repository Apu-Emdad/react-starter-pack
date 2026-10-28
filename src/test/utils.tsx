import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router';
import { makeStore, type RootState } from '@/app/store/store';
import { theme } from '@/theme/theme';

interface Options {
  route?: string;
  preloadedState?: Partial<RootState>;
}

/** Renders routes with the same providers as the real app. */
export const renderRoutes = (
  routes: RouteObject[],
  { route = '/', preloadedState }: Options = {},
) => {
  const store = makeStore(preloadedState);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(routes, { initialEntries: [route] });

  const view = render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </Provider>,
  );

  return { ...view, store, router };
};
