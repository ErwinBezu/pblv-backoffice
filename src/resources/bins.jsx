import * as React from 'react'
import {
  List, Datagrid, TextField,
  Edit, SimpleForm, TextInput, ReferenceInput, SelectInput,
  Create, Show, SimpleShowLayout, Button, useRecordContext
} from 'react-admin'
import { Download } from '@mui/icons-material'
import QRCode from 'react-qr-code'

export const BinList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="latitude" />
      <TextField source="longitude" />
      <TextField source="community" label="Communauté" />
      <TextField source="garbageType" label="Type de déchet" />
    </Datagrid>
  </List>
)

const QRCodeDisplay = ({ source }) => {
  const record = useRecordContext()
  const qrRef = React.useRef()

  const downloadQRCode = () => {
    if (!record || !record[source]) return
    
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    const data = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      canvas.width = 512
      canvas.height = 512
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, 512, 512)
      
      const pngUrl = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.href = pngUrl
      downloadLink.download = `qrcode-poubelle-${record.id}.png`
      downloadLink.click()
      
      URL.revokeObjectURL(url)
    }
    
    img.src = url
  }

  if (!record || !record[source]) {
    return <div style={{ color: 'red', padding: '20px' }}>
      QR Code non disponible. Le champ "qrCode" est vide dans la base de données.
    </div>
  }
  
  return (
    <div>
      <div ref={qrRef} style={{ padding: '20px', background: 'white', display: 'inline-block', borderRadius: '8px' }}>
        <QRCode value={record[source]} size={256} />
      </div>
      <div style={{ marginTop: '16px' }}>
        <Button label="Télécharger QR Code" onClick={downloadQRCode}>
          <Download />
        </Button>
      </div>
    </div>
  )
}

export const BinShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="latitude" />
      <TextField source="longitude" />
      <TextField source="community" label="Communauté" />
      <TextField source="garbageType" label="Type de déchet" />
      <TextField source="qrCode" label="URL du QR Code" />
      <QRCodeDisplay source="qrCode" />
    </SimpleShowLayout>
  </Show>
)

const trimEmpty = (obj) => Object.fromEntries(Object.entries(obj).filter(([,v]) => v !== '' && v != null))

export const BinCreate = () => (
  <Create transform={(d) => trimEmpty({
    communityId: d.communityId,
    binTypeId: d.binTypeId,  // AJOUTER
    garbageTypeId: d.garbageTypeId,
    latitude: d.latitude,
    longitude: d.longitude
  })}>
    <SimpleForm>
      <ReferenceInput source="communityId" reference="communities" label="Communauté" required>
        <SelectInput optionText="name" />
      </ReferenceInput>
      
      <ReferenceInput source="binTypeId" reference="bin-types" label="Type de conteneur" required>
        <SelectInput optionText="type" />
      </ReferenceInput>
      
      <ReferenceInput source="garbageTypeId" reference="garbage-types" label="Type de déchet">
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