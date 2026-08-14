import type { Meta, StoryObj } from '@storybook/react-vite'

function TypographyPage() {
  return (
    <div className="tm-p-6">
      <h1>Typografie</h1>
      <p>
        Teamio používá písmo Poppins (self-hosted přes @fontsource/poppins). Styly nadpisů a
        odstavců pocházejí z globálního typografického CSS modulu.
      </p>

      <h2>Nadpisy</h2>
      <h1>Nadpis 1</h1>
      <h2>Nadpis 2</h2>
      <h3>Nadpis 3</h3>
      <h4>Nadpis 4</h4>
      <h5>Nadpis 5</h5>
      <h6>Nadpis 6</h6>
      <p className="h1">Odstavec s vzhledem nadpisu 1</p>

      <h2>Odstavec</h2>
      <p>
        Teamio pomáhá recruiterům spravovat nábor na jednom místě. Můžete sledovat uchazeče,{' '}
        <strong>plánovat pohovory</strong> a sdílet zpětnou vazbu s hiring manažery.{' '}
        <a href="#typography">Přečtěte si více o typografii</a> a tom, jak ji používat v
        prototipech.
      </p>
      <p>
        Dobře nastavená hierarchie textu usnadňuje skenování stránky a zvyšuje srozumitelnost
        klíčových informací o pozici i kandidátovi.
      </p>

      <h2>Seznamy</h2>
      <ul>
        <li>Připravit popis pozice</li>
        <li>Zveřejnit inzerát</li>
        <li>Vyhodnotit uchazeče</li>
        <li>Domluvit pohovor</li>
      </ul>
      <ol>
        <li>Připravit popis pozice</li>
        <li>Zveřejnit inzerát</li>
        <li>Vyhodnotit uchazeče</li>
        <li>Domluvit pohovor</li>
      </ol>

      <h2>Velikosti písma</h2>
      <p className="tm-text-xs">tm-text-xs — 0.75rem</p>
      <p className="tm-text-sm">tm-text-sm — 0.875rem</p>
      <p className="tm-text-base">tm-text-base — 1rem</p>
      <p className="tm-text-lg">tm-text-lg — 1.125rem</p>
      <p className="tm-text-xl">tm-text-xl — 1.25rem</p>
      <p className="tm-text-2xl">tm-text-2xl — 1.5rem</p>
      <p className="tm-text-3xl">tm-text-3xl — 1.75rem</p>

      <h2>Řezy písma</h2>
      <p className="tm-font-normal">Regular 400</p>
      <p className="tm-font-medium">Medium 500</p>
      <p className="tm-font-semibold">Semibold 600</p>
      <p className="tm-font-bold">Bold 700</p>
    </div>
  )
}

const meta = {
  title: 'Foundation/Typography',
  component: TypographyPage,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
} satisfies Meta<typeof TypographyPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
