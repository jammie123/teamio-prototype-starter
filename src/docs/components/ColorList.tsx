import React, { type FC, type ReactNode } from 'react'

type ConfigData = { [key: string]: unknown }

interface ColorListProps {
  data: ConfigData
}

const getBackgroundColor = (value: string): React.CSSProperties => {
  switch (value) {
    case 'transparent':
      return {
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px',
        backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
                  linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)`,
        border: '1px solid #e5e7f1',
      }
    case 'inherit':
    case '#ffffff':
      return { border: '1px solid #e5e7f1' }
    default:
      return { backgroundColor: value }
  }
}

const renderColor = (key: string, value: string, path: string[]) => (
  <div
    key={[...path, key].join('.')}
    className="tm-inline-flex tm-w-1/2 tm-flex-col tm-p-2 sm:tm-w-1/4 md:tm-w-1/6"
  >
    <div className="!tm-mb-1 tm-h-16 tm-rounded" style={getBackgroundColor(value)} />
    <div className="!tm-text-sm tm-text-light-default">{path.join('.')}</div>
    <div className="!tm-text-base tm-font-semibold tm-text-secondary-default">{key}</div>
    <div className="!tm-font-mono !tm-text-sm tm-text-light-default">{value}</div>
  </div>
)

const list = (data: ConfigData, depth = 0, path: string[] = []): ReactNode => (
  <>
    {Object.keys(data).map((key) => {
      const value = data[key]
      const isObj = typeof value === 'object' && value !== null

      if (isObj) {
        const nextPath = [...path, key]
        const HeadingTag = `h${Math.min(depth + 3, 6)}` as keyof React.JSX.IntrinsicElements

        return (
          <div key={nextPath.join('.')}>
            {React.createElement(
              HeadingTag,
              { className: '!tm-mt-4 tm-capitalize' },
              nextPath.slice(-1)[0],
            )}
            {list(value as ConfigData, depth + 1, nextPath)}
          </div>
        )
      }

      return renderColor(key, value as string, path)
    })}
  </>
)

const ColorList: FC<ColorListProps> = ({ data }) => list(data)

export default ColorList
