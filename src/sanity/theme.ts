import { buildLegacyTheme } from 'sanity'

const props = {
  '--my-white': '#ffffff',
  '--my-black': '#0f172a',
  '--my-brand': '#dc2626',        // Red - Anterbae primary
  '--my-brand-secondary': '#b91c1c', // Red dark
  '--my-green': '#16a34a',        // Green - Anterbae secondary (AB logo)
  '--my-red': '#dc2626',
  '--my-orange': '#f97316',
}

export const myTheme = buildLegacyTheme({
  '--black': props['--my-black'],
  '--white': props['--my-white'],

  '--gray': '#64748b',
  '--gray-base': '#64748b',

  '--component-bg': props['--my-white'],
  '--component-text-color': props['--my-black'],

  /* Brand - Red for Anterbae */
  '--brand-primary': props['--my-brand'],

  '--default-button-color': '#64748b',
  '--default-button-primary-color': props['--my-brand'],
  '--default-button-success-color': props['--my-green'],
  '--default-button-warning-color': props['--my-orange'],
  '--default-button-danger-color': props['--my-red'],

  '--state-info-color': props['--my-brand'],
  '--state-success-color': props['--my-green'],
  '--state-warning-color': props['--my-orange'],
  '--state-danger-color': props['--my-red'],

  /* Navbar - Dark like the logo background */
  '--main-navigation-color': props['--my-black'],
  '--main-navigation-color--inverted': props['--my-white'],

  '--focus-color': props['--my-brand'],
})
