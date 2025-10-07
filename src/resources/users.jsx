import * as React from 'react'
import {
  List, Datagrid, TextField, EmailField, DateField, TextInput,
  TopToolbar, Button, useRecordContext, useNotify, useRefresh, usePermissions
} from 'react-admin'
import { resetUserPassword, banUser, unbanUser, assignRole } from '../api/admin'

const UserFilters = [
  <TextInput key="q" source="q" label="Recherche" alwaysOn />,
]

const AdminActions = () => {
  const { permissions } = usePermissions()
  const canAdmin = Array.isArray(permissions) && permissions.includes('ADMIN')
  if (!canAdmin) return null
  const rec = useRecordContext()
  const notify = useNotify()
  const refresh = useRefresh()
  const onReset = async () => { try { const res = await resetUserPassword(rec.id); notify(`MDP temp: ${res}`, { type:'info', autoHideDuration:8000 }) } catch(e){ notify(e?.message||'Erreur reset', { type:'error' }) } }
  const onBan = async () => { try { await banUser(rec.id); notify('Utilisateur banni', { type:'success' }); refresh() } catch(e){ notify(e?.message||'Erreur ban', { type:'error' }) } }
  const onUnban = async () => { try { await unbanUser(rec.id); notify('Utilisateur débanni', { type:'success' }); refresh() } catch(e){ notify(e?.message||'Erreur unban', { type:'error' }) } }
  const onAssign = async () => {
    const roleId = window.prompt('RoleId ?')
    if (!roleId) return
    try { await assignRole(rec.id, roleId); notify('Rôle assigné', { type:'success' }); refresh() } catch(e){ notify(e?.message||'Erreur assign role', { type:'error' }) }
  }
  return (
    <TopToolbar>
      <Button label="Reset MDP" onClick={onReset} />
      <Button label="Bannir" onClick={onBan} />
      <Button label="Débannir" onClick={onUnban} />
      <Button label="Assigner rôle" onClick={onAssign} />
    </TopToolbar>
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
