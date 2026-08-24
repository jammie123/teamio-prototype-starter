import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { getInitials } from './getInitials'

export interface JobCardPerson {
  name: string
  role: string
}

export interface JobCardPeopleProps extends StyleProps {
  people: JobCardPerson[]
}

function PersonAvatar({
  name,
  className,
  testId,
  size = 'md',
}: {
  name: string
  className?: string
  testId?: string
  size?: 'sm' | 'md'
}) {
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
        'tm-font-semibold',
        'border-1 border-solid border-primary-default',
        'tm-leading-none',
        'tm-text-primary-default',
        size === 'sm' ? 'tm-size-5 tm-text-[10px]' : 'tm-size-6 tm-text-xs',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}

export function JobCardPeople({ people, className }: JobCardPeopleProps) {
  if (people.length === 0) {
    return null
  }

  const hiringManagers = people.filter((person) => person.role !== 'Náborář')
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
        className="tm-rounded-full"
      >
        <span
          className="tm-flex tm-items-center tm-gap-0.5"
          data-testid={hiringManagers.length ? 'job-card-hiring-managers' : undefined}
        >
          {people.map((person) => (
            <PersonAvatar
              key={`${person.role}-${person.name}`}
              name={person.name}
              testId={
                person.role === 'Náborář'
                  ? 'job-card-owner'
                  : `job-card-hiring-manager-${hiringManagers.indexOf(person)}`
              }
            />
          ))}
        </span>
      </DropdownToggle>
      <DropdownBody data-testid="job-card-people-dropdown">
        <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">
          {people.map((person) => (
            <li
              key={`${person.role}-${person.name}`}
              data-testid={
                person.role === 'Náborář'
                  ? 'job-card-people-owner'
                  : 'job-card-people-hiring-manager'
              }
              className="tm-flex tm-items-center tm-gap-2"
            >
              <PersonAvatar name={person.name} size="md" />
              <span className="tm-min-w-0 tm-flex tm-flex-col">
                <span className="tm-text-sm tm-font-medium tm-text-primary-default">{person.name}</span>
                <span className="tm-text-13 tm-text-secondary-default">{person.role}</span>
              </span>
            </li>
          ))}
        </ul>
      </DropdownBody>
    </Dropdown>
  )
}

JobCardPeople.displayName = 'JobCardPeople'

export function buildJobCardPeople(owner?: string, hiringManagers: string[] = []): JobCardPerson[] {
  return [
    ...(owner ? [{ name: owner, role: 'Náborář' }] : []),
    ...hiringManagers.map((name) => ({ name, role: 'Hiring manager' })),
  ]
}
