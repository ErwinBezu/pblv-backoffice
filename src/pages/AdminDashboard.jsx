import * as React from 'react'
import { Title, useNotify } from 'react-admin'
import { Box, Card, CardContent, Typography, Button, LinearProgress, Stack, Grid } from '@mui/material'
import { getAdminDashboard } from '../api/admin'

const Stat = ({ label, value }) => (
  <Card><CardContent>
    <Typography variant="overline">{label}</Typography>
    <Typography variant="h4">{value ?? '—'}</Typography>
  </CardContent></Card>
)

export default function AdminDashboard() {
  const notify = useNotify()
  const [loading, setLoading] = React.useState(true)
  const [d, setD] = React.useState(null)

  const load = React.useCallback(() => {
    setLoading(true)
    getAdminDashboard()
      .then((data) => { setD(data || {}); setLoading(false) })
      .catch((e) => { notify(e?.message || 'Erreur dashboard', { type:'error' }); setLoading(false) })
  }, [notify])

  React.useEffect(() => { load() }, [load])

  return (
    <Box sx={{ p: 2 }}>
      <Title title="Tableau de bord" />
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={3}><Stat label="Utilisateurs" value={d?.totalUsers} /></Grid>
        <Grid item xs={12} md={3}><Stat label="Nouveaux (7j)" value={d?.newUsersThisWeek} /></Grid>
        <Grid item xs={12} md={3}><Stat label="Actifs" value={d?.activeUsers} /></Grid>
        <Grid item xs={12} md={3}><Stat label="Bannis" value={d?.bannedUsers} /></Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={load}>Actualiser</Button>
        <Button variant="outlined" href="/#/users">Gérer les utilisateurs</Button>
        <Button variant="outlined" href="/#/communities">Communautés</Button>
      </Stack>

      {d?.lastUpdated && (
        <Typography variant="caption" sx={{ opacity: .7 }}>
          Dernière MAJ : {new Date(d.lastUpdated).toLocaleString()}
        </Typography>
      )}
    </Box>
  )
}
