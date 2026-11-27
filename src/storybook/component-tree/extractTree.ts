import type { TreeNode } from './constants'

/**
 * Minimální popis React fiberu – interní struktura Reactu, proto jen to, co opravdu čteme.
 * Funguje s vývojovým buildem Reactu (Storybook dev, Vitest).
 */
interface Fiber {
  tag: number
  type: unknown
  child: Fiber | null
  sibling: Fiber | null
  return: Fiber | null
  memoizedProps: Record<string, unknown> | null
  /** U HostRoot fiberu je to FiberRoot, jehož `current` je aktuální (committed) strom. */
  stateNode?: { current?: Fiber } | null
}

const FUNCTION_COMPONENT = 0
const CLASS_COMPONENT = 1
const FORWARD_REF = 11
const SIMPLE_MEMO_COMPONENT = 15

const COMPONENT_TAGS = new Set([
  FUNCTION_COMPONENT,
  CLASS_COMPONENT,
  FORWARD_REF,
  SIMPLE_MEMO_COMPONENT,
])

/** Pomocné wrappery addonu – do stromu nepatří. */
const IGNORED_NAMES = new Set(['ComponentTreeReporter'])

const MAX_PROPS = 6
const MAX_STRING = 32

type AnyRecord = Record<string, unknown>

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null
}

/** Funkce, jejíž zdroj nese informaci o souboru (`fileName` z jsxDEV transformace). */
function getRenderFunction(type: unknown): ((...args: never[]) => unknown) | null {
  if (typeof type === 'function') return type as (...args: never[]) => unknown

  if (isRecord(type)) {
    // forwardRef -> render, memo -> type
    const inner = type.render ?? type.type
    return getRenderFunction(inner)
  }

  return null
}

function getName(type: unknown): string {
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string }
    return fn.displayName || fn.name || ''
  }

  if (isRecord(type)) {
    if (typeof type.displayName === 'string' && type.displayName) return type.displayName
    return getName(type.render) || getName(type.type)
  }

  return ''
}

const fileCache = new WeakMap<object, string | null>()

/**
 * Soubor, ve kterém je komponenta definovaná. Vývojový JSX transform vkládá do těla
 * komponenty `fileName: "/abs/path/File.tsx"` (jsxDEV source), takže stačí přečíst zdroj funkce.
 */
function getDefinitionFile(type: unknown): string | null {
  const fn = getRenderFunction(type)
  if (!fn) return null

  const cached = fileCache.get(fn)
  if (cached !== undefined) return cached

  let file: string | null = null
  try {
    const match = /fileName:\s*["']([^"']+)["']/.exec(Function.prototype.toString.call(fn))
    file = match?.[1] ?? null
  } catch {
    file = null
  }

  fileCache.set(fn, file)
  return file
}

function isProjectFile(file: string | null): file is string {
  return file !== null && !file.includes('node_modules') && !file.includes('/.vite/')
}

function shortenFile(file: string): string {
  const srcIndex = file.lastIndexOf('/src/')
  return srcIndex >= 0 ? file.slice(srcIndex + '/src/'.length) : file
}

function formatValue(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') {
    const text = value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value
    return JSON.stringify(text)
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return 'ƒ'
  if (Array.isArray(value)) return `[${value.length}]`
  if (isRecord(value)) {
    if ('$$typeof' in value) return '<…/>'
    if (value instanceof Date) return 'Date'
    return '{…}'
  }
  return null
}

function summarizeProps(props: Record<string, unknown> | null): string[] {
  if (!props) return []

  const out: string[] = []
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children' || key === 'className' || key === 'ref') continue
    const formatted = formatValue(value)
    if (formatted === null) continue
    out.push(`${key}=${formatted}`)
  }

  if (out.length <= MAX_PROPS) return out
  return [...out.slice(0, MAX_PROPS), `+${out.length - MAX_PROPS}`]
}

function describe(fiber: Fiber): Omit<TreeNode, 'children'> | null {
  if (!COMPONENT_TAGS.has(fiber.tag)) return null

  const name = getName(fiber.type)
  if (!name || IGNORED_NAMES.has(name)) return null

  const file = getDefinitionFile(fiber.type)
  const project = isProjectFile(file)

  return {
    name,
    ...(project ? { file: shortenFile(file) } : {}),
    project,
    props: summarizeProps(fiber.memoizedProps),
  }
}

function walk(first: Fiber | null): TreeNode[] {
  const out: TreeNode[] = []

  for (let fiber = first; fiber; fiber = fiber.sibling) {
    const children = walk(fiber.child)
    const info = describe(fiber)

    if (info) {
      out.push({ ...info, children })
    } else {
      // Host elementy (div, span…), Fragmenty, Context... přeskočíme a děti povýšíme.
      out.push(...children)
    }
  }

  return out
}

/** Kontejner si pamatuje HostRoot z doby vytvoření; po commitu je aktuální jeho `alternate`. */
function liveRoot(hostRoot: Fiber): Fiber {
  return hostRoot.stateNode?.current ?? hostRoot
}

function findRootFiber(container: Element): Fiber | null {
  const record = container as unknown as AnyRecord

  // Klíče jsou neenumerovatelné, proto getOwnPropertyNames.
  const containerKey = Object.getOwnPropertyNames(record).find((key) =>
    key.startsWith('__reactContainer$'),
  )
  if (containerKey) {
    // Po `root.unmount()` (např. přechod ze story na docs) React hodnotu nastaví na null,
    // ale klíč na elementu nechá – takový kontejner už žádný strom nemá.
    const hostRoot = record[containerKey] as Fiber | null | undefined
    return hostRoot ? liveRoot(hostRoot) : null
  }

  // Záloha: fiber libovolného potomka a vyšplhat nahoru ke kořeni.
  for (const element of container.querySelectorAll('*')) {
    const fiberKey = Object.getOwnPropertyNames(element).find((key) =>
      key.startsWith('__reactFiber$'),
    )
    if (!fiberKey) continue

    // Odmountované elementy mají fiber vynulovaný.
    let fiber = (element as unknown as AnyRecord)[fiberKey] as Fiber | null | undefined
    if (!fiber) continue

    while (fiber.return) fiber = fiber.return
    return liveRoot(fiber)
  }

  return null
}

/** Vytáhne ze zadaného React kontejneru strom komponent (jen komponenty, bez DOM elementů). */
export function extractTree(container: Element): TreeNode[] {
  const root = findRootFiber(container)
  return root ? walk(root.child) : []
}

/** Strom bez knihovních komponent – jejich děti se povýší na úroveň rodiče. */
export function filterTree(nodes: TreeNode[], showLibrary: boolean): TreeNode[] {
  const out: TreeNode[] = []

  for (const node of nodes) {
    const children = filterTree(node.children, showLibrary)

    if (node.project || showLibrary) {
      out.push({ ...node, children })
    } else {
      out.push(...children)
    }
  }

  return out
}

/** Textová podoba stromu (pro kopírování do schránky / chatu). */
export function treeToText(nodes: TreeNode[], showProps = false, depth = 0): string {
  return nodes
    .map((node) => {
      const props = showProps && node.props.length > 0 ? ` ${node.props.join(' ')}` : ''
      const line = `${'  '.repeat(depth)}<${node.name}${props}>`
      const rest = treeToText(node.children, showProps, depth + 1)
      return rest ? `${line}\n${rest}` : line
    })
    .join('\n')
}
