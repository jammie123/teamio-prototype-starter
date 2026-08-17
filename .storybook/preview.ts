import type { Preview } from '@storybook/react-vite'
import '../src/styles/global.css'

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'error',
    },
    options: {
      storySort: {
        order: [
          'Foundation',
          [
            'Colors',
            'Typography',
            'Spacing',
            'Shadows and Radii',
            'Breakpoints',
            'Icons',
          ],
          'Components',
          'Complex components',
          'Jobs',
          'Page',
          'App',
        ],
      },
    },
  },
}

export default preview
