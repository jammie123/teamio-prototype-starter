import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { Dropdown } from './Dropdown'
import { DropdownBody } from './DropdownBody'
import { DropdownToggle } from './DropdownToggle'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div className="tm-mb-[180px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof Dropdown>

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownToggle>Otevřít</DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option onClick={fn()}>Možnost 1</Option>
          <Option onClick={fn()}>Možnost 2</Option>
          <Option onClick={fn()} isSelected>
            Vybraná možnost
          </Option>
          <Option isDisabled>Zakázaná možnost</Option>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  ),
}

export const TertiaryButton: Story = {
  render: () => (
    <Dropdown>
      <DropdownToggle variant="button-tertiary" showIndicator>
        Přidat
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option onClick={fn()}>Nábor</Option>
          <Option onClick={fn()}>Uchazeč</Option>
          <Option onClick={fn()}>Brigáda</Option>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  ),
}

export const IconButton: Story = {
  render: () => (
    <Dropdown>
      <DropdownToggle variant="button-tertiary-circle" aria-label="Další akce">
        <Icon name="plus" className="tm-text-lg" />
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option onClick={fn()}>Akce</Option>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  ),
}

export const CustomToggle: Story = {
  render: () => (
    <Dropdown placement="bottom-end">
      <DropdownToggle variant="custom" showIndicator>
        <span className="tm-flex tm-flex-col tm-items-end tm-text-left">
          <span className="tm-font-semibold tm-text-sm tm-text-primary-default">Jan Fuxa</span>
          <span className="tm-text-xs tm-text-secondary-default">LMCTEST_Teamio s.r.o.</span>
        </span>
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option onClick={fn()}>Nastavení</Option>
          <Option onClick={fn()}>Akademie</Option>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  ),
}
