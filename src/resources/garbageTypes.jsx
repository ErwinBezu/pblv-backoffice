import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, Create } from 'react-admin'

export const GarbageTypeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="type" />
      <TextField source="description" />
      <TextField source="color" />
    </Datagrid>
  </List>
)

export const GarbageTypeEdit = () => (
  <Edit><SimpleForm>
    <TextInput source="type" />
    <TextInput source="description" multiline />
    <TextInput source="color" />
  </SimpleForm></Edit>
)

export const GarbageTypeCreate = () => (
  <Create><SimpleForm>
    <TextInput source="type" />
    <TextInput source="description" multiline />
    <TextInput source="color" />
  </SimpleForm></Create>
)