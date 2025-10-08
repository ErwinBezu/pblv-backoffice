import * as React from 'react'
import {
  List, Datagrid, TextField, DateField, ReferenceField,
  Edit, SimpleForm, TextInput, SelectInput, DateTimeInput,
  Create, Show, SimpleShowLayout, FunctionField,
  BooleanField, BooleanInput, useRecordContext,
  TopToolbar, Button, useNotify, useRefresh
} from 'react-admin'
import { Chip, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelIcon from '@mui/icons-material/Cancel'

const statusColors = {
  PENDING: 'warning',
  IN_PROGRESS: 'info',
  RESOLVED: 'success',
  REJECTED: 'error'
}

const StatusField = ({ source }) => {
  const record = useRecordContext()
  if (!record || !record[source]) return null
  
  const status = record[source]
  const statusLabels = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    RESOLVED: 'Résolu',
    REJECTED: 'Rejeté'
  }
  
  return (
    <Chip 
      label={statusLabels[status] || status}
      color={statusColors[status] || 'default'}
      size="small"
    />
  )
}

const PriorityField = ({ source }) => {
  const record = useRecordContext()
  if (!record || !record[source]) return null
  
  const priority = record[source]
  const priorityColors = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'error',
    CRITICAL: 'error'
  }
  
  const priorityLabels = {
    LOW: 'Faible',
    MEDIUM: 'Moyenne',
    HIGH: 'Haute',
    CRITICAL: 'Critique'
  }
  
  return (
    <Chip 
      label={priorityLabels[priority] || priority}
      color={priorityColors[priority] || 'default'}
      size="small"
      variant="outlined"
    />
  )
}

const ReportActions = () => {
  const record = useRecordContext()
  const notify = useNotify()
  const refresh = useRefresh()

  const handleResolve = async () => {
    notify('Signalement marqué comme résolu', { type: 'success' })
    refresh()
  }

  const handleReject = async () => {
    notify('Signalement rejeté', { type: 'info' })
    refresh()
  }

  if (!record || record.status === 'RESOLVED' || record.status === 'REJECTED') {
    return null
  }

  return (
    <TopToolbar>
      <Button label="Résoudre" onClick={handleResolve}>
        <CheckCircleIcon />
      </Button>
      <Button label="Rejeter" onClick={handleReject}>
        <CancelIcon />
      </Button>
    </TopToolbar>
  )
}

export const ReportList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="id" label="ID" />
      <TextField source="type" label="Type" />
      <TextField source="title" label="Titre" />
      <StatusField source="status" label="Statut" />
      <PriorityField source="priority" label="Priorité" />
      <TextField source="userId" label="Utilisateur" />
      <DateField source="createdAt" label="Date" showTime />
      <FunctionField
        label="Localisation"
        render={record => record.location ? 
          `${record.location.latitude?.toFixed(4)}, ${record.location.longitude?.toFixed(4)}` : 
          'N/A'
        }
      />
    </Datagrid>
  </List>
)

export const ReportShow = () => (
  <Show actions={<ReportActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID du signalement" />
      <TextField source="type" label="Type" />
      <TextField source="title" label="Titre" />
      <TextField source="description" label="Description" />
      <StatusField source="status" label="Statut" />
      <PriorityField source="priority" label="Priorité" />
      
      <TextField source="userId" label="ID Utilisateur" />
      <TextField source="binId" label="ID Conteneur" />
      
      <FunctionField
        label="Localisation"
        render={record => record.location ? (
          <Box>
            <div>Latitude: {record.location.latitude}</div>
            <div>Longitude: {record.location.longitude}</div>
            {record.location.address && <div>Adresse: {record.location.address}</div>}
          </Box>
        ) : 'Aucune localisation'}
      />
      
      <BooleanField source="anonymous" label="Anonyme" />
      <TextField source="contactEmail" label="Email de contact" />
      <TextField source="contactPhone" label="Téléphone de contact" />
      
      <DateField source="createdAt" label="Créé le" showTime />
      <DateField source="updatedAt" label="Modifié le" showTime />
      <DateField source="resolvedAt" label="Résolu le" showTime />
      
      <TextField source="resolvedBy" label="Résolu par" />
      <TextField source="resolutionNotes" label="Notes de résolution" />
      
      <FunctionField
        label="Photos"
        render={record => record.photoUrls?.length ? 
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {record.photoUrls.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt={`Photo ${idx + 1}`}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
              />
            ))}
          </Box> : 
          'Aucune photo'
        }
      />
    </SimpleShowLayout>
  </Show>
)

export const ReportEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" label="ID" disabled fullWidth />
      
      <TextInput source="type" label="Type" disabled fullWidth />
      <TextInput source="title" label="Titre" disabled fullWidth />
      <TextInput source="description" label="Description" disabled multiline rows={4} fullWidth />
      
      <SelectInput source="status" label="Statut" choices={[
        { id: 'PENDING', name: 'En attente' },
        { id: 'IN_PROGRESS', name: 'En cours' },
        { id: 'RESOLVED', name: 'Résolu' },
        { id: 'REJECTED', name: 'Rejeté' }
      ]} required />
      
      <SelectInput source="priority" label="Priorité" choices={[
        { id: 'LOW', name: 'Faible' },
        { id: 'MEDIUM', name: 'Moyenne' },
        { id: 'HIGH', name: 'Haute' },
        { id: 'CRITICAL', name: 'Critique' }
      ]} required />
      
      <TextInput source="resolutionNotes" label="Notes de résolution" multiline rows={4} fullWidth />
      
      <TextInput source="userId" label="ID Utilisateur" disabled />
      <TextInput source="binId" label="ID Conteneur" disabled />
      
      <BooleanInput source="anonymous" label="Anonyme" disabled />
      <TextInput source="contactEmail" label="Email de contact" disabled />
      <TextInput source="contactPhone" label="Téléphone" disabled />
    </SimpleForm>
  </Edit>
)

export const ReportCreate = () => (
  <Create>
    <SimpleForm>
      <SelectInput source="type" label="Type" choices={[
        { id: 'BIN_FULL', name: 'Conteneur plein' },
        { id: 'BIN_DAMAGED', name: 'Conteneur endommagé' },
        { id: 'ILLEGAL_DUMP', name: 'Dépôt sauvage' },
        { id: 'MISSED_COLLECTION', name: 'Collecte manquée' },
        { id: 'OTHER', name: 'Autre' }
      ]} required />
      
      <TextInput source="title" label="Titre" required fullWidth />
      <TextInput source="description" label="Description" multiline rows={4} fullWidth required />
      
      <SelectInput source="priority" label="Priorité" choices={[
        { id: 'LOW', name: 'Faible' },
        { id: 'MEDIUM', name: 'Moyenne' },
        { id: 'HIGH', name: 'Haute' },
        { id: 'CRITICAL', name: 'Critique' }
      ]} defaultValue="MEDIUM" />
      
      <TextInput source="userId" label="ID Utilisateur" />
      <TextInput source="binId" label="ID Conteneur" />
      
      <BooleanInput source="anonymous" label="Signalement anonyme" />
      <TextInput source="contactEmail" label="Email de contact" type="email" />
      <TextInput source="contactPhone" label="Téléphone de contact" />
      
      <TextInput source="location.latitude" label="Latitude" type="number" />
      <TextInput source="location.longitude" label="Longitude" type="number" />
      <TextInput source="location.address" label="Adresse" fullWidth />
    </SimpleForm>
  </Create>
)