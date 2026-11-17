import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { extractTree, filterTree, treeToText } from './extractTree'
import type { TreeNode } from './constants'

function Leaf({ label }: { label: string }) {
  return <span>{label}</span>
}

function Branch() {
  return (
    <div>
      <Leaf label="a" />
      <Leaf label="b" />
    </div>
  )
}

function names(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => [node.name, ...names(node.children)])
}

describe('extractTree', () => {
  it('returns the composition of React components without DOM elements', () => {
    const { container } = render(<Branch />)

    const tree = extractTree(container)

    expect(treeToText(tree)).toBe('<Branch>\n  <Leaf>\n  <Leaf>')
  })

  it('marks components from this repo as project components with a file', () => {
    const { container } = render(<Branch />)

    const [branch] = extractTree(container)

    expect(branch.project).toBe(true)
    expect(branch.file).toMatch(/extractTree\.test\.tsx$/)
  })

  it('summarizes props without children', () => {
    const { container } = render(<Leaf label="hello" />)

    const [leaf] = extractTree(container)

    expect(leaf.props).toEqual(['label="hello"'])
  })

  it('hides library components and promotes their children', () => {
    const tree: TreeNode[] = [
      {
        name: 'Project',
        project: true,
        props: [],
        children: [
          {
            name: 'Library',
            project: false,
            props: [],
            children: [{ name: 'Inner', project: true, props: [], children: [] }],
          },
        ],
      },
    ]

    expect(names(filterTree(tree, false))).toEqual(['Project', 'Inner'])
    expect(names(filterTree(tree, true))).toEqual(['Project', 'Library', 'Inner'])
  })

  it('returns an empty tree for an empty container', () => {
    expect(extractTree(document.createElement('div'))).toEqual([])
  })
})
