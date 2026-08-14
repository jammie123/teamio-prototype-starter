import type { Meta, StoryObj } from '@storybook/react-vite'
import config from '../../tailwind.config.js'

function formatScreen(value: string | { raw?: string; max?: string }): string {
  if (typeof value === 'string') return value
  if (value.raw) return value.raw
  if (value.max) return `max-width: ${value.max}`
  return JSON.stringify(value)
}

function BreakpointsPage() {
  const screens = config.theme.screens as Record<
    string,
    string | { raw?: string; max?: string }
  >

  return (
    <div className="tm-p-6">
      <h1>Breakpoints</h1>
      <p>
        Screen tokeny Teamio (min-width, pokud není uvedeno jinak). Max-* breakpointy jsou v
        konfiguraci seřazeny sestupně, aby override fungoval očekávaně.
      </p>

      <div className="tm-mt-4 tm-overflow-hidden tm-rounded tm-border tm-border-secondary">
        <div className="tm-flex tm-bg-cover-default tm-px-4 tm-py-2 tm-text-sm tm-font-semibold">
          <span className="tm-w-32">Název</span>
          <span className="tm-flex-1">Hodnota</span>
          <span className="tm-w-40">Prefix utility</span>
        </div>
        <div className="tm-divide-y tm-divide-gray-100">
          {Object.entries(screens).map(([name, value]) => (
            <div key={name} className="tm-flex tm-px-4 tm-py-3 tm-text-sm">
              <span className="tm-w-32 tm-font-semibold">{name}</span>
              <span className="tm-flex-1 tm-font-mono tm-text-secondary-default">
                {formatScreen(value)}
              </span>
              <span className="tm-w-40 tm-font-mono tm-text-light-default">{name}:</span>
            </div>
          ))}
        </div>
      </div>

      <h2>Živá ukázka</h2>
      <p className="tm-text-secondary-default">
        Změňte šířku viewportu. Barevné pruhy se zobrazí od odpovídajícího breakpointu.
      </p>
      <div className="tm-mt-4 tm-space-y-2">
        <div className="tm-rounded tm-bg-gray-200 tm-px-4 tm-py-3">
          Vždy viditelné (základ)
        </div>
        <div className="tm-hidden tm-rounded tm-bg-emotion-info-default tm-px-4 tm-py-3 sm:tm-block">
          Viditelné od sm (750px)+
        </div>
        <div className="tm-hidden tm-rounded tm-bg-emotion-success-default tm-px-4 tm-py-3 md:tm-block">
          Viditelné od md (1200px)+
        </div>
        <div className="tm-hidden tm-rounded tm-bg-emotion-warning-default tm-px-4 tm-py-3 lg:tm-block">
          Viditelné od lg (1400px)+
        </div>
        <div className="tm-hidden tm-rounded tm-bg-emotion-promotion-default tm-px-4 tm-py-3 xl:tm-block">
          Viditelné od xl (1800px)+
        </div>
      </div>
    </div>
  )
}

const meta = {
  title: 'Foundation/Breakpoints',
  component: BreakpointsPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof BreakpointsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
