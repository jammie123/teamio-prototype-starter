/* eslint-disable react-refresh/only-export-components -- Storybook entry, no fast refresh */
import { useEffect, type ReactNode } from 'react'
import type { Decorator } from '@storybook/react-vite'
import { addons } from 'storybook/preview-api'
import { EVENTS } from './constants'
import { extractTree } from './extractTree'

const ROOT_ID = 'storybook-root'
const DEBOUNCE_MS = 80

function sendTree() {
  // V docs módu root neexistuje – panel je jen pro jednotlivé stories.
  const root = document.getElementById(ROOT_ID)
  if (!root) return

  // Kanál ořezává hluboce zanořené objekty (telejson), proto strom posíláme jako JSON string.
  addons.getChannel().emit(EVENTS.TREE_UPDATE, JSON.stringify(extractTree(root)))
}

function ComponentTreeReporter({ children }: { children: ReactNode }) {
  // Bez závislostí: po každém renderu story (např. změna args) pošleme aktuální strom.
  useEffect(() => {
    sendTree()
  })

  useEffect(() => {
    const channel = addons.getChannel()
    let timer: ReturnType<typeof setTimeout> | undefined

    const scheduleSend = () => {
      clearTimeout(timer)
      timer = setTimeout(sendTree, DEBOUNCE_MS)
    }

    // Komponenty se objevují i později (lazy, portály, po interakci) – sledujeme DOM včetně body.
    const observer = new MutationObserver(scheduleSend)
    observer.observe(document.body, { childList: true, subtree: true })
    channel.on(EVENTS.TREE_REQUEST, sendTree)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      channel.off(EVENTS.TREE_REQUEST, sendTree)
    }
  }, [])

  return <>{children}</>
}

export const decorators: Decorator[] = [
  (Story) => (
    <ComponentTreeReporter>
      <Story />
    </ComponentTreeReporter>
  ),
]
