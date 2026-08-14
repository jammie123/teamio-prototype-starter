import type { Meta, StoryObj } from '@storybook/react-vite'
import ColorList from './components/ColorList'
import colors from '../styles/colors.js'
import config from '../../tailwind.config.js'

function ColorsPage() {
  return (
    <div className="tm-p-6">
      <h1>Barvy</h1>
      <p>
        Přehled barev pro Teamio web a mobilní aplikaci. Barevné škály jsou první úrovní,
        sémantické aliasy druhou.
      </p>

      <h2>Barevné škály (první úroveň)</h2>
      <ColorList data={colors} />

      <h2>Barevné aliasy (druhá úroveň)</h2>
      <ColorList data={config.theme.colors as Record<string, unknown>} />
    </div>
  )
}

const meta = {
  title: 'Foundation/Colors',
  component: ColorsPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof ColorsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
