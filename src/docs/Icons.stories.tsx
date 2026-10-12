import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type KnownIconName } from '../components/Icon'

const ICON_LABELS: Record<KnownIconName, string> = {
  plus: 'Přidat',
  'plus-circle': 'Přidat (kruh)',
  check: 'Hotovo',
  x: 'Zavřít',
  search: 'Hledat',
  info: 'Informace',
  warning: 'Varování',
  eye: 'Zobrazit',
  'external-link': 'Externí odkaz',
  download: 'Stáhnout',
  'arrow-left': 'Šipka vlevo',
  'arrow-right': 'Šipka vpravo',
  'chevron-left': 'Chevron vlevo',
  'chevron-right': 'Chevron vpravo',
  'chevron-up': 'Chevron nahoru',
  'chevron-down': 'Chevron dolů',
  'chevrons-left': 'Dvojitý chevron vlevo',
  'chevrons-right': 'Dvojitý chevron vpravo',
  trash: 'Smazat',
  edit: 'Editovat',
  menu: 'Menu',
  'more-vertical': 'Další akce',
  home: 'Přehled',
  'file-text': 'Nábory',
  user: 'Uchazeči',
  briefcase: 'Preboarding',
  database: 'Databáze',
  calendar: 'Kalendář',
  'bar-chart': 'Statistiky',
  mail: 'Zprávy',
  notification: 'Notifikace',
  maximize: 'Na celou obrazovku',
  paperclip: 'Příloha',
  star: 'Hvězdička',
  sparkles: 'AI',
  tag: 'Štítek',
  phone: 'Telefon',
  ban: 'Zamítnuto',
  'circle-check': 'Přijato',
  'message-square': 'Zpráva',
  'sliders-horizontal': 'Filtry',
  opal: 'Opalcování',
}

const KNOWN_ICONS = Object.keys(ICON_LABELS) as KnownIconName[]

function IconsPage() {
  return (
    <div className="tm-p-6">
      <h1>Ikony</h1>
      <p>
        Ikony jsou dostupné přes lokální komponentu <code className="tm-font-mono">Icon</code>{' '}
        z <code className="tm-font-mono">src/components/Icon</code>. Pod ní běží veřejný balíček{' '}
        <code className="tm-font-mono">lucide-react</code>. Neznámé <code className="tm-font-mono">name</code>{' '}
        spadne na deterministický fallback (ikona nápovědy).
      </p>

      <h2>API</h2>
      <pre className="tm-overflow-x-auto tm-rounded tm-bg-cover-default tm-p-4 tm-font-mono tm-text-sm">
        {`<Icon name="check" />
<Icon name="search" title="Hledat" className="tm-text-2xl" />
<Icon name="neznama-ikona" title="Neznámá ikona" />`}
      </pre>
      <ul className="tm-mt-3 tm-list-disc tm-pl-6 tm-text-secondary-default">
        <li>
          <code className="tm-font-mono">name</code> — známý klíč z mapy ikon, nebo libovolný
          řetězec (fallback)
        </li>
        <li>
          <code className="tm-font-mono">title</code> — přístupný název (<code className="tm-font-mono">role=&quot;img&quot;</code>);
          bez title je ikona dekorativní (<code className="tm-font-mono">aria-hidden</code>)
        </li>
        <li>
          velikost řídíte přes <code className="tm-font-mono">className</code> (např.{' '}
          <code className="tm-font-mono">tm-text-2xl</code>), barva přes{' '}
          <code className="tm-font-mono">currentColor</code>
        </li>
      </ul>

      <h2>Známé ikony</h2>
      <div className="tm-mt-4 tm-grid tm-grid-cols-2 tm-gap-4 sm:tm-grid-cols-3 md:tm-grid-cols-5">
        {KNOWN_ICONS.map((name) => (
          <div
            key={name}
            className="tm-flex tm-flex-col tm-items-center tm-gap-2 tm-rounded tm-border tm-border-secondary tm-bg-basic tm-p-4"
          >
            <Icon name={name} title={ICON_LABELS[name]} className="tm-text-3xl tm-text-teamio-blue" />
            <span className="tm-text-sm tm-font-semibold tm-text-secondary-default">
              {ICON_LABELS[name]}
            </span>
            <span className="tm-font-mono tm-text-xs tm-text-light-default">{name}</span>
          </div>
        ))}
      </div>

      <h2>Fallback</h2>
      <div className="tm-mt-4 tm-inline-flex tm-flex-col tm-items-center tm-gap-2 tm-rounded tm-border tm-border-secondary tm-bg-basic tm-p-4">
        <Icon
          name="neznama-teamio-ikona"
          title="Neznámá ikona"
          className="tm-text-3xl tm-text-teamio-blue"
        />
        <span className="tm-text-sm tm-font-semibold tm-text-secondary-default">
          Neznámá ikona
        </span>
        <span className="tm-font-mono tm-text-xs tm-text-light-default">
          neznama-teamio-ikona
        </span>
      </div>
    </div>
  )
}

const meta = {
  title: 'Foundation/Icons',
  component: IconsPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof IconsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
