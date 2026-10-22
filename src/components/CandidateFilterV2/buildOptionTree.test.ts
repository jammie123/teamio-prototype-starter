import { describe, expect, it } from 'vitest'
import type { CandidateFilterModalOption } from '../Candidate/filterModalTypes'
import { buildOptionTree } from './buildOptionTree'

function values(nodes: ReturnType<typeof buildOptionTree>): string[] {
  return nodes.map((node) => node.option.value)
}

describe('buildOptionTree', () => {
  it('groups options by depth into nested children', () => {
    const options: CandidateFilterModalOption[] = [
      { value: 'a', label: 'A', depth: 0 },
      { value: 'b', label: 'B', depth: 1 },
      { value: 'c', label: 'C', depth: 2 },
      { value: 'd', label: 'D', depth: 0 },
    ]

    const tree = buildOptionTree(options)
    expect(values(tree)).toEqual(['a', 'd'])
    expect(values(tree[0].children)).toEqual(['b'])
    expect(values(tree[0].children[0].children)).toEqual(['c'])
  })

  it('returns a flat list when every option is depth 0', () => {
    const options: CandidateFilterModalOption[] = [
      { value: 'x', label: 'X' },
      { value: 'y', label: 'Y' },
    ]
    const tree = buildOptionTree(options)
    expect(tree).toHaveLength(2)
    expect(tree.every((node) => node.children.length === 0)).toBe(true)
  })
})
