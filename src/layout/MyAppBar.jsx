import * as React from 'react'
import { AppBar, TitlePortal, UserMenu, MenuItemLink, useLogout, useGetIdentity, useSidebarState } from 'react-admin'
import { Box, Typography, IconButton, useMediaQuery } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import RecyclingIcon from '@mui/icons-material/Recycling'
import MenuIcon from '@mui/icons-material/Menu'


const MyUserMenu = () => {
  const logout = useLogout()
  return (
    <UserMenu>
      <MenuItemLink to="/profile" primaryText="Mon profil" leftIcon={<PersonIcon />} />
      <MenuItemLink to="/#" primaryText="Déconnexion" onClick={() => logout()} leftIcon={<LogoutIcon />} />
    </UserMenu>
  )
}

export default function MyAppBar(props) {
  const { data: id } = useGetIdentity()
  const [open, setOpen] = useSidebarState()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <AppBar {...props} userMenu={<MyUserMenu />} alwaysOn>
      {isMobile && (
        <IconButton
          color="inherit"
          onClick={() => setOpen(!open)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <TitlePortal />
      <Box sx={{ display:'flex', alignItems:'center', gap:1, px:2 }}>
        <RecyclingIcon color="inherit" />
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