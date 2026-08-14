import type { Meta, StoryObj } from '@storybook/react-vite'
import config from '../../tailwind.config.js'
import { shadowUtilityClass } from './shadowUtilities'

function ShadowsRadiiPage() {
  const shadows = config.theme.boxShadow
  const radii = config.theme.borderRadius

  return (
    <div className="tm-p-6">
      <h1>Stíny a zaoblení</h1>
      <p>Tokeny elevace a poloměru rohů z Teamio Tailwind tématu.</p>

      <h2>Box stíny</h2>
      <div className="tm-grid tm-grid-cols-1 tm-gap-4 sm:tm-grid-cols-2 md:tm-grid-cols-3">
        {Object.entries(shadows).map(([name, value]) => (
          <div
            key={name}
            className="tm-rounded tm-bg-basic tm-p-4"
            style={{ boxShadow: value === 'none' ? undefined : value }}
          >
            <div className="tm-font-semibold tm-text-secondary-default">
              {name === 'DEFAULT' ? 'výchozí' : name}
            </div>
            <div className="tm-mt-1 tm-font-mono tm-text-sm tm-text-light-default">{value}</div>
            <div
              className={`tm-mt-4 tm-h-16 tm-rounded tm-bg-cover-default ${shadowUtilityClass(
                name,
              )}`}
            />
          </div>
        ))}
      </div>

      <h2>Zaoblení rohů</h2>
      <div className="tm-grid tm-grid-cols-2 tm-gap-4 sm:tm-grid-cols-3 md:tm-grid-cols-6">
        {Object.entries(radii).map(([name, value]) => (
          <div key={name} className="tm-flex tm-flex-col tm-items-center tm-gap-2">
            <div
              className="tm-h-20 tm-w-20 tm-bg-teamio-blue"
              style={{ borderRadius: value }}
            />
            <div className="tm-font-semibold tm-text-secondary-default">
              {name === 'DEFAULT' ? 'výchozí' : name}
            </div>
            <div className="tm-font-mono tm-text-sm tm-text-light-default">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'Foundation/Shadows and Radii',
  component: ShadowsRadiiPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof ShadowsRadiiPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
