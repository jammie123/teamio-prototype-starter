import { sampleJobPreviewTitle } from './jobPreviewFixtures'

const SECTIONS: { heading: string; items: string[] }[] = [
  {
    heading: 'Co budeš dělat?',
    items: [
      'Dohled a podpora IP služeb.',
      'Řešení technických incidentů (tickety, e-mail, občas telefon).',
      'Spolupráce s techniky a dalšími IT týmy.',
    ],
  },
  {
    heading: 'Co bys měl/a znát?',
    items: [
      'Základy sítí (TCP/IP, IPv4/IPv6, LAN/WAN; MPLS a WiFi výhodou).',
      'Studuješ technický obor (IT, elektro, telekomunikace).',
      'Máš chuť učit se nové věci a rozvíjet se.',
    ],
  },
  {
    heading: 'Co za to?',
    items: ['Flexibilní směny podle školy.'],
  },
]

/** Ukázkový obsah náhledu inzerátu (převzato z návrhu); `portalName` ukazuje přerenderování po přepnutí. */
export function SampleJobPreviewAdvertisement({ portalName }: { portalName: string }) {
  return (
    <div className="tm-flex tm-flex-col tm-gap-6 tm-px-10 tm-pb-12 tm-pt-7 tm-text-base tm-leading-normal tm-text-primary-default">
      <div className="tm-flex tm-items-center tm-justify-between tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-4">
        <span className="tm-text-3xl tm-font-bold">{portalName}</span>
        <span className="tm-text-sm tm-font-semibold">MENU</span>
      </div>

      <div className="tm-flex tm-min-h-[15rem] tm-flex-col tm-items-center tm-justify-center tm-gap-5 tm-rounded-lg tm-bg-inverted tm-px-8 tm-py-10 tm-text-center tm-text-primary-inverted-default">
        <h1 className="tm-m-0 tm-max-w-[40rem] tm-text-3xl tm-font-bold tm-leading-tight">
          {sampleJobPreviewTitle}
        </h1>
        <div className="tm-flex tm-items-center tm-gap-8 tm-font-medium">
          <span>Praha</span>
          <span>Brigáda</span>
        </div>
      </div>

      <p className="tm-m-0 tm-font-bold">
        Přidej se do týmu dohledového centra zákaznických sítí a nahlédni pod pokličku světa
        telekomunikací!
      </p>
      <p className="tm-m-0">
        Studuješ <strong>IT, telekomunikace nebo elektro, je ti minimálně 18 let</strong> a chceš
        získat praxi z reálného provozu sítí? U nás se naučíš, jak funguje IP síť jednoho z
        největších providerů v Česku.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.heading} className="tm-flex tm-flex-col tm-gap-3">
          <h2 className="tm-m-0 tm-text-2xl tm-font-semibold">{section.heading}</h2>
          <ul className="tm-m-0 tm-flex tm-list-disc tm-flex-col tm-gap-1 tm-pl-5">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
