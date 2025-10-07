import * as React from 'react'
import { Title, useNotify, useRedirect, useAuthenticated } from 'react-admin'
import { getMe, updateMe, changePassword } from './api/me'
import { Box, Grid, Card, CardContent, TextField, Typography, Button, FormGroup, FormControlLabel, Checkbox, Divider, Alert } from '@mui/material'

export default function Profile() {
  useAuthenticated()
  const notify = useNotify()
  const redirect = useRedirect()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [data, setData] = React.useState({})

  React.useEffect(() => {
    let alive = true
    getMe().then(d => { if (alive) { setData(d || {}); setLoading(false) }})
           .catch(e => { if (alive) { setError(e?.message || 'Erreur'); setLoading(false) }})
    return () => { alive = false }
  }, [])

  const set = (k, v) => setData(prev => ({ ...prev, [k]: v }))
  const setAddr = (k, v) => setData(prev => ({ ...prev, userAddress: { ...(prev.userAddress || {}), [k]: v } }))
  const setPref = (k, v) => setData(prev => ({ ...prev, userPreference: { ...(prev.userPreference || {}), [k]: v } }))

  const onSave = async () => {
    try {
      await updateMe(data)
      notify('Profil mis à jour', { type: 'success' })
    } catch (e) {
      notify(e?.message || 'Erreur de sauvegarde', { type: 'warning' })
    }
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const currentPassword = String(form.get('currentPassword') || '')
    const newPassword = String(form.get('newPassword') || '')
    if (!currentPassword || !newPassword) return notify('Champs manquants', { type:'warning' })
    try {
      await changePassword({ currentPassword, newPassword })
      notify('Mot de passe modifié', { type:'success' })
      e.currentTarget.reset()
    } catch (er) {
      notify(er?.message || 'Erreur lors du changement de mot de passe', { type:'error' })
    }
  }

  if (loading) return <Box sx={{ p:2 }}><LinearProgress /></Box>
  if (error) return <Box sx={{ p:2 }}><Alert severity="error">{error}</Alert></Box>

  return (
    <Box sx={{ p:2 }}>
      <Title title="Mon profil" />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Informations personnelles</Typography>
              <Grid container spacing={2} sx={{ mt:1 }}>
                <Grid item xs={12} md={6}>
                  <TextField label="Prénom" value={data.firstname || ''} onChange={e => set('firstname', e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Nom" value={data.lastname || ''} onChange={e => set('lastname', e.target.value)} fullWidth required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Email" value={data.mail || ''} fullWidth InputProps={{ readOnly:true }} helperText="L'email ne peut pas être modifié" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Nom d'utilisateur" value={data.username || ''} fullWidth InputProps={{ readOnly:true }} helperText="Le nom d'utilisateur ne peut pas être modifié" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Téléphone" value={data.phone || ''} onChange={e => set('phone', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="URL de l'avatar" value={data.avatarUrl || ''} onChange={e => set('avatarUrl', e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Biographie" value={data.bio || ''} onChange={e => set('bio', e.target.value)} fullWidth multiline rows={3} />
                </Grid>
              </Grid>

              <Divider sx={{ my:2 }} />
              <Typography variant="h6">Adresse</Typography>
              <Grid container spacing={2} sx={{ mt:1 }}>
                <Grid item xs={12} md={3}><TextField label="Numéro" value={data.userAddress?.number || ''} onChange={e => setAddr('number', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} md={9}><TextField label="Rue" value={data.userAddress?.street || ''} onChange={e => setAddr('street', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12}><TextField label="Complément" value={data.userAddress?.complement || ''} onChange={e => setAddr('complement', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} md={4}><TextField label="Code postal" value={data.userAddress?.postalCode || ''} onChange={e => setAddr('postalCode', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} md={8}><TextField label="Ville" value={data.userAddress?.city || ''} onChange={e => setAddr('city', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} md={6}><TextField label="Latitude" value={data.userAddress?.latitude || ''} onChange={e => setAddr('latitude', e.target.value)} fullWidth /></Grid>
                <Grid item xs={12} md={6}><TextField label="Longitude" value={data.userAddress?.longitude || ''} onChange={e => setAddr('longitude', e.target.value)} fullWidth /></Grid>
              </Grid>

              <Divider sx={{ my:2 }} />
              <Typography variant="h6">Préférences</Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={!!data.userPreference?.notificationEmail} onChange={e => setPref('notificationEmail', e.target.checked)} />} label="Notifications email" />
                <FormControlLabel control={<Checkbox checked={!!data.userPreference?.notificationPush} onChange={e => setPref('notificationPush', e.target.checked)} />} label="Notifications push" />
                <FormControlLabel control={<Checkbox checked={!!data.userPreference?.notificationSms} onChange={e => setPref('notificationSms', e.target.checked)} />} label="Notifications SMS" />
                <FormControlLabel control={<Checkbox checked={!!data.userPreference?.darkMode} onChange={e => setPref('darkMode', e.target.checked)} />} label="Mode sombre" />
                <FormControlLabel control={<Checkbox checked={!!data.userPreference?.geolocalizationEnabled} onChange={e => setPref('geolocalizationEnabled', e.target.checked)} />} label="Géolocalisation activée" />
              </FormGroup>

              <Box sx={{ display:'flex', gap:1, mt:2 }}>
                <Button variant="contained" onClick={onSave}>Sauvegarder</Button>
              </Box>

              <Divider sx={{ my:3 }} />
              <Typography variant="h6">Changer le mot de passe</Typography>
              <Box component="form" onSubmit={onChangePassword} sx={{ mt:1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}><TextField type="password" name="currentPassword" label="Mot de passe actuel" fullWidth required /></Grid>
                  <Grid item xs={12} md={6}><TextField type="password" name="newPassword" label="Nouveau mot de passe" fullWidth inputProps={{ minLength:8 }} required /></Grid>
                </Grid>
                <Button type="submit" variant="outlined" sx={{ mt:2 }}>Mettre à jour le mot de passe</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
