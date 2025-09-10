import * as React from 'react'
import {
  List, Datagrid, TextField,
  Edit, SimpleForm, TextInput, ReferenceInput, SelectInput,
  Create
} from 'react-admin'

// LIST : colle à BinDTOOut (community & garbageType en texte)
export const BinList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="latitude" />
      <TextField source="longitude" />
      <TextField source="community" label="Communauté" />
      <TextField source="garbageType" label="Type de déchet" />
    </Datagrid>
  </List>
)

// helpers
const trimEmpty = (obj) => Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== '' && v != null))

// CREATE / EDIT : on envoie communityId + garbageTypeId + coords (strings)
export const BinCreate = () => (
  <Create transform={(d) => trimEmpty({
    communityId: d.communityId,
    garbageTypeId: d.garbageTypeId,
    latitude: d.latitude,
    longitude: d.longitude
  })}>
    <SimpleForm>
      <ReferenceInput source="communityId" reference="communities" label="Communauté" required>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="garbageTypeId" reference="garbage-types" label="Type de déchet" required>
        {/* GarbageTypeDTOOut.type */}
        <SelectInput optionText="type" />
      </ReferenceInput>
      <TextInput source="latitude" required />
      <TextInput source="longitude" required />
    </SimpleForm>
  </Create>
)

export const BinEdit = () => (
  <Edit transform={(d) => trimEmpty({
    communityId: d.communityId,
    garbageTypeId: d.garbageTypeId,
    latitude: d.latitude,
    longitude: d.longitude
  })}>
    <SimpleForm>
      <ReferenceInput source="communityId" reference="communities" label="Communauté" required>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="garbageTypeId" reference="garbage-types" label="Type de déchet" required>
        <SelectInput optionText="type" />
      </ReferenceInput>
      <TextInput source="latitude" required />
      <TextInput source="longitude" required />
    </SimpleForm>
  </Edit>
)