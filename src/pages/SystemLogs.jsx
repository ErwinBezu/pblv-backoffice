import * as React from 'react'
import { Title, useNotify } from 'react-admin'
import { Box, Card, CardContent, Typography, LinearProgress, TextField } from '@mui/material'
import { getSystemLogs } from '../api/admin'

export default function SystemLogs() {
  const notify = useNotify()
  const [limit, setLimit] = React.useState(200)
  const [state, setState] = React.useState({ loading:true, lines:[] })

  const load = React.useCallback(() => {
    setState(s => ({ ...s, loading:true }))
    getSystemLogs(limit).then(lines => setState({ loading:false, lines: lines || [] }))
      .catch(e => { notify(e?.message || 'Erreur logs', { type:'error' }); setState({ loading:false, lines:[] }) })
  }, [limit, notify])

  React.useEffect(() => { load() }, [load])

  return (
    <Box sx={{ p:2 }}>
      <Title title="Logs système" />
      <Card>
        <CardContent>
          <Box sx={{ display:'flex', gap:2, alignItems:'center', mb:2 }}>
            <Typography>Limite</Typography>
            <TextField size="small" type="number" value={limit} onChange={e => setLimit(Number(e.target.value || 200))} onBlur={load} />
          </Box>
          {state.loading && <LinearProgress sx={{ mb:2 }} />}
          <pre style={{ whiteSpace:'pre-wrap', fontFamily:'monospace', fontSize:12, margin:0 }}>
            {(state.lines || []).join('\n')}
          </pre>
        </CardContent>
      </Card>
    </Box>
  )
}