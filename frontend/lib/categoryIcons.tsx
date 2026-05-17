import type { LucideIcon } from 'lucide-react'
import {
  Bus,
  Droplets,
  Trash2,
  Lightbulb,
  Zap,
  Construction,
  Shield,
  Trees,
  MapPin,
} from 'lucide-react'

/** Stable icons by category name (avoids broken DB emoji encoding). */
const BY_NAME: Record<string, LucideIcon> = {
  transport: Bus,
  'transport & trafic': Bus,
  eau: Droplets,
  'eau & assainissement': Droplets,
  déchets: Trash2,
  dechets: Trash2,
  'collecte des déchets': Trash2,
  'collecte des dechets': Trash2,
  éclairage: Lightbulb,
  eclairage: Lightbulb,
  'éclairage public': Lightbulb,
  'eclairage public': Lightbulb,
  électricité: Zap,
  electricite: Zap,
  voirie: Construction,
  sécurité: Shield,
  securite: Shield,
  'espaces verts': Trees,
}

export function isBrokenEmojiIcon(icon?: string | null): boolean {
  if (!icon?.trim()) return true
  // Mojibake from UTF-8 read as Latin-1 (e.g. ðŸš— instead of 🚗)
  if (/[ðŸï¸Ã]/.test(icon)) return true
  // Surrogate pairs corrupted
  if (icon.includes('\uFFFD')) return true
  return false
}

export function getCategoryIconComponent(name: string): LucideIcon {
  const key = name.trim().toLowerCase()
  return BY_NAME[key] ?? MapPin
}

export function getCategoryDisplayIcon(name: string, dbIcon?: string | null): LucideIcon {
  if (!isBrokenEmojiIcon(dbIcon)) {
    // Prefer mapped Lucide for consistency; emoji in DB is optional fallback only
    const mapped = BY_NAME[name.trim().toLowerCase()]
    if (mapped) return mapped
  }
  return getCategoryIconComponent(name)
}
