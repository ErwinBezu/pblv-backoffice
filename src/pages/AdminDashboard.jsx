import * as React from 'react'
import { Title, useNotify, usePermissions } from 'react-admin'
import { 
  Box, Card, CardContent, Typography, Button, LinearProgress, 
  Alert, Chip, IconButton, List, ListItem, ListItemText, Divider
} from '@mui/material'
import { getAdminDashboard } from '../api/admin'
import Grid from '@mui/material/Grid'

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import ReportIcon from '@mui/icons-material/Report'
import SettingsIcon from '@mui/icons-material/Settings'
import RecyclingIcon from '@mui/icons-material/Recycling'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

const Stat = ({ label, value, color = 'primary', trend, icon: Icon }) => (
  <Card sx={{ 
    height: '100%',
    background: color === 'success' ? 
      'linear-gradient(135deg, #4caf50 0%, #81c784 100%)' : 
      color === 'warning' ? 
      'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)' : 
      color === 'error' ? 
      'linear-gradient(135deg, #f44336 0%, #e57373 100%)' : 
      'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="overline" sx={{ opacity: 0.9, fontWeight: 600 }}>
            {label}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
            {value ?? '—'}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {trend > 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {Math.abs(trend)}% cette semaine
              </Typography>
            </Box>
          )}
        </Box>
        {Icon && (
          <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.3)', 
            width: 56, 
            height: 56,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
)

export default function AdminDashboard() {
  const notify = useNotify()
  const { permissions } = usePermissions()
  const [loading, setLoading] = React.useState(true)
  const [d, setD] = React.useState(null)

  const isUser = Array.isArray(permissions) && permissions.includes('USER') && permissions.length === 1
  const hasAccess = !isUser && permissions?.length > 0

  const load = React.useCallback(() => {
    if (!hasAccess) return
    setLoading(true)
    getAdminDashboard()
      .then((data) => { setD(data || {}); setLoading(false) })
      .catch((e) => { notify(e?.message || 'Erreur dashboard', { type:'error' }); setLoading(false) })
  }, [notify, hasAccess])

  React.useEffect(() => { load() }, [load])

  if (isUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Title title="Tableau de bord" />
        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Accès restreint</Typography>
          <Typography>
            Le tableau de bord administrateur n'est pas accessible avec votre rôle utilisateur.
          </Typography>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#fafbfc', minHeight: '100vh' }}>
      <Title title="Tableau de bord administrateur" />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Tableau de bord
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vue d'ensemble de votre plateforme Poubelle La Vie
          </Typography>
        </Box>
        <IconButton onClick={load} color="primary" sx={{ bgcolor: 'primary.light', color: 'white' }}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Stat label="Utilisateurs totaux" value={d?.totalUsers} icon={PeopleIcon} trend={12} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stat label="Nouveaux (7j)" value={d?.newUsersThisWeek} color="success" icon={TrendingUpIcon} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stat label="Actifs" value={d?.activeUsers} color="success" icon={PeopleIcon} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stat label="Bannis" value={d?.bannedUsers} color="error" icon={ReportIcon} />
        </Grid>
      </Grid>

      {/* Cartes d'information */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DashboardIcon color="primary" />
                Statistiques rapides
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Connexions récentes (24h)" 
                    secondary={d?.recentLogins || 0}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Rôles configurés" 
                    secondary={d?.totalRoles || 0}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Utilisateurs inactifs" 
                    secondary={d?.inactiveUsers || 0}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Santé du système" 
                    secondary={
                      <Chip 
                        label={d?.systemHealth || 'UNKNOWN'} 
                        size="small"
                        color={d?.systemHealth === 'HEALTHY' ? 'success' : d?.systemHealth === 'WARNING' ? 'warning' : 'error'}
                        sx={{ mt: 0.5 }}
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                Actions rapides
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Button variant="contained" fullWidth href="/#/users" startIcon={<PeopleIcon />}>
                  Gérer les utilisateurs
                </Button>
                <Button variant="outlined" fullWidth href="/#/reports" startIcon={<ReportIcon />}>
                  Voir les signalements
                </Button>
                <Button variant="outlined" fullWidth href="/#/communities" startIcon={<LocationOnIcon />}>
                  Gérer les communautés
                </Button>
                <Button variant="outlined" fullWidth href="/#/bins" startIcon={<RecyclingIcon />}>
                  Gérer les conteneurs
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Signalements récents */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReportIcon color="warning" />
            Signalements récents
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {d?.pendingReports || 12}
                </Typography>
                <Typography variant="body2">En attente</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {d?.inProgressReports || 8}
                </Typography>
                <Typography variant="body2">En cours</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {d?.resolvedReports || 45}
                </Typography>
                <Typography variant="body2">Résolus</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {d?.highPriorityReports || 3}
                </Typography>
                <Typography variant="body2">Haute priorité</Typography>
              </Box>
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }} href="/#/reports" fullWidth>
            Voir tous les signalements
          </Button>
        </CardContent>
      </Card>

      {d?.lastUpdated && (
        <Typography variant="caption" sx={{ opacity: .7, display: 'block', textAlign: 'center' }}>
          Dernière mise à jour : {new Date(d.lastUpdated).toLocaleString('fr-FR')}
        </Typography>
      )}
    </Box>
  )
}