import * as React from 'react'
import { AppBar, TitlePortal, UserMenu, MenuItemLink, useLogout, useGetIdentity } from 'react-admin'
import { Box, Typography } from '@mui/material'

const MyUserMenu = () => {
  const logout = useLogout()
  return (
    <UserMenu>
      <MenuItemLink to="/profile" primaryText="Mon profil" leftIcon={<span className="material-icons">person</span>} />
      <MenuItemLink to="/#" primaryText="Déconnexion" onClick={() => logout()} leftIcon={<span className="material-icons">logout</span>} />
    </UserMenu>
  )
}

export default function MyAppBar(props) {
  const { data: id } = useGetIdentity()
  return (
    <AppBar {...props} userMenu={<MyUserMenu />}>
      <TitlePortal />
      <Box sx={{ display:'flex', alignItems:'center', gap:1, px:2 }}>
        <span className="material-icons">recycling</span>
        <Typography variant="h6" component="div">Poubelle La Vie</Typography>
        {id?.roles?.length ? (
          <Typography variant="caption" sx={{ ml:1, opacity:.8 }}>
            {Array.isArray(id.roles) ? id.roles.join(', ') : id.roles}
          </Typography>
        ) : null}
      </Box>
    </AppBar>
  )
}