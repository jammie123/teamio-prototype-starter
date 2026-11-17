/* eslint-disable react-refresh/only-export-components -- Storybook entry, no fast refresh */
import React, { memo, useEffect, useMemo, useState } from 'react'
import { addons, types, useAddonState, useChannel } from 'storybook/manager-api'
import { AddonPanel } from 'storybook/internal/components'
import { ADDON_ID, EVENTS, PANEL_ID, type TreeNode } from './constants'
import { filterTree, treeToText } from './extractTree'

const mono: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 12,
  lineHeight: '20px',
}

const muted: React.CSSProperties = { opacity: 0.55 }

function NodeView({ node, showProps }: { node: TreeNode; showProps: boolean }) {
  const hasChildren = node.children.length > 0

  const label = (
    <span style={mono} title={node.file}>
      <span style={{ opacity: 0.5 }}>&lt;</span>
      <strong style={{ fontWeight: node.project ? 700 : 400, opacity: node.project ? 1 : 0.7 }}>
        {node.name}
      </strong>
      {showProps && node.props.length > 0 && <span style={muted}> {node.props.join(' ')}</span>}
      <span style={{ opacity: 0.5 }}>{hasChildren ? '>' : ' />'}</span>
      {node.file && <span style={{ ...muted, marginLeft: 10, fontSize: 11 }}>{node.file}</span>}
    </span>
  )

  if (!hasChildren) {
    return <div style={{ paddingLeft: 14 }}>{label}</div>
  }

  return (
    <details open style={{ paddingLeft: 14 }}>
      <summary style={{ cursor: 'pointer', marginLeft: -14, listStylePosition: 'inside' }}>
        {label}
      </summary>
      <div style={{ borderLeft: '1px solid rgba(128,128,128,0.3)', marginLeft: 4 }}>
        {node.children.map((child, index) => (
          <NodeView key={`${child.name}-${index}`} node={child} showProps={showProps} />
        ))}
      </div>
    </details>
  )
}

function hasProjectNode(nodes: TreeNode[]): boolean {
  return nodes.some((node) => node.project || hasProjectNode(node.children))
}

const Panel = memo(function Panel({ active = false }: { active?: boolean }) {
  const [{ tree }, setState] = useAddonState<{ tree: TreeNode[] }>(ADDON_ID, { tree: [] })
  const [showLibrary, setShowLibrary] = useState(false)
  const [showProps, setShowProps] = useState(false)
  const [copied, setCopied] = useState(false)

  const emit = useChannel({
    [EVENTS.TREE_UPDATE]: (payload: string) => {
      setState((state) => ({ ...state, tree: JSON.parse(payload) as TreeNode[] }))
    },
  })

  // Po otevření panelu si vyžádáme čerstvý strom (mohl se vykreslit dřív, než panel poslouchal).
  useEffect(() => {
    if (active) emit(EVENTS.TREE_REQUEST)
  }, [active, emit])

  // V produkčním buildu (storybook-static) nejde poznat původ komponenty -> ukážeme vše.
  const canDistinguish = useMemo(() => hasProjectNode(tree), [tree])
  const visible = useMemo(
    () => filterTree(tree, showLibrary || !canDistinguish),
    [tree, showLibrary, canDistinguish],
  )

  const copy = () => {
    void navigator.clipboard.writeText(treeToText(visible, showProps)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  return (
    <AddonPanel active={active}>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 10, fontSize: 12 }}>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showProps}
              onChange={(event) => setShowProps(event.target.checked)}
            />{' '}
            Props
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={showLibrary}
              onChange={(event) => setShowLibrary(event.target.checked)}
            />{' '}
            Knihovní komponenty (Radix, Lucide…)
          </label>
          <button type="button" onClick={copy} style={{ marginLeft: 'auto', cursor: 'pointer' }}>
            {copied ? 'Zkopírováno' : 'Kopírovat jako text'}
          </button>
        </div>
        {!canDistinguish && tree.length > 0 && (
          <div style={{ ...mono, ...muted, marginBottom: 8 }}>
            Původ komponent nejde zjistit (produkční build) – zobrazuji všechny.
          </div>
        )}
        {visible.length === 0 ? (
          <div style={{ ...mono, ...muted }}>Žádná komponenta k zobrazení.</div>
        ) : (
          visible.map((node, index) => (
            <NodeView key={`${node.name}-${index}`} node={node} showProps={showProps} />
          ))
        )}
      </div>
    </AddonPanel>
  )
})

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Component tree',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={active} />,
  })
})
