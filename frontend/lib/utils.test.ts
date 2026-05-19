import { describe, expect, it } from 'vitest'
import { cn, getSeverityColor, getSeverityLabel, getStatusLabel } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1', false && 'hidden')).toBe('px-2 py-1')
  })
})

describe('getSeverityColor', () => {
  it('returns red for HIGH and CRITICAL', () => {
    expect(getSeverityColor('HIGH')).toBe('#ef4444')
    expect(getSeverityColor('CRITICAL')).toBe('#ef4444')
  })

  it('returns amber for MEDIUM and MED', () => {
    expect(getSeverityColor('MEDIUM')).toBe('#f59e0b')
    expect(getSeverityColor('MED')).toBe('#f59e0b')
  })

  it('returns green for LOW', () => {
    expect(getSeverityColor('LOW')).toBe('#22c55e')
  })

  it('returns default for unknown severity', () => {
    expect(getSeverityColor('UNKNOWN')).toBe('#7a8899')
  })
})

describe('getSeverityLabel', () => {
  it('returns French labels', () => {
    expect(getSeverityLabel('CRITICAL')).toBe('Critique')
    expect(getSeverityLabel('HIGH')).toBe('Élevé')
    expect(getSeverityLabel('MEDIUM')).toBe('Moyen')
    expect(getSeverityLabel('LOW')).toBe('Faible')
  })

  it('returns input for unknown severity', () => {
    expect(getSeverityLabel('CUSTOM')).toBe('CUSTOM')
  })
})

describe('getStatusLabel', () => {
  it('returns French labels', () => {
    expect(getStatusLabel('open')).toBe('Ouvert')
    expect(getStatusLabel('in_progress')).toBe('En cours')
    expect(getStatusLabel('resolved')).toBe('Résolu')
  })

  it('returns input for unknown status', () => {
    expect(getStatusLabel('pending')).toBe('pending')
  })
})
