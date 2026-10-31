import {
  Badge,
  Button,
  createTheme,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';

/** Brand indigo. Shade 6 is the light-mode accent, shade 4 the dark-mode accent. */
const brand: MantineColorsTuple = [
  '#ECEAFF',
  '#DAD6FF',
  '#BCB5FF',
  '#A59CFF',
  '#8B80FF',
  '#7466F8',
  '#5B4DF0',
  '#4D3FD8',
  '#3F34B0',
  '#2F2780',
];

/** Dark surfaces, lightest text (0) to page background (9). */
const dark: MantineColorsTuple = [
  '#EEF0FA',
  '#C9CCE3',
  '#9A9FBF',
  '#7A7FA0',
  '#5A5F80',
  '#3A3E5C',
  '#25283F',
  '#1A1C30',
  '#141626',
  '#0B0C16',
];

export const BRAND_GRADIENT = { from: '#4F46E5', to: '#C026D3', deg: 135 };

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 4 },
  colors: { brand, dark },
  black: '#14152B',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontFamilyMonospace: '"JetBrains Mono", ui-monospace, monospace',
  headings: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '500' },
  defaultRadius: 'md',
  radius: { md: '10px', lg: '14px' },
  components: {
    Badge: Badge.extend({ styles: { root: { textTransform: 'none' } } }),
    Button: Button.extend({
      defaultProps: { variant: 'gradient', gradient: BRAND_GRADIENT },
    }),
  },
});

/** Page and surface colors from the design tokens. */
export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': '#FFFFFF',
    '--mantine-color-dimmed': '#5E6280',
    '--mantine-color-default-border': '#E4E6F2',
    '--app-bg': '#F4F5FB',
    '--app-shell-bg': '#E7E4FC',
    '--app-gradient':
      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #C026D3 100%)',
  },
  dark: {
    '--mantine-color-body': '#141626',
    '--mantine-color-dimmed': '#9A9FBF',
    '--mantine-color-default-border': '#25283F',
    '--app-bg': '#0B0C16',
    '--app-shell-bg': '#141626',
    '--app-gradient':
      'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #C026D3 100%)',
  },
});
