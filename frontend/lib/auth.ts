/** Decode JWT payload (client-side only; server enforces roles). */
export function getTokenPayload(): Record<string, unknown> | null {
  if (typeof globalThis === 'undefined' || !globalThis.localStorage) return null
  const token = globalThis.localStorage.getItem('urbanops_token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])) as Record<string, unknown>
  } catch {
    return null
  }
}

export function normalizeRole(role: unknown): string {
  if (typeof role !== 'string' || !role) return ''
  return role.replace(/^ROLE_/, '').toUpperCase()
}

export function getStoredUser(): { role?: string; firstName?: string; email?: string } | null {
  if (typeof globalThis === 'undefined' || !globalThis.localStorage) return null
  const raw = globalThis.localStorage.getItem('urbanops_user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as { role?: string; firstName?: string; email?: string }
  } catch {
    return null
  }
}

/** Role from stored user profile or JWT (same logic as Navbar). */
export function getCurrentRole(): string {
  const payload = getTokenPayload()
  const stored = getStoredUser()
  const raw = stored?.role ?? payload?.role ?? 'CITIZEN'
  return normalizeRole(raw) || 'CITIZEN'
}

export function canAccessAdminDashboard(): boolean {
  const role = getCurrentRole()
  return role === 'ADMIN' || role === 'MANAGER'
}

export function isAdminUser(): boolean {
  return getCurrentRole() === 'ADMIN'
}

/** Home dashboard route after login (admin vs citizen). */
export function getDashboardPath(): string {
  return canAccessAdminDashboard() ? '/dashboard' : '/mes-signalements'
}

/** @deprecated Use canAccessAdminDashboard() or getCurrentRole() */
export function isAdminFromToken(): boolean {
  return canAccessAdminDashboard()
}
