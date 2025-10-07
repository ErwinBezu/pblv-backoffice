import * as React from 'react'
import { Title, useNotify } from 'react-admin'
import { getSecurityAnalytics } from '../api/admin'
import { Box, Grid, Card, CardContent, Typography, LinearProgress, List, ListItem, ListItemText, Divider } from '@mui/material'

// mini sparkline
const Sparkline = ({ data = [] }) => {
  const W=220, H=48, P=4
  if (!data.length) return <Box sx={{height:H}} />
  const ds = data.map(Number).filter(v => !isNaN(v))
  const min = Math.min(...ds), max = Math.max(...ds)
  const sx = i => (i/(ds.length-1))*(W-P*2)+P
  const sy = v => H-P-((v-min)/(max-min||1))*(H-P*2)
  const d = ds.map((v,i)=>`${i?'L':'M'}${sx(i)},${sy(v)}`).join(' ')
  return <svg width={W} height={H}><path d={d} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
}

export default function SecurityDashboard() {
  const notify = useNotify()
  const [state, setState] = React.useState({ loading:true, data:null })

  React.useEffect(() => {
    getSecurityAnalytics()
      .then(data => setState({ loading:false, data }))
      .catch(e => { notify(e?.message || 'Erreur analytics sécurité', { type:'error' }); setState({ loading:false, data:null }) })
  }, [notify])

  const d = state.data || {}
  const health = d.systemHealth || {} // SecurityHealthStatus
  const trends = d.securityTrends || {}
  const trendVals = Object.values(trends)

  return (
    <Box sx={{ p:2 }}>
      <Title title="Sécurité — Analytics" />
      {state.loading && <LinearProgress sx={{ mb:2 }} />}

      <Grid container spacing={2}>
        {[
          ['Événements', d.totalEvents],
          ['Critiques', d.criticalEvents],
          ['Logins échoués', d.failedLogins],
          ['Accès refusés', d.accessDenials],
        ].map(([label,value]) => (
          <Grid size={{ xs: 12, md: 3}} key={label}>
            <Card><CardContent>
              <Typography variant="overline">{label}</Typography>
              <Typography variant="h4">{value ?? '—'}</Typography>
            </CardContent></Card>
          </Grid>
        ))}

        <Grid size={{ xs:12, md: 8}}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tendances sécurité</Typography>
              <Sparkline data={trendVals} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Santé du système</Typography>
              <Typography variant="body1" sx={{ fontWeight:'bold', mb:1 }}>{health.status || '—'}</Typography>
              {(health.recommendations || []).length > 0 ? (
                <List dense>
                  {health.recommendations.map((r,i)=>(
                    <React.Fragment key={i}>
                      <ListItem><ListItemText primary={r} /></ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : <Typography variant="body2">Pas de recommandations.</Typography>}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6}}>
          <Card>
            <CardContent>
              <Typography variant="h6">IP à risque</Typography>
              <List dense>
                {(d.topRiskyIPs || []).map((ip,i)=>(
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemText
                        primary={`${ip.ip || ip.address || 'IP inconnue'}`}
                        secondary={`score: ${ip.riskScore ?? '—'} • événements: ${ip.events ?? '—'}`} />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6}}>
          <Card>
            <CardContent>
              <Typography variant="h6">Alertes récentes</Typography>
              <List dense>
                {(d.recentAlerts || []).map((a,i)=>(
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemText
                        primary={`${a.level || a.result || 'ALERT'} — ${a.action || a.message || a.resource || ''}`}
                        secondary={`${a.timestamp || ''} ${a.userEmail ? `• ${a.userEmail}` : ''}`} />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}