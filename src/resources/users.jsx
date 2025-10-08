
import * as React from 'react'
import {
  List, Datagrid, TextField, EmailField, DateField, TextInput,
  TopToolbar, Button, useRecordContext, useNotify, useRefresh, usePermissions,
  useGetList
} from 'react-admin'
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { resetUserPassword, banUser, unbanUser, assignRole } from '../api/admin'

const UserFilters = [
  <TextInput key="q" source="q" label="Recherche" alwaysOn />,
]

const RoleChangeDialog = ({ open, onClose, userId, currentRole, onSuccess }) => {
  const [selectedRole, setSelectedRole] = React.useState('')
  const { data: roles = [], isLoading } = useGetList('roles', {
    pagination: { page: 1, perPage: 100 },
  })
  const notify = useNotify()

  React.useEffect(() => {
    if (currentRole) {
      const role = roles.find(r => r.name === currentRole)
      if (role) setSelectedRole(role.id)
    }
  }, [currentRole, roles])

  const handleSubmit = async () => {
    if (!selectedRole) {
      notify('Veuillez sélectionner un rôle', { type: 'warning' })
      return
    }
    try {
      await assignRole(userId, selectedRole)
      notify('Rôle modifié avec succès', { type: 'success' })
      onSuccess()
      onClose()
    } catch (e) {
      notify(e?.message || 'Erreur lors du changement de rôle', { type: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Changer le rôle de l'utilisateur</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Rôle</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            label="Rôle"
            disabled={isLoading}
          >
            {roles.map(role => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button label="Annuler" onClick={onClose} />
        <Button label="Confirmer" onClick={handleSubmit} />
      </DialogActions>
    </Dialog>
  )
}

const AdminActions = () => {
  const { permissions } = usePermissions()
  const canAdmin = Array.isArray(permissions) && permissions.includes('ADMIN')
  if (!canAdmin) return null
  
  const rec = useRecordContext()
  const notify = useNotify()
  const refresh = useRefresh()
  const [roleDialogOpen, setRoleDialogOpen] = React.useState(false)

  const onReset = async () => {
    try {
      const res = await resetUserPassword(rec.id)
      notify(`MDP temporaire: ${res}`, { type: 'info', autoHideDuration: 8000 })
    } catch (e) {
      notify(e?.message || 'Erreur reset', { type: 'error' })
    }
  }

  const onBan = async () => {
    if (!window.confirm(`Voulez-vous vraiment bannir ${rec.username || rec.mail} ?`)) return
    try {
      await banUser(rec.id)
      notify('Utilisateur banni', { type: 'success' })
      refresh()
    } catch (e) {
      notify(e?.message || 'Erreur ban', { type: 'error' })
    }
  }

  const onUnban = async () => {
    try {
      await unbanUser(rec.id)
      notify('Utilisateur débanni', { type: 'success' })
      refresh()
    } catch (e) {
      notify(e?.message || 'Erreur unban', { type: 'error' })
    }
  }

  return (
    <>
      <TopToolbar>
        <Button label="Changer rôle" onClick={() => setRoleDialogOpen(true)} />
        <Button label="Reset MDP" onClick={onReset} />
        <Button label="Bannir" onClick={onBan} />
        <Button label="Débannir" onClick={onUnban} />
      </TopToolbar>
      
      <RoleChangeDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        userId={rec?.id}
        currentRole={rec?.roleName}
        onSuccess={refresh}
      />
    </>
  )
}

export const UserList = () => (
  <List filters={UserFilters}>
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField source="id" />
      <EmailField source="mail" />
      <TextField source="firstName" />
      <TextField source="lastName" />
      <TextField source="username" />
      <TextField source="phone" />
      <TextField source="roleName" label="Rôle" />
      <TextField source="communityName" label="Communauté" />
      <DateField source="lastLogin" />
      <AdminActions />
    </Datagrid>
  </List>
)