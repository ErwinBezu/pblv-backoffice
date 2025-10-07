import * as React from 'react'
import { List, Datagrid, TextField, NumberField, Edit, Create, SimpleForm, TextInput, NumberInput } from 'react-admin'

export const UserAddressList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <NumberField source="number" />
      <TextField source="street" />
      <TextField source="complement" />
      <TextField source="city" />
      <NumberField source="postalCode" />
      <TextField source="latitude" />
      <TextField source="longitude" />
    </Datagrid>
  </List>
)

export const UserAddressEdit = () => (
  <Edit><SimpleForm>
    <NumberInput source="number" />
    <TextInput source="street" />
    <TextInput source="complement" />
    <TextInput source="city" />
    <NumberInput source="postalCode" />
    <TextInput source="latitude" />
    <TextInput source="longitude" />
  </SimpleForm></Edit>
)

export const UserAddressCreate = () => (
  <Create><SimpleForm>
    <NumberInput source="number" />
    <TextInput source="street" />
    <TextInput source="complement" />
    <TextInput source="city" />
    <NumberInput source="postalCode" />
    <TextInput source="latitude" />
    <TextInput source="longitude" />
  </SimpleForm></Create>
)