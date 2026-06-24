import type { ActivityCategory, ActivityStatus } from '#shared/constants/vacation'

export const da = {
  appTitle: 'Anjas 50 års fejrings ferie',
  appDescription: 'Planlæg Anjas 50 års fejringsferie i Toscana, 27. juni – 4. juli 2026. Stem på aktiviteter og læg dem på tavlen.',
  vacationDates: '27. juni – 4. juli 2026',
  homeBase: 'Hjemmebase',

  navBoard: 'Tavle',
  navRanking: 'Rangering',
  navItinerary: 'Rejseplan',

  whoAreYou: 'Hvem er du?',
  whoAreYouDesc: 'Vælg dit navn, så vi ved hvem der stemmer.',
  selectIdentity: 'Vælg person',

  vacationPlanner: 'Tavlen',
  vacationPlannerDesc: 'Træk aktiviteter på dagene. Klik for detaljer — og stem direkte her.',
  board: 'Tavle',
  calendar: 'Kalender',
  searchPlaceholder: 'Søg aktiviteter...',
  allCategories: 'Alle kategorier',
  category: 'Kategori',
  sortDriveTime: 'Køretid',
  sortVotes: 'Stemmer',
  sortCategory: 'Kategori',
  sortTitle: 'Titel',
  compare: 'Sammenlign',
  newActivity: 'Ny aktivitet',
  fullDay: 'Hele dagen',

  unscheduled: 'Ikke planlagt',
  unscheduledSubtitle: 'Idéer og backlog',
  dropHere: 'Slip aktiviteter her',
  noPlans: 'Ingen planer — træk aktiviteter hertil',
  noActivities: 'Ingen aktiviteter endnu',
  noActivitiesDesc: 'Databasen skal måske seedes. Kør npm run db:seed, eller tilføj en aktivitet selv.',
  loadError: 'Kunne ikke hente aktiviteter',

  rankings: 'Rangeringer',
  mostPopular: 'Mest populære',
  leastPopular: 'Mindst populære',
  shortestDrives: 'Korteste køretur',
  longestDrives: 'Længste køretur',

  itinerary: 'Rejseplan',
  itineraryDesc: 'Dag-for-dag oversigt over aktiviteter markeret som planlagt, booket eller afsluttet.',
  noItinerary: 'Ingen planlagte aktiviteter endnu. Læg nogle på tavlen!',
  goToBoard: 'Gå til tavlen',
  plannedUnscheduled: 'Planlagt men ikke lagt på en dag',
  activityCount: (n: number) => (n === 1 ? '1 aktivitet' : `${n} aktiviteter`),

  driveTime: 'Køretid',
  duration: 'Varighed',
  distance: 'Afstand',
  address: 'Adresse',
  minutes: 'minutter',
  hours: 'timer',
  openMaps: 'Åbn i Google Maps',
  notes: 'Noter',
  learnMore: 'Læs mere',
  votes: 'Stemmer',
  voteUp: 'For',
  voteDown: 'Imod',
  upvotedBy: 'Stemte for:',
  downvotedBy: 'Stemte imod:',

  edit: 'Rediger',
  addImages: 'Vælg billeder',
  imagesSection: 'Billeder',
  imagesDesc: 'Det første billede bruges på kortet i oversigten.',
  noImagesYet: 'Ingen billeder endnu',
  imageSizeHint: 'Max 4,5 MB per billede',
  coverImage: 'Forside',
  uploadImage: 'Upload billede',
  delete: 'Slet',
  deleteConfirm: 'Slet denne aktivitet?',
  imageTooLarge: 'Billedet må max være 4,5 MB',
  cancel: 'Annuller',
  backToBoard: 'Tilbage til tavlen',
  save: 'Gem',
  create: 'Opret',

  compareTitle: 'Sammenlign aktiviteter',
  compareSelect: 'Vælg 2–3 aktiviteter at sammenligne',
  compareStart: 'Sammenlign',
  compareBack: 'Tilbage',

  calendarAssign: 'Tildel aktivitet til dag',
  calendarSelectActivity: 'Vælg en aktivitet',
  calendarActivitySelected: 'Aktivitet valgt',
  calendarActivitySelectedDesc: 'Klik på en feriedag for at tilføje den, eller Shift+klik på en anden aktivitet.',
  calendarVacationDays: 'Feriedage',
  calendarShiftHint: 'Shift+klik for at vælge · Klik på dag for at tilføje',

  editActivity: 'Rediger aktivitet',
  newActivityTitle: 'Ny aktivitet',
  newActivityDesc: 'Giv den et navn, vælg type — og læg den på en dag hvis du allerede ved hvornår.',
  editActivityDesc: 'Opdater detaljer for aktiviteten.',
  titlePlaceholder: 'fx. Vinsmagning på Brolio',
  titleLabel: 'Titel',
  scheduledDate: 'Hvilken dag?',
  pickCategory: 'Hvad er det?',
  travelSection: 'Kørsel & tid (valgfrit)',
  detailsSection: 'Beskrivelse (valgfrit)',
  descriptionLabel: 'Beskrivelse',
  notesPlaceholder: 'Praktiske noter, bookinginfo, osv.',
  descriptionPlaceholder: 'Hvad kan man opleve? Hvorfor er det fedt?',
  driveMin: 'Kørsel (min)',
  distanceKm: 'Afstand (km)',
  durationH: 'Varighed (t)',
  latitude: 'Breddegrad',
  longitude: 'Længdegrad',
  links: 'Links',
  linkTitle: 'Titel',
  linkUrl: 'URL',
  compareSelected: 'Sammenlign valgte',
  changeSelection: 'Skift valg',
  activityNotFound: 'Aktivitet ikke fundet',

  weekDays: ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'] as const
} as const

const categoryLabels: Record<ActivityCategory, string> = {
  Wine: 'Vin',
  Food: 'Mad',
  Sightseeing: 'Sightseeing',
  Nature: 'Natur',
  Swimming: 'Badning',
  Historic: 'Historie',
  Event: 'Event',
  Relaxation: 'Afslapning',
  Other: 'Andet'
}

const statusLabels: Record<ActivityStatus, string> = {
  Idea: 'Idé',
  Planned: 'Planlagt',
  Booked: 'Booket',
  Completed: 'Afsluttet'
}

export function categoryLabel(category: ActivityCategory | string): string {
  return categoryLabels[category as ActivityCategory] ?? category
}

export function statusLabel(status: ActivityStatus | string): string {
  return statusLabels[status as ActivityStatus] ?? status
}
