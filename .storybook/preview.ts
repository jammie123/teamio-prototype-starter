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
    html: {
      removeEmptyComments: true,
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
          [
            'Přehled výpisu náborů',
            'Job Card',
            [
              '*',
              'Subkomponenty',
              [
                'JobMenu',
                'JobAssignee',
                'JobPipeline',
                'JobNote',
                'AdvertisementWidget',
                'AdvertisementHeader',
                'PublicationList',
                'PublicationItem',
                'PublicationHoverCard',
                'AdvertisementStats',
                'AdvertisementEmptyState',
              ],
            ],
            'JobPageHeader',
            ['V1'],
            'JobsFilter',
            ['V2'],
            'EmptyJobSearch',
            'JobBulkAction',
            'JobModals',
          ],
          'AI Evaluation',
          [
            'ScoreSummary',
            [
              'V2',
              [
                '*',
                'Dialog',
                'Parts',
                [
                  'Header',
                  'Hodnocení',
                  'Shrnutí uchazeče',
                  'Splňuje kritéria',
                  'Kritérium',
                  'Kritérium kompaktní',
                  'Otázky',
                ],
              ],
            ],
          ],
          'Page',
          'App',
        ],
      },
    },
  },
}

export default preview
