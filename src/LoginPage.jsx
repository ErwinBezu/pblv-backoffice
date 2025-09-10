import * as React from 'react'
import { useLogin, Notification } from 'react-admin'
import { Card, CardContent, Button, Typography, TextField } from '@mui/material'
import { apiJson } from './auth/apiClient'

export default function LoginPage() {
  const login = useLogin()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login({ username: email, password })
    } catch (err) {
      setError(err?.message || 'Échec de connexion')
    } finally { setLoading(false) }
  }

  const handleForgot = async () => {
    const value = prompt('Entrez votre e-mail :', email || '')
    if (!value) return
    try {
      await apiJson(`/api/auth/forgot-password?email=${encodeURIComponent(value)}`, { method: 'POST' })
      alert('Email de réinitialisation envoyé.')
    } catch (err) {
      alert(err?.message || 'Erreur')
    }
  }

  const handleGoogle = async () => {
    try {
      const url = await apiJson('/api/auth/google/login', { method: 'GET' })
      window.location.href = typeof url === 'string' ? url : (url && url.data) || '/'
    } catch {
      alert("Flux Google non configuré côté front : redirige via /google/login ou poste un id_token sur /google/token.")
    }
  }

  return (
    <div style={{ display:'grid', placeItems:'center', minHeight:'100dvh' }}>
      <Card style={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Connexion</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="dense"
              required
            />
            <Button type="submit" variant="contained" fullWidth style={{ marginTop: 16 }} disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <Button onClick={handleGoogle} variant="outlined" fullWidth style={{ marginTop: 12 }}>
            Continuer avec Google
          </Button>

          <Button onClick={handleForgot} size="small" style={{ marginTop: 8 }}>
            Mot de passe oublié ?
          </Button>

          {error && <Typography color="error" style={{ marginTop: 8 }}>{error}</Typography>}
        </CardContent>
      </Card>
      <Notification />
    </div>
  )
}