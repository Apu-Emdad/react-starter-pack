# Architecture

## Folder rules

- `features/<name>/` holds everything for one business area: `api`, `components`, `pages`, `schemas`, and `store` if it needs Redux state. Create a sub-folder only when it has a file.
- `shared/` holds code used by more than one feature. A feature may import from `shared/` and `theme/`. `shared/` never imports from `features/`, and features don't import each other.
- A component used by one feature stays in that feature's `components/`. Move it to `shared/components/ui/` (or `layout/`) when a second feature needs it.
- Tests sit next to the code (`LoginForm.test.tsx`). `src/test/` holds only the shared setup.
- Route paths live in `shared/constants/routes.ts`, so there are no path strings spread around.

## Auth flow

1. **Login or register:** the API returns the user and an access token in `data`, and sets the refresh token as an `httpOnly` cookie. The token and user go in the Redux `auth` slice. Nothing is stored in `localStorage`.
2. **Page load:** `AuthBootstrap` (in `app/App.tsx`) calls `POST /auth/refresh`. The cookie, if valid, restores the session. Until it finishes, `auth.status` is `loading` and the guards show a loader.
3. **Requests:** the Axios instance (`shared/api/interceptor.ts`) adds `Authorization: Bearer <token>`.
4. **Expired token:** a `401` triggers one refresh, then the request is retried. If the refresh fails, the session is cleared and the user goes to the login page.
5. **One refresh at a time:** the API rotates the refresh token and revokes all sessions if an old one is reused. So `refreshSession()` shares one request between callers, such as React StrictMode or several parallel `401`s.
6. **Logout:** `POST /auth/logout`, then the session and the query cache are cleared, even if the call fails.

Guards in `features/auth/guards/guards.tsx` only hide UI. The API guards its routes.

## Forms

Forms use React Hook Form with a Zod schema. Fields come from `shared/components/ui/FormFields.tsx` and read the form from `<FormProvider>`, so a field needs only a `name`:

```tsx
const methods = useForm<UserValues>({ resolver: zodResolver(userSchema) });

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
    <FormTextInput name="userName" label="User name" />
    <FormSelect name="role" label="Role" data={roles} />
    <FormSwitch name="isActive" label="Active" />
    <Button type="submit">Save</Button>
  </form>
</FormProvider>;
```

- **Text inputs** (`FormTextInput`, `FormPasswordInput`, `FormTextarea`) use `register`, so typing doesn't re-render the form.
- **Other inputs** (`FormSelect`, `FormMultiSelect`, `FormNumberInput`, `FormDateInput`, `FormCheckbox`, `FormSwitch`, `FormRadioGroup`) use `useController` inside the field. You never write `Controller` in a form.
- **Schemas** go in `features/<name>/schemas/`. Use `z.infer` for the form's type, and copy the API's validation rules so both agree.
- **Dependent dropdowns:** read the first value with `useWatch`, and clear the second with `setValue` in `FormSelect`'s `onValueChange`.

## Server data

Lists and details use TanStack Query. A feature's `api/` file has plain Axios calls that return `data`. Pages and components call `useQuery` and `useMutation` directly with those calls, so there are no wrapper hooks. Mutations show the API's `message` in a toast and invalidate the list.

List pages (see `features/users/pages/UsersPage.tsx`) follow one pattern:

- One `filters` state object holds the search text, filters and page. The refresh button resets them and refetches the list.
- A `<XFilters filters setFilters />` component owns the filter UI and its handlers.
- The page owns the query, the table, the mutations and the modals.
- Table columns come from `getTableHeaders()` at the bottom of the file, with no fixed widths.

## Adding a feature

1. Create `src/features/<name>/` with `api/`, `components/` and `pages/`.
2. Add the API calls in `api/`, and call them with `useQuery` or `useMutation` in the page.
3. Add a route in `src/app/router.tsx`. Put it under `RequireRole` if only some roles may see it.
4. Add a link in `src/shared/components/layout/Sidebar.tsx`.
5. Write a test next to the page, using `renderRoutes` from `src/test/utils.tsx` and MSW handlers.

## Theme

`src/theme/theme.ts` has the brand color scale, dark surfaces, fonts, radius and the brand gradient. `cssVariablesResolver` sets the page and surface colors for light and dark. Mantine keeps the user's light/dark choice in `localStorage`.
