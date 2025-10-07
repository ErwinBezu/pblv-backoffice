import * as React from 'react'
import { List, Datagrid, TextField, BooleanField, DateField, Edit, Create, SimpleForm, BooleanInput, TextInput } from 'react-admin'

export const UserPreferenceList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <BooleanField source="notificationEmail" />
      <BooleanField source="notificationPush" />
      <BooleanField source="notificationSms" />
      <TextField source="userId" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
)

export const UserPreferenceEdit = () => (
  <Edit><SimpleForm>
    <BooleanInput source="notificationEmail" />
    <BooleanInput source="notificationPush" />
    <BooleanInput source="notificationSms" />
    <TextInput source="userId" />
  </SimpleForm></Edit>
)

export const UserPreferenceCreate = () => (
  <Create><SimpleForm>
    <BooleanInput source="notificationEmail" />
    <BooleanInput source="notificationPush" />
    <BooleanInput source="notificationSms" />
    <TextInput source="userId" />
  </SimpleForm></Create>
)