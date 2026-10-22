import type { CandidateFilterModalOption } from '../Candidate/filterModalTypes'

export interface FilterOptionTreeNode {
  option: CandidateFilterModalOption
  children: FilterOptionTreeNode[]
}

/**
 * Builds a tree from a flat option list using `depth` (same nesting rules as FilterModal dropdown indent).
 */
export function buildOptionTree(options: CandidateFilterModalOption[]): FilterOptionTreeNode[] {
  const roots: FilterOptionTreeNode[] = []
  const stack: FilterOptionTreeNode[] = []

  for (const option of options) {
    const depth = option.depth ?? 0
    const node: FilterOptionTreeNode = { option, children: [] }

    while (stack.length > depth) {
      stack.pop()
    }

    if (depth === 0) {
      roots.push(node)
      stack.length = 0
      stack.push(node)
      continue
    }

    const parent = stack[depth - 1]
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    stack[depth] = node
    stack.length = depth + 1
  }

  return roots
}
