import { describe, expect, it } from 'vitest'
import { publicationSupportsHighlight } from './publicationActions'

describe('publicationSupportsHighlight', () => {
  it.each([
    { id: 'jobs', channel: 'Jobs.cz' },
    { id: 'prace', channel: 'Prace.cz' },
    { id: 'atmoskop', channel: 'Atmoskop' },
    { id: 'jobs', channel: 'jobs' },
  ])('is true for $channel', (publication) => {
    expect(publicationSupportsHighlight(publication)).toBe(true)
  })

  it.each([
    { id: 'career', channel: 'Kariérní stránky' },
    { id: 'pzr', channel: 'Práce za rohem' },
    { id: 'profesia', channel: 'Profesia' },
  ])('is false for $channel', (publication) => {
    expect(publicationSupportsHighlight(publication)).toBe(false)
  })
})
