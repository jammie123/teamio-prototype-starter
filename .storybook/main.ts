import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import { allowedFsRoots } from '../src/lib/allowedFsRoots'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@whitespace/storybook-addon-html',
    // Panel "Component tree" – kompozice React komponent aktuální story.
    resolve(import.meta.dirname, '../src/storybook/component-tree/preset.js'),
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    server: {
      ...viteConfig.server,
      fs: {
        ...viteConfig.server?.fs,
        allow: [...(viteConfig.server?.fs?.allow ?? []), ...allowedFsRoots()],
      },
    },
  }),
}

export default config
