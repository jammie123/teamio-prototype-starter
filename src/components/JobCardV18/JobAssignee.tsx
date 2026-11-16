import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { getInitials } from './lib/format'

const OWNER_ROLE = 'Náborář'
const HIRING_MANAGER_ROLE = 'Hiring manager'

interface Person {
  name: string
  role: string
}

export interface JobAssigneeProps extends StyleProps {
  /** Náborář – shown first. */
  owner?: string
  hiringManagers?: string[]
  /** Adds the "Upravit zapojení" button to the hover card. */
  onInviteMore?: () => void
}

function buildPeople(owner?: string, hiringManagers: string[] = []): Person[] {
  return [
    ...(owner ? [{ name: owner, role: OWNER_ROLE }] : []),
    ...hiringManagers.map((name) => ({ name, role: HIRING_MANAGER_ROLE })),
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
        'border-1 border-solid border-primary-default',
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

/** Avatars of the owner and hiring managers; hovering opens the list with roles. */
export function JobAssignee({ owner, hiringManagers, onInviteMore, className }: JobAssigneeProps) {
  const people = buildPeople(owner, hiringManagers)

  if (people.length === 0) {
    return null
  }

  const managers = people.filter((person) => person.role !== OWNER_ROLE)
  const label = people.map((person) => `${person.name} (${person.role})`).join(', ')

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
        className="tm-inline-flex tm-h-8 tm-items-center tm-rounded-full"
      >
        <span
          className="tm-flex tm-items-center tm-gap-0.5 tm-font-medium"
          data-testid={managers.length ? 'job-card-hiring-managers' : undefined}
        >
          {people.map((person) => (
            <PersonAvatar
              key={`${person.role}-${person.name}`}
              name={person.name}
              testId={
                person.role === OWNER_ROLE
                  ? 'job-card-owner'
                  : `job-card-hiring-manager-${managers.indexOf(person)}`
              }
            />
          ))}
        </span>
      </DropdownToggle>
      <DropdownBody
        data-testid="job-card-people-dropdown"
        initialFocus={-1}
        className="tm-min-w-72"
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
