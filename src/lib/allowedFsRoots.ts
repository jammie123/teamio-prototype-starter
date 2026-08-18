import { realpathSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Vite serves files only from its root. In a git worktree `node_modules` is a symlink
 * to the main checkout, so assets resolved from it (Poppins woff2 files) would be 403.
 */
export function allowedFsRoots(projectRoot: string = process.cwd()): string[] {
  const roots = [projectRoot]
  const nodeModules = join(projectRoot, 'node_modules')

  try {
    const realNodeModules = realpathSync(nodeModules)

    if (realNodeModules !== nodeModules) {
      roots.push(realNodeModules)
    }
  } catch {
    // node_modules may not exist yet (fresh clone before install).
  }

  return roots
}
