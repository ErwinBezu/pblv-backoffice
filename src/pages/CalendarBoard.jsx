import * as React from 'react'
import { Title, useDataProvider, useNotify } from 'react-admin'
import {
  Box, Card, CardContent, Typography, LinearProgress,
  Stack, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'

import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import frLocale from '@fullcalendar/core/locales/fr'
import { createRoot } from 'react-dom/client'

export default function CalendarBoard() {
  const dp = useDataProvider()
  const notify = useNotify()

  const calRef = React.useRef(null)
  const cal = React.useRef(null)

  const [loading, setLoading] = React.useState(true)
  const [events, setEvents] = React.useState([])
  const [communities, setCommunities] = React.useState([])
  const [filterCommunity, setFilterCommunity] = React.useState('all')

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)

      const { data: evs } = await dp.getList('calendars', {
        pagination: { page: 1, perPage: 1000 },
      })

      const { data: comms } = await dp.getList('communities', {
        pagination: { page: 1, perPage: 1000 },
      })
      setCommunities(comms)

      const commMap = new Map(comms.map(c => [String(c.id), c.name]))

      const mapped = (evs || []).map(e => {
        const cid = e.communityId ?? e.community?.id ?? e.community ?? null
        const cname = e.communityName || e.community?.name || (cid != null ? commMap.get(String(cid)) : '')
        return {
          id: String(e.id),
          title: e.description || 'Événement',
          start: e.dateEvent, // ISO (UTC) déjà envoyé côté create/edit
          extendedProps: { communityId: cid, communityName: cname }
        }
      })

      setEvents(mapped)
    } catch (e) {
      notify(e?.message || 'Erreur de chargement du calendrier', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [dp, notify])

  React.useEffect(() => { loadData() }, [loadData])

  React.useEffect(() => {
    if (!calRef.current) return

    if (cal.current) { cal.current.destroy(); cal.current = null }

    const colorMap = new Map()
    const palette = ['#1976d2','#2e7d32','#ed6c02','#9c27b0','#d32f2f','#00796b','#5d4037','#455a64']
    communities.forEach((c, i) => colorMap.set(String(c.id), palette[i % palette.length]))

    const filtered = filterCommunity === 'all'
      ? events
      : events.filter(e => String(e.extendedProps.communityId) === String(filterCommunity))

    const el = calRef.current
    cal.current = new Calendar(el, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      locales: [frLocale],
      locale: 'fr',
      height: 'auto',
      events: filtered,

      eventDidMount: (info) => {
        const cid = String(info.event.extendedProps?.communityId || '')
        const color = colorMap.get(cid)
        if (color) {
          info.el.style.borderColor = color
          info.el.style.backgroundColor = color + '22' // léger fond
        }
        const cname = info.event.extendedProps?.communityName
        info.el.title = cname ? `${info.event.title} • ${cname}` : info.event.title
      },

      eventContent: (arg) => {
        const container = document.createElement('div')
        const root = createRoot(container)
        root.render(
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{arg.event.title}</div>
            {arg.event.extendedProps?.communityName && (
              <div style={{ fontSize: 11, opacity: 0.85 }}>{arg.event.extendedProps.communityName}</div>
            )}
          </div>
        )
        return { domNodes: [container] }
      },

      eventClick: (info) => {
        window.location.hash = `#/calendars/${info.event.id}`
      },
    })

    cal.current.render()
    return () => { if (cal.current) { cal.current.destroy(); cal.current = null } }
  }, [events, communities, filterCommunity])

  return (
    <Box sx={{ p: 2 }}>
      <Title title="Calendrier" />
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 240 }}>
                <InputLabel>Communauté</InputLabel>
                <Select
                  label="Communauté"
                  value={filterCommunity}
                  onChange={(e) => setFilterCommunity(e.target.value)}
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  {communities.map(c => (
                    <MenuItem key={c.id} value={String(c.id)}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="outlined" onClick={loadData}>Actualiser</Button>
            </Stack>

            <Button variant="contained" href="/#/calendars/create">Nouvel événement</Button>
          </Stack>
        </CardContent>
      </Card>

      <div ref={calRef} />
    </Box>
  )
}