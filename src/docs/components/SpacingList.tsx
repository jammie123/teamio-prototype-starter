import type { FC } from 'react'

type ConfigData = { [key: string | number]: string }

interface SpacingListProps {
  data: ConfigData
}

function getSizeInPixels(size: string): string {
  if (size.includes('%')) return ''

  if (Number(size) === 0) return '0px'

  if (size.includes('px')) {
    return size
  }

  if (size.includes('rem')) {
    const unitless = Number(size.replace('rem', ''))

    return `${unitless * 16}px`
  }

  return size
}

const renderSpace = (key: string, value: string) => (
  <div key={key} className="tm-flex tm-items-baseline tm-py-2 [&>span]:tm-text-sm">
    <span className="tm-w-20 tm-flex-none">{key}</span>
    <span className="tm-w-20 tm-flex-none">
      {value.startsWith('.') ? `0${value}` : value}
    </span>
    <span className="tm-w-20 tm-flex-none">{getSizeInPixels(value)}</span>
    <span className="tm-flex-auto tm-self-center">
      <span className="tm-block tm-h-4 tm-bg-teamio-blue" style={{ width: value }} />
    </span>
  </div>
)

const SpacingList: FC<SpacingListProps> = ({ data }) => (
  <div className="!tm-mt-4">
    <div className="tm-flex tm-border-b tm-border-gray-200 tm-pb-1 [&>strong]:tm-text-sm">
      <strong className="tm-w-20 tm-flex-none">Název</strong>
      <strong className="tm-w-20 tm-flex-none">Velikost</strong>
      <strong className="tm-w-20 tm-flex-none">Pixely</strong>
    </div>
    <div className="tm-divide-y tm-divide-gray-100">
      {Object.keys(data).map((key) => renderSpace(key, data[key]))}
    </div>
  </div>
)

export default SpacingList
