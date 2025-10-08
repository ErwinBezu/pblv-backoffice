import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, NumberInput, Create } from 'react-admin'
import { urlOrEmpty, normalizeUrlOrEmpty } from '../validators'

const trim = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== '' && v != null))
const toInt = (v) => (v === '' || v == null ? undefined : parseInt(v, 10))

export const CommunityList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="phone" />
      <TextField source="mail" />
      <TextField source="postalCode" />
      <TextField source="website" />
    </Datagrid>
  </List>
)

export const CommunityCreate = () => (
  <Create transform={(d) => trim({
    name: d.name,
    phone: d.phone,
    mail: d.mail,
    postalCode: toInt(d.postalCode),
    website: normalizeUrlOrEmpty(d.website)
  })}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="phone" />
      <TextInput source="mail" />
      <NumberInput source="postalCode" />
      <TextInput source="website" validate={urlOrEmpty} helperText="Ex: https://exemple.fr" />
    </SimpleForm>
  </Create>
)

export const CommunityEdit = () => (
  <Edit transform={(d) => trim({
    ...d,
    postalCode: toInt(d.postalCode),
    website: normalizeUrlOrEmpty(d.website)
  })}>
    <SimpleForm>
      <TextInput source="name" required />
      <TextInput source="phone" />
      <TextInput source="mail" />
      <NumberInput source="postalCode" />
      <TextInput source="website" validate={urlOrEmpty} helperText="Ex: https://exemple.fr" />
    </SimpleForm>
  </Edit>
)
