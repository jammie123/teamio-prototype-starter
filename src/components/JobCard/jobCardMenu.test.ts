import { describe, expect, it, vi } from 'vitest'
import { buildJobCardMenuSections } from './jobCardMenu'

describe('buildJobCardMenuSections', () => {
  it('puts advertisement actions before the job section', () => {
    const sections = buildJobCardMenuSections({
      advertisements: [{ id: 'ad-1' }],
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
      onHighlightAdvertisement: vi.fn(),
      onTopAdvertisement: vi.fn(),
      onEditJob: vi.fn(),
      onDuplicateJob: vi.fn(),
      onInviteColleagues: vi.fn(),
      onTransferJob: vi.fn(),
      onArchiveJob: vi.fn(),
    })

    expect(sections.map((section) => section.id)).toEqual(['advertisement', 'job'])
    expect(sections[0].items.map((item) => ({ label: item.label, description: item.description }))).toEqual([
      { label: 'Editovat inzerát', description: undefined },
      { label: 'Prodloužit a znovu vystavit', description: undefined },
      { label: 'Ukončit vystavení', description: undefined },
      { label: 'Zvýraznit', description: undefined },
      { label: 'Topovat', description: undefined },
    ])
    expect(sections[0].items.every((item) => item.actions === undefined)).toBe(true)
    expect(sections[1].items.map((item) => item.label)).toEqual([
      'Editovat nábor',
      'Duplikovat',
      'Zapojit kolegy',
      'Předat nábor',
      'Archivovat',
    ])
  })

  it('replaces advertisement actions with Přidat inzerát when none exist', () => {
    const onCreateAdvertisement = vi.fn()
    const sections = buildJobCardMenuSections({
      advertisements: [],
      onCreateAdvertisement,
      onEditAdvertisement: vi.fn(),
      onExtendAndRepublish: vi.fn(),
      onEndPublication: vi.fn(),
      onHighlightAdvertisement: vi.fn(),
      onTopAdvertisement: vi.fn(),
      onEditJob: vi.fn(),
    })

    expect(sections[0].items.map((item) => item.label)).toEqual(['Přidat inzerát'])
    expect(sections[0].items[0].onClick).toBe(onCreateAdvertisement)
    expect(sections[1].items.map((item) => item.label)).toEqual(['Editovat nábor'])
  })

  it('drops sections without any action', () => {
    expect(buildJobCardMenuSections({})).toEqual([])
    expect(buildJobCardMenuSections({ onEditJob: vi.fn() })).toEqual([
      { id: 'job', items: [expect.objectContaining({ label: 'Editovat nábor' })] },
    ])
  })

  it('appends custom actions after the built-in job actions', () => {
    const sections = buildJobCardMenuSections({
      onEditJob: vi.fn(),
      actions: [{ id: 'extra', label: 'Další akce' }],
    })

    expect(sections[0].items.map((item) => item.label)).toEqual(['Editovat nábor', 'Další akce'])
  })
})
