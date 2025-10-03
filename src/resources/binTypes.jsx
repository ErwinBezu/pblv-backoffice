
import * as React from 'react'
import {
  List, Datagrid, TextField, NumberField,
  Edit, SimpleForm, TextInput, NumberInput,
  Create
} from 'react-admin'

const trim = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== '' && v != null))

export const BinTypeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" label="Nom" />
      <TextField source="description" />
      <NumberField source="capacity" label="Capacité (L)" />
      <TextField source="color" label="Couleur" />
    </Datagrid>
  </List>
)

export const BinTypeCreate = () => (
  <Create transform={(d) => trim({
    name: d.name,
    description: d.description,
    capacity: d.capacity ? parseFloat(d.capacity) : undefined,
    color: d.color
  })}>
    <SimpleForm>
      <TextInput source="name" required label="Nom du type" />
      <TextInput source="description" multiline label="Description" />
      <NumberInput source="capacity" label="Capacité (litres)" />
      <TextInput source="color" label="Couleur (hex)" helperText="Ex: #FF5733" />
    </SimpleForm>
  </Create>
)

export const BinTypeEdit = () => (
  <Edit transform={(d) => trim({
    ...d,
    capacity: d.capacity ? parseFloat(d.capacity) : undefined
  })}>
    <SimpleForm>
      <TextInput source="name" required label="Nom du type" />
      <TextInput source="description" multiline label="Description" />
      <NumberInput source="capacity" label="Capacité (litres)" />
      <TextInput source="color" label="Couleur (hex)" helperText="Ex: #FF5733" />
    </SimpleForm>
  </Edit>
)