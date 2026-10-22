import {
  formatDisabledChannelsSuffix,
  isUnlimitedPublication,
  partitionPublicationChannels,
  shareSameEndDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import type { JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify11PanelSubline,
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify11PanelMode,
  resolveSimplify11ChannelVisualState,
  type JobCardSimplify11PanelMode,
  type Simplify11ChannelVisualState,
} from '../JobCardSimplify11/jobCardSimplify11Presentation'

export type JobCardSimplify14PanelMode = JobCardSimplify11PanelMode

export {
  buildSimplify11PanelSubline,
  formatMixedPeriodsHeading,
  getSimplify11PanelCta,
  resolveJobCardSimplify11PanelMode as resolveJobCardSimplify14PanelMode,
  resolveSimplify11ChannelVisualState,
}

export type Simplify14ChannelDateLabelTone = 'default' | 'muted' | 'warning' | 'danger'

function finiteActivePublications(active: JobPublication[]) {
  return active.filter(
    (publication) => publication.endDate && !isUnlimitedPublication(publication.channel),
  )
}

export function shouldShowPerChannelDateLabels(
  mode: JobCardSimplify11PanelMode,
  publications: JobPublication[],
  now = new Date(),
): boolean {
  if (mode === 'partial' || mode === 'mixedPeriods') {
    return true
  }

  if (mode === 'running' || mode === 'endingSoon') {
    const { active } = partitionPublicationChannels(publications, now)
    const finiteActive = finiteActivePublications(active)
    if (finiteActive.length === 0) {
      return false
    }

    return !shareSameEndDate(finiteActive)
  }

  return false
}

export function formatSimplify14ChannelDateLabel(
  publication: JobPublication,
  now = new Date(),
): string {
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  if (visual === 'disabled') {
    return 'vypnuto'
  }

  if (isUnlimitedPublication(publication.channel) && visual !== 'expired') {
    return 'bez limitu'
  }

  if (publication.endDate) {
    return stripYear(publication.endDate)
  }

  return '–'
}

export function resolveSimplify14ChannelDateLabelTone(
  publication: JobPublication,
  now = new Date(),
): Simplify14ChannelDateLabelTone {
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  if (visual === 'disabled') {
    return 'muted'
  }

  if (isUnlimitedPublication(publication.channel) && visual !== 'expired') {
    return 'muted'
  }

  if (visual === 'expired') {
    return 'danger'
  }

  if (visual === 'endingSoon') {
    return 'warning'
  }

  return 'default'
}

export function simplify14ChannelDateLabelClassName(
  tone: Simplify14ChannelDateLabelTone,
): string {
  switch (tone) {
    case 'danger':
      return 'tm-text-emotion-danger-emphasis'
    case 'warning':
      return 'tm-text-emotion-warning-emphasis'
    case 'muted':
      return 'tm-text-secondary-default'
    default:
      return 'tm-text-secondary-default'
  }
}

export type { Simplify11ChannelVisualState as Simplify14ChannelVisualState }

/** Simplify 14 — no date/perex under heading; optional disabled-channel hint only. */
export function buildSimplify14PanelSubline(
  advertisement: JobAdvertisement,
  mode: JobCardSimplify11PanelMode,
  now = new Date(),
) {
  const publications = advertisement.publications ?? []
  const { disabled } = partitionPublicationChannels(publications, now)
  const disabledSuffix = formatDisabledChannelsSuffix(disabled.length)

  if (mode === 'allDisabled' || mode === 'partial') {
    return undefined
  }

  if (mode === 'running' || mode === 'ended' || mode === 'mixedPeriods' || mode === 'endingSoon') {
    return disabledSuffix
  }

  return undefined
}
