import * as React from 'react'
import {
  List, Datagrid, TextField, BooleanField, DateField,
  Edit, SimpleForm, TextInput, BooleanInput, ArrayInput, SimpleFormIterator,
  Create, TopToolbar, Button, useRecordContext, useNotify, useRefresh
} from 'react-admin'
import { cloneRole, toggleRoleStatus } from '../api/admin'

const trim = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== '' && v != null))

const RoleActions = () => {
  const rec = useRecordContext()
  const notify = useNotify()
  const refresh = useRefresh()

  const onClone = async () => {
    try {
      await cloneRole(rec.id)
      notify('Rôle cloné avec succès', { type: 'success' })
      refresh()
    } catch(e) {
      notify(e?.message || 'Erreur lors du clonage', { type: 'error' })
    }
  }

  const onToggleStatus = async () => {
    try {
      await toggleRoleStatus(rec.id)
      notify('Statut du rôle modifié', { type: 'success' })
      refresh()
    } catch(e) {
      notify(e?.message || 'Erreur changement statut', { type: 'error' })
    }
  }

  return (
    <TopToolbar>
      <Button label="Cloner" onClick={onClone} />
      <Button label="Activer/Désactiver" onClick={onToggleStatus} />
    </TopToolbar>
  )
}

export const RoleList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" label="Nom" />
      <TextField source="description" />
      <BooleanField source="isActive" label="Actif" />
      <TextField source="priority" label="Priorité" />
      <DateField source="createdAt" showTime label="Créé le" />
      <DateField source="updatedAt" showTime label="Mis à jour le" />
      <RoleActions />
    </Datagrid>
  </List>
)

export const RoleCreate = () => (
  <Create transform={(d) => trim({
    name: d.name,
    description: d.description,
    permissions: d.permissions || [],
    isActive: d.isActive !== false,
    priority: d.priority ? parseInt(d.priority, 10) : undefined
  })}>
    <SimpleForm>
      <TextInput source="name" required label="Nom du rôle" />
      <TextInput source="description" multiline label="Description" />
      <BooleanInput source="isActive" label="Actif" defaultValue={true} />
      <TextInput source="priority" label="Priorité" type="number" />
      <ArrayInput source="permissions" label="Permissions">
        <SimpleFormIterator inline>
          <TextInput source="." label="Permission" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
)

export const RoleEdit = () => (
  <Edit transform={(d) => trim({
    ...d,
    priority: d.priority ? parseInt(d.priority, 10) : undefined
  })}>
    <SimpleForm>
      <TextInput source="name" required label="Nom du rôle" />
      <TextInput source="description" multiline label="Description" />
      <BooleanInput source="isActive" label="Actif" />
      <TextInput source="priority" label="Priorité" type="number" />
      <ArrayInput source="permissions" label="Permissions">
        <SimpleFormIterator inline>
          <TextInput source="." label="Permission" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
)