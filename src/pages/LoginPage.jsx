import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import * as React from 'react'
import { useLogin, Notification } from 'react-admin'
import { Card, CardContent, Button, Typography, TextField, Divider } from '@mui/material'
import { apiJson } from '../auth/apiClient'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function LoginForm() {
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
    } finally { 
      setLoading(false) 
    }
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    setError(null)
    try {
      // Envoie l'ID Token à votre backend
      await login({ 
        googleToken: credentialResponse.credential 
      })
    } catch (err) {
      setError(err?.message || 'Erreur lors de la connexion Google')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Erreur lors de la connexion Google')
  }

  return (
    <div style={{ display:'grid', placeItems:'center', minHeight:'100dvh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card style={{ width: 420 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Connexion</Typography>
          
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
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              style={{ marginTop: 16 }} 
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <Divider style={{ margin: '24px 0' }}>
            <Typography variant="body2" color="text.secondary">OU</Typography>
          </Divider>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              // useOneTap
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="360"
            />
          </div>

          <Button onClick={handleForgot} size="small" fullWidth>
            Mot de passe oublié ?
          </Button>

          {error && (
            <Typography color="error" style={{ marginTop: 12, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card>
      <Notification />
    </div>
  )
}

export default function LoginPage() {
  if (!GOOGLE_CLIENT_ID) {
    console.log('VITE_GOOGLE_CLIENT_ID non défini dans .env')
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <LoginForm />
    </GoogleOAuthProvider>
  )
}