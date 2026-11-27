import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { JOB_CARD_HEADER_CAPSULE_CLASS } from './layout'
import { getInitials } from './lib/format'

const OWNER_ROLE = 'Náborář'
const HIRING_MANAGER_ROLE = 'Hiring manager'
/** Visible initials on the pill; extra people collapse into “+N”. */
const VISIBLE_AVATAR_COUNT = 2

interface Person {
  name: string
  role: string
}

/** A colleague involved in the job next to the owner; the role defaults to Hiring manager. */
export interface JobAssigneePerson {
  name: string
  /** Label in the hover card, e.g. `HR`. Defaults to `Hiring manager`. */
  role?: string
}

export interface JobAssigneeProps extends StyleProps {
  /** Náborář – shown first. */
  owner?: string
  /** Hiring managers (role `Hiring manager`), shown after the owner. */
  hiringManagers?: string[]
  /** Other people involved, e.g. HR colleagues; shown after the hiring managers. */
  colleagues?: JobAssigneePerson[]
  /** Adds the "Upravit zapojení" button to the hover card. */
  onInviteMore?: () => void
}

function buildPeople(
  owner?: string,
  hiringManagers: string[] = [],
  colleagues: JobAssigneePerson[] = [],
): Person[] {
  return [
    ...(owner ? [{ name: owner, role: OWNER_ROLE }] : []),
    ...hiringManagers.map((name) => ({ name, role: HIRING_MANAGER_ROLE })),
    ...colleagues.map(({ name, role }) => ({ name, role: role?.trim() || HIRING_MANAGER_ROLE })),
  ]
}

function PersonAvatar({ name, testId }: { name: string; testId?: string }) {
  return (
    <span
      data-testid={testId}
      aria-hidden
      className={cn(
        'tm-inline-flex',
        'tm-shrink-0',
        'tm-items-center',
        'tm-justify-center',
        'tm-rounded-full',
        'tm-p-0.5',
        'tm-bg-cover-default',
        'tm-font-normal',
        'tm-leading-none',
        'tm-size-6',
        'tm-text-xs',
        'tm-text-primary-default',
      )}
    >
      {getInitials(name)}
    </span>
  )
}

function CapsuleInitials({ name, testId }: { name: string; testId?: string }) {
  return (
    <span
      data-testid={testId}
      aria-hidden
      className="tm-text-sm tm-font-normal tm-leading-none tm-text-primary-default"
    >
      {getInitials(name)}
    </span>
  )
}

function CapsuleDivider() {
  return (
    <span
      role="separator"
      aria-hidden
      data-testid="job-card-people-divider"
      className="tm-mx-1.5 tm-h-3 tm-self-center tm-border-0 tm-border-l tm-border-solid tm-border-secondary"
    />
  )
}

function OverflowBadge({ count }: { count: number }) {
  return (
    <span
      data-testid="job-card-people-overflow"
      aria-hidden
      className="tm-text-sm tm-font-normal tm-leading-none tm-text-primary-default"
    >
      +{count}
    </span>
  )
}

/** Avatars of the owner and hiring managers; hovering opens the list with roles. */
export function JobAssignee({
  owner,
  hiringManagers,
  colleagues,
  onInviteMore,
  className,
}: JobAssigneeProps) {
  const people = buildPeople(owner, hiringManagers, colleagues)

  if (people.length === 0) {
    return null
  }

  const managers = people.filter((person) => person.role !== OWNER_ROLE)
  const visiblePeople = people.slice(0, VISIBLE_AVATAR_COUNT)
  const hiddenCount = people.length - visiblePeople.length
  const label = people.map((person) => `${person.name} (${person.role})`).join(', ')
  const capsuleItems = [
    ...visiblePeople.map((person) => ({ kind: 'person' as const, person })),
    ...(hiddenCount > 0 ? [{ kind: 'overflow' as const, count: hiddenCount }] : []),
  ]

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      placement="bottom-start"
      className={cn('tm-inline-flex', className)}
    >
      <DropdownToggle
        variant="custom"
        aria-label={label}
        data-testid="job-card-people"
        className={cn(JOB_CARD_HEADER_CAPSULE_CLASS, 'focus-visible:tm-rounded-full')}
      >
        <span
          className="tm-flex tm-items-center"
          data-testid={managers.length ? 'job-card-hiring-managers' : undefined}
        >
          {capsuleItems.map((item, index) => (
            <Fragment
              key={
                item.kind === 'person' ? `${item.person.role}-${item.person.name}` : 'overflow'
              }
            >
              {index > 0 ? <CapsuleDivider /> : null}
              {item.kind === 'person' ? (
                <CapsuleInitials
                  name={item.person.name}
                  testId={
                    item.person.role === OWNER_ROLE
                      ? 'job-card-owner'
                      : `job-card-hiring-manager-${managers.indexOf(item.person)}`
                  }
                />
              ) : (
                <OverflowBadge count={item.count} />
              )}
            </Fragment>
          ))}
        </span>
      </DropdownToggle>
      <DropdownBody
        data-testid="job-card-people-dropdown"
        initialFocus={-1}
        className="tm-min-w-popover"
      >
        <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">
          {people.map((person) => (
            <li
              key={`${person.role}-${person.name}`}
              data-testid={
                person.role === OWNER_ROLE
                  ? 'job-card-people-owner'
                  : 'job-card-people-hiring-manager'
              }
              className="tm-flex tm-items-center tm-gap-2"
            >
              <PersonAvatar name={person.name} />
              <span className="tm-flex tm-min-w-0 tm-flex-col">
                <span className="tm-text-sm tm-font-medium tm-text-primary-default">
                  {person.name}
                </span>
                <span className="tm-text-13 tm-text-secondary-default">{person.role}</span>
              </span>
            </li>
          ))}
        </ul>
        {onInviteMore ? (
          <Button
            variant="secondary"
            isBlock
            data-testid="job-card-people-invite"
            className="tm-mt-3"
            tabIndex={-1}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onInviteMore()
            }}
          >
            Upravit zapojení
          </Button>
        ) : null}
      </DropdownBody>
    </Dropdown>
  )
}

JobAssignee.displayName = 'JobAssignee'
