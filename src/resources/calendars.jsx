import * as React from 'react'
import {
  List, Datagrid, TextField, DateField, Edit, SimpleForm,
  TextInput, DateTimeInput, Create, ReferenceInput, SelectInput,
  FunctionField, useGetList
} from 'react-admin'

const trim = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== '' && v != null))
const toIsoInstant = (v) => { if (!v) return undefined; const d = v instanceof Date ? v : new Date(v); return d.toISOString() }

export const CalendarList = () => {
  const { data: comms = [], isLoading } = useGetList('communities', {
    pagination: { page: 1, perPage: 1000 },
  })
  const dict = React.useMemo(
    () => Object.fromEntries(comms.map(c => [String(c.id), c.name])),
    [comms]
  )

  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <DateField source="dateEvent" showTime label="Date" />
        <TextField source="description" />
        <FunctionField
          label="Communauté"
          render={rec => isLoading ? rec.communityId : (dict[String(rec.communityId)] || rec.communityId)}
        />
      </Datagrid>
    </List>
  )
}

export const CalendarCreate = () => (
  <Create transform={(d) => trim({
    dateEvent: toIsoInstant(d.dateEvent),
    description: d.description,
    communityId: d.communityId
  })}>
    <SimpleForm>
      <DateTimeInput source="dateEvent" label="Date" required />
      <TextInput source="description" multiline />
      <ReferenceInput source="communityId" reference="communities" label="Communauté">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)

export const CalendarEdit = () => (
  <Edit transform={(d) => trim({
    dateEvent: toIsoInstant(d.dateEvent),
    description: d.description,
    communityId: d.communityId
  })}>
    <SimpleForm>
      <DateTimeInput source="dateEvent" label="Date" required />
      <TextInput source="description" multiline />
      <ReferenceInput source="communityId" reference="communities" label="Communauté">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
)
