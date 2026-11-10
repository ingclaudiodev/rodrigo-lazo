import { ContentService } from './ContentService'
import { ContactService } from './ContactService'

export { ContentService, ContactService }
export type { ContactPayload, ContactErrors, ContactResult } from './ContactService'

/** Instancias compartidas por toda la app. */
export const contentService = new ContentService()

const mailChannel = contentService
  .getContact()
  .channels.find((channel) => channel.href.startsWith('mailto:'))

export const contactService = new ContactService(
  mailChannel && !mailChannel.pending ? mailChannel.href.replace(/^mailto:/, '') : '',
)
