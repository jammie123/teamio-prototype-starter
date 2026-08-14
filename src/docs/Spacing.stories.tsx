import type { Meta, StoryObj } from '@storybook/react-vite'
import SpacingList from './components/SpacingList'
import config from '../../tailwind.config.js'

function SpacingPage() {
  return (
    <div className="tm-p-6">
      <h1>Mezery</h1>
      <p>
        Teamio používá vlastní spacing škálu (ne výchozí Tailwind). Jedna jednotka je obvykle
        0.25rem (4px). Preferujte hodnoty dělitelné čtyřmi; jinak použijte libovolné hodnoty.
      </p>
      <h2>Škála mezer</h2>
      <SpacingList data={config.theme.spacing} />
    </div>
  )
}

const meta = {
  title: 'Foundation/Spacing',
  component: SpacingPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof SpacingPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
