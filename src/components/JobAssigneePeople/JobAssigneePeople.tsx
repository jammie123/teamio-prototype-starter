import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { getInitials } from '../JobCardSynteza/getInitials'

const OWNER_ROLE = 'Náborář'
const HIRING_MANAGER_ROLE = 'Hiring manager'

/** Od tohoto počtu lidí (včetně) se avatary přepadnou do „+N“. */
const OVERFLOW_THRESHOLD = 4
/** Počet avatarů zobrazených přímo, pokud je přepad aktivní. */
const VISIBLE_AVATAR_COUNT = 3

interface Person {
  name: string
  role: string
}

export interface JobAssigneePeopleProps extends StyleProps {
  /** Náborář – zobrazen jako první. */
  owner?: string
  hiringManagers?: string[]
  /** Přidá tlačítko „Upravit zapojení“ do hover karty. */
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

function OverflowBadge({ count }: { count: number }) {
  return (
    <span
      data-testid="job-card-people-overflow"
      aria-hidden
      className={cn(
        'tm-inline-flex',
        'tm-h-6',
        'tm-shrink-0',
        'tm-items-center',
        'tm-justify-center',
        'tm-rounded-full',
        'tm-px-1',
        'tm-bg-cover-default',
        'tm-font-normal',
        'border-1 border-solid border-primary-default',
        'tm-leading-none',
        'tm-text-xs',
        'tm-text-primary-default',
      )}
    >
      +{count}
    </span>
  )
}

/**
 * Vlastník a zapojení lidé do náboru. Do 4 lidí se zobrazí všechny avatary;
 * nad 4 se zobrazí 3 avatary a zbytek jako „+N“. Hover otevře seznam všech lidí s rolemi.
 */
export function JobAssigneePeople({
  owner,
  hiringManagers = [],
  onInviteMore,
  className,
}: JobAssigneePeopleProps) {
  const people = buildPeople(owner, hiringManagers)

  if (people.length === 0) {
    return null
  }

  const managers = people.filter((person) => person.role !== OWNER_ROLE)
  const hasOverflow = people.length > OVERFLOW_THRESHOLD
  const visiblePeople = hasOverflow ? people.slice(0, VISIBLE_AVATAR_COUNT) : people
  const hiddenCount = people.length - visiblePeople.length
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
          {visiblePeople.map((person) => (
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
          {hiddenCount > 0 ? <OverflowBadge count={hiddenCount} /> : null}
        </span>
      </DropdownToggle>
      <DropdownBody data-testid="job-card-people-dropdown" initialFocus={-1} className="tm-min-w-72">
        <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">
          {people.map((person) => (
            <li
              key={`${person.role}-${person.name}`}
              data-testid={
                person.role === OWNER_ROLE ? 'job-card-people-owner' : 'job-card-people-hiring-manager'
              }
              className="tm-flex tm-items-center tm-gap-2"
            >
              <PersonAvatar name={person.name} />
              <span className="tm-flex tm-min-w-0 tm-flex-col">
                <span className="tm-text-sm tm-font-medium tm-text-primary-default">{person.name}</span>
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

JobAssigneePeople.displayName = 'JobAssigneePeople'
