import * as React from 'react'
import { Title, useNotify } from 'react-admin'
import { Box, Card, CardContent, Typography, Button, LinearProgress, Stack } from '@mui/material'
import { getAdminDashboard } from '../api/admin' 
import Grid from '@mui/material/Grid' 

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
        <Grid size={{ xs:12, md:3}}><Stat label="Utilisateurs" value={d?.totalUsers} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Nouveaux (7j)" value={d?.newUsersThisWeek} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Actifs" value={d?.activeUsers} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Bannis" value={d?.bannedUsers} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Connexions récentes" value={d?.recentLogins} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Rôles" value={d?.totalRoles} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Inactifs" value={d?.inactiveUsers} /></Grid>
        <Grid size={{ xs:12, md:3}}><Stat label="Santé système" value={d?.systemHealth} /></Grid>
      </Grid>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={load}>Actualiser</Button>
        <Button variant="outlined" href="/#/users">Gérer les utilisateurs</Button>
        <Button variant="outlined" href="/#/communities">Communautés</Button>
        <Button variant="outlined" href="/#/bins">Conteneurs</Button>
        <Button variant="outlined" href="/#/calendars">Calendrier</Button>
        <Button variant="outlined" href="/#/collect-centers">Centres de collecte</Button>
      </Stack>

      {d?.lastUpdated && (
        <Typography variant="caption" sx={{ opacity: .7 }}>
          Dernière MAJ : {new Date(d.lastUpdated).toLocaleString()}
        </Typography>
      )}
    </Box>
  )
}
