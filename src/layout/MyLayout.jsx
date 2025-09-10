import * as React from 'react'
import { Layout, Menu, MenuItemLink, usePermissions } from 'react-admin'
import MyAppBar from './MyAppBar'

const MyMenu = (props) => {
  const { permissions } = usePermissions()
  const isAdmin = Array.isArray(permissions) && permissions.includes('ADMIN')
  return (
    <Menu {...props}>
      {/* Les Resources standards s’affichent déjà */}
      {isAdmin && (
        <>
          <MenuItemLink to="/security-dashboard" primaryText="Sécurité — Analytics" leftIcon={<span className="material-icons">shield</span>} />
          <MenuItemLink to="/system-logs" primaryText="Logs système" leftIcon={<span className="material-icons">description</span>} />
          <MenuItemLink to="/calendar-board" primaryText="Calendrier (vue)" leftIcon={<span className="material-icons">calendar_month</span>} />
        </>
      )}
    </Menu>
  )
}

export default function MyLayout(props) {
  return <Layout {...props} appBar={MyAppBar} menu={MyMenu} />
}