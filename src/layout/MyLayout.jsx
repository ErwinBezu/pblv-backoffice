
import * as React from 'react'
import { Layout, usePermissions, useSidebarState } from 'react-admin'
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Box, Typography, Divider, useMediaQuery
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import MyAppBar from './MyAppBar'

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import ReportIcon from '@mui/icons-material/Report'
import SecurityIcon from '@mui/icons-material/Security'
import DescriptionIcon from '@mui/icons-material/Description'
import RecyclingIcon from '@mui/icons-material/Recycling'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const DRAWER_WIDTH = 280

const CustomSidebar = () => {
  const { permissions } = usePermissions()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useSidebarState()
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  
  const isAdmin = Array.isArray(permissions) && permissions.includes('ADMIN')
  const isModerator = Array.isArray(permissions) && permissions.includes('MODERATOR')
  const hasAdvancedAccess = isAdmin || isModerator
  
  const menuItems = [
    // Section principale
    { 
      id: 'dashboard', 
      label: 'Tableau de bord', 
      icon: DashboardIcon, 
      path: '/',
      show: hasAdvancedAccess 
    },
    
    // Gestion
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      icon: PeopleIcon, 
      path: '/users',
      show: hasAdvancedAccess 
    },
    { 
      id: 'reports', 
      label: 'Signalements', 
      icon: ReportIcon, 
      path: '/reports',
      show: hasAdvancedAccess 
    },
    
    // Ressources
    { 
      id: 'bins', 
      label: 'Conteneurs', 
      icon: RecyclingIcon, 
      path: '/bins',
      show: true 
    },
    { 
      id: 'communities', 
      label: 'Communautés', 
      icon: LocationCityIcon, 
      path: '/communities',
      show: true 
    },
    { 
      id: 'collect-centers', 
      label: 'Centres de collecte', 
      icon: LocationOnIcon, 
      path: '/collect-centers',
      show: true 
    },
    { 
      id: 'calendars', 
      label: 'Calendrier', 
      icon: CalendarMonthIcon, 
      path: '/calendars',
      show: true 
    },
    
    // Configuration
    { 
      id: 'garbage-types', 
      label: 'Types de déchets', 
      icon: CategoryIcon, 
      path: '/garbage-types',
      show: hasAdvancedAccess 
    },
    { 
      id: 'bin-types', 
      label: 'Types de conteneurs', 
      icon: Inventory2Icon, 
      path: '/bin-types',
      show: hasAdvancedAccess 
    },
    
    // Admin
    { 
      id: 'roles', 
      label: 'Rôles', 
      icon: AdminPanelSettingsIcon, 
      path: '/roles',
      show: isAdmin 
    },
    { 
      id: 'security-dashboard', 
      label: 'Sécurité', 
      icon: SecurityIcon, 
      path: '/security-dashboard',
      show: isAdmin 
    },
    { 
      id: 'system-logs', 
      label: 'Logs système', 
      icon: DescriptionIcon, 
      path: '/system-logs',
      show: isAdmin 
    },
  ]

  const visibleItems = menuItems.filter(item => item.show)
  
  const handleNavigation = (path) => {
    navigate(path)
    if (!isDesktop) {
      setOpen(false)
    }
  }
  
  const drawerContent = (
    <Box sx={{ p: 2, pt: isDesktop ? 2 : 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 1 }}>
        <RecyclingIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ px: 0 }}>
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path || 
                         (item.path !== '/' && location.pathname.startsWith(item.path))
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
  
  return (
    <Drawer
      variant={isDesktop ? 'permanent' : 'temporary'}
      open={isDesktop ? true : open}
      onClose={() => setOpen(false)}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: isDesktop ? 64 : 0,
          bgcolor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          height: isDesktop ? 'calc(100% - 64px)' : '100%'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

const CustomLayout = (props) => {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  
  return (
    <Layout
      {...props}
      appBar={MyAppBar}
      sidebar={CustomSidebar}
      sx={{
        '& .RaLayout-content': {
          marginLeft: isDesktop ? `0px` : 0,
          transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
        '& .RaAppBar-menuButton': {
          display: 'none'
        },
        '& .RaLoadingIndicator-loadedIcon': {
          display: 'none'
        }
      }}
    />
  )
}

export default CustomLayout