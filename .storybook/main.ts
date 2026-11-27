import { resolve } from 'node:path'
import type { StorybookConfig } from '@storybook/react-vite'
import remarkGfm from 'remark-gfm'
import { allowedFsRoots } from '../src/lib/allowedFsRoots'

const config: StorybookConfig = {
  stories: [
    '../src/*.mdx',
    '../src/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    {
      name: '@storybook/addon-docs',
      // remark-gfm: tabulky v MDX (bez něj se vykreslí jako holý text s |).
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
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
