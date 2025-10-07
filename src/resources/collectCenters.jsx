import * as React from 'react'
import {
  List, Datagrid, TextField,
  Edit, SimpleForm, TextInput, ReferenceInput, SelectInput,
  ReferenceArrayInput, SelectArrayInput,
  Create
} from 'react-admin'
import { urlOrEmpty, normalizeUrlOrEmpty } from '../validators'

const trim = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== '' && v != null))

export const CollectCenterList = () => (
  <List><Datagrid rowClick="edit">
    <TextField source="id" />
    <TextField source="name" />
    <TextField source="address" />
    <TextField source="website" />
    <TextField source="community" />
    <TextField source="garbageTypes" />
  </Datagrid></List>
)

export const CollectCenterCreate = () => (
  <Create transform={(d) => trim({
    name: d.name,
    address: d.address,
    website: normalizeUrlOrEmpty(d.website), // ⬅️
    communityId: d.communityId,
    garbageTypeIds: d.garbageTypeIds
  })}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="address" required />
      <TextInput source="website" validate={urlOrEmpty} helperText="Ex: https://exemple.fr" />
      <ReferenceInput source="communityId" reference="communities" label="Communauté" required>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceArrayInput source="garbageTypeIds" reference="garbage-types" label="Types de déchet">
        <SelectArrayInput optionText="type" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
)

export const CollectCenterEdit = () => (
  <Edit transform={(d) => trim({
    ...d,
    website: normalizeUrlOrEmpty(d.website) // ⬅️
  })}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="address" required />
      <TextInput source="website" validate={urlOrEmpty} helperText="Ex: https://exemple.fr" />
      <ReferenceInput source="communityId" reference="communities" label="Communauté" required>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceArrayInput source="garbageTypeIds" reference="garbage-types" label="Types de déchet">
        <SelectArrayInput optionText="type" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)
