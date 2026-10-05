import { google } from 'googleapis'

function normalizeEvent(event, calendar) {
  const calendarId = calendar.id
  const isBirthday = event.eventType === 'birthday'
    || calendarId.includes('contacts@group.v.calendar.google.com')

  return {
    id: event.id,
    calendarId,
    title: event.summary || 'Sin título',
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    allDay: Boolean(event.start?.date && !event.start?.dateTime),
    canEdit: calendar.accessRole === 'owner' || calendar.accessRole === 'writer',
    tag: isBirthday ? 'Cumpleaños' : calendar.summary || 'Google Calendar',
    icon: isBirthday ? 'fa-cake-candles' : 'fa-calendar',
    eventType: event.eventType || 'default',
  }
}

async function getCalendars(calendarApi) {
  const calendars = []
  let pageToken

  do {
    const response = await calendarApi.calendarList.list({ maxResults: 250, pageToken })
    calendars.push(...(response.data.items || []))
    pageToken = response.data.nextPageToken
  } while (pageToken)

  return calendars.filter((calendar) => calendar.id)
}

export async function listEvents(auth) {
  const calendarApi = google.calendar({ version: 'v3', auth })
  const calendars = await getCalendars(calendarApi)
  const timeMin = new Date().toISOString()

  const results = await Promise.all(calendars.map(async (calendar) => {
    const events = []
    let pageToken

    try {
      do {
        const response = await calendarApi.events.list({
          calendarId: calendar.id,
          maxResults: 2500,
          orderBy: 'startTime',
          pageToken,
          singleEvents: true,
          timeMin,
        })
        events.push(...(response.data.items || []))
        pageToken = response.data.nextPageToken
      } while (pageToken)
    } catch (error) {
      if (error.code !== 403 && error.code !== 404) throw error
    }

    return events
      .filter((event) => event.start?.dateTime || event.start?.date)
      .map((event) => normalizeEvent(event, calendar))
  }))

  return results.flat().sort((first, second) => Date.parse(first.start) - Date.parse(second.start))
}

export async function createEvent(auth, input) {
  const title = String(input.title || '').trim()
  const startDate = new Date(input.start)
  const endDate = input.end ? new Date(input.end) : new Date(startDate.getTime() + 60 * 60 * 1000)

  if (!title || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
    const error = new Error('Indica un título y un intervalo de fecha válido.')
    error.status = 400
    throw error
  }

  const calendarApi = google.calendar({ version: 'v3', auth })
  const primaryResponse = await calendarApi.calendars.get({ calendarId: 'primary' })
  const createdResponse = await calendarApi.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: title,
      description: input.description || undefined,
      start: { dateTime: startDate.toISOString(), timeZone: input.timeZone || 'UTC' },
      end: { dateTime: endDate.toISOString(), timeZone: input.timeZone || 'UTC' },
    },
  })

  return normalizeEvent(createdResponse.data, {
    id: 'primary',
    summary: primaryResponse.data.summary || 'Google Calendar',
  })
}

export async function deleteEvent(auth, calendarId, eventId) {
  if (!calendarId || !eventId) {
    const error = new Error('Falta el calendario o el evento que se va a eliminar.')
    error.status = 400
    throw error
  }

  const calendarApi = google.calendar({ version: 'v3', auth })
  await calendarApi.events.delete({ calendarId, eventId })
}