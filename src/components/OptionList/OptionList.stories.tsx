import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Option } from './Option'
import { OptionList } from './OptionList'

const meta = {
  title: 'Components/OptionList',
  component: OptionList,
  decorators: [
    (Story) => (
      <div className="tm-mb-[180px]">
        <Dropdown isOpen onOpenChange={() => undefined}>
          <DropdownToggle>Menu</DropdownToggle>
          <DropdownBody>
            <Story />
          </DropdownBody>
        </Dropdown>
      </div>
    ),
  ],
} satisfies Meta<typeof OptionList>

export default meta
type Story = StoryObj<typeof OptionList>

export const Default: Story = {
  render: () => (
    <OptionList>
      <Option onClick={fn()}>Primární</Option>
      <Option onClick={fn()} isSelected>
        Vybraná
      </Option>
      <Option onClick={fn()} isDisabled>
        Zakázaná
      </Option>
      <Option onClick={fn()} color="danger">
        Nebezpečná
      </Option>
    </OptionList>
  ),
}

export const Sorting: Story = {
  render: () => (
    <OptionList>
      <Option onClick={fn()} isSelected>
        Nejnovější
      </Option>
      <Option onClick={fn()}>Nejstarší</Option>
      <Option onClick={fn()}>Podle názvu</Option>
    </OptionList>
  ),
}
