import {
  Alert,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  Container,
  Divider,
  FormGroup,
  FormLabel,
  FormMessage,
  Icon,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
  Pill,
  Radio,
  Select,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  TextArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from './components'

function App() {
  return (
    <TooltipProvider delayDuration={0}>
      <main className="tm-min-h-screen tm-bg-cover-light tm-py-8">
        <Container isCentered maxWidth="48rem">
          <Typography as="h1" variant="h1">
            Teamio Prototype Starter
          </Typography>
          <Typography className="tm-text-secondary-default">
            Smoke gallery for starter components. Prefer Storybook for the full catalog.
          </Typography>

          <Divider className="tm-my-6" />

          <Card className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h3">
              Actions
            </Typography>
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="danger">Danger</Button>
              <Button isLoading>Loading</Button>
              <ButtonLink href="https://www.teamio.com/" target="_blank">
                Button link
              </ButtonLink>
            </div>

            <Typography>
              Inline{' '}
              <Link href="https://www.teamio.com/" target="_blank">
                primary link
              </Link>{' '}
              and{' '}
              <Link href="https://www.teamio.com/" variant="secondary">
                secondary link
              </Link>
              .
            </Typography>

            <div className="tm-flex tm-items-center tm-gap-2 tm-text-xl">
              <Icon name="plus" title="Plus" />
              <Icon name="check" title="Check" />
              <Icon name="unknown-icon" title="Fallback" />
            </div>
          </Card>

          <Divider className="tm-my-6" />

          <Card className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h3">
              Feedback
            </Typography>
            <Alert>Informativní zpráva</Alert>
            <Alert variant="success">Úspěch</Alert>
            <div className="tm-flex tm-items-center tm-gap-3 tm-text-2xl">
              <Spinner label="Načítání" />
              <Skeleton width={160} height={18} />
            </div>
          </Card>

          <Divider className="tm-my-6" />

          <Card className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h3">
              Forms
            </Typography>
            <FormGroup validationState="error" isRequired>
              <FormLabel>E-mail</FormLabel>
              <Input type="email" defaultValue="neplatny" />
              <FormMessage>Zadejte platný e-mail.</FormMessage>
            </FormGroup>
            <TextArea aria-label="Poznámka" placeholder="Poznámka" />
            <Select aria-label="Město" defaultValue="praha">
              <option value="praha">Praha</option>
              <option value="brno">Brno</option>
            </Select>
            <Checkbox defaultChecked>Souhlasím</Checkbox>
            <div className="tm-flex tm-gap-4">
              <Radio name="smoke-size" value="s" defaultChecked>
                S
              </Radio>
              <Radio name="smoke-size" value="m">
                M
              </Radio>
            </div>
          </Card>

          <Divider className="tm-my-6" />

          <Card className="tm-flex tm-flex-col tm-gap-4">
            <Typography as="h2" variant="h3">
              Data display
            </Typography>
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-3">
              <Tag color="informative">Nový</Tag>
              <Tag color="success" isSubtle>
                Aktivní
              </Tag>
              <Pill>3</Pill>
              <Pill color="secondary">12</Pill>
            </div>
            <Table aria-label="Uchazeči">
              <TableHead>
                <TableRow>
                  <TableHeader>Jméno</TableHeader>
                  <TableHeader>Stav</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Anna Nováková</TableCell>
                  <TableCell>Nový</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Tabs defaultValue="overview">
              <TabsList aria-label="Ukázkové záložky">
                <TabsTrigger value="overview">Přehled</TabsTrigger>
                <TabsTrigger value="details">Detaily</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Obsah přehledu</TabsContent>
              <TabsContent value="details">Obsah detailů</TabsContent>
            </Tabs>
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Více informací</TooltipContent>
              </Tooltip>
              <Modal>
                <ModalTrigger asChild>
                  <Button variant="secondary">Open Modal</Button>
                </ModalTrigger>
                <ModalContent>
                  <ModalTitle>Potvrzení</ModalTitle>
                  <ModalClose aria-label="Zavřít dialog" />
                  <ModalDescription>Opravdu chcete pokračovat?</ModalDescription>
                  <ModalBody>Ukázkový obsah modalu.</ModalBody>
                  <ModalFooter>
                    <Button>Confirm</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </div>
          </Card>
        </Container>
      </main>
    </TooltipProvider>
  )
}

export default App
