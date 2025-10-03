import * as React from 'react'
import { Admin, Resource, CustomRoutes } from 'react-admin'
import { Route } from 'react-router-dom'
import dataProvider from './dataProvider'
import { authProvider } from './authProvider'
import LoginPage from './LoginPage'
import MyLayout from './layout/MyLayout'
import Profile from './Profile'

// Importer les pages admin
import AdminDashboard from './pages/AdminDashboard'
import SecurityDashboard from './pages/SecurityDashboard'
import SystemLogs from './pages/SystemLogs'
import CalendarBoard from './pages/CalendarBoard'

// Import des resources existantes
import { UserList } from './resources/users'
import { CommunityList, CommunityEdit, CommunityCreate } from './resources/communities'
import { BinList, BinEdit, BinCreate } from './resources/bins'
import { CalendarList, CalendarEdit, CalendarCreate } from './resources/calendars'
import { CollectCenterList, CollectCenterEdit, CollectCenterCreate } from './resources/collectCenters'
import { GarbageTypeList, GarbageTypeEdit, GarbageTypeCreate } from './resources/garbageTypes'
import { UserAddressList, UserAddressEdit, UserAddressCreate } from './resources/userAddresses'
import { UserPreferenceList, UserPreferenceEdit, UserPreferenceCreate } from './resources/userPreferences'
import { RoleList, RoleEdit, RoleCreate } from './resources/roles'
import { BinTypeList, BinTypeEdit, BinTypeCreate } from './resources/binTypes'

export default function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginPage}
      layout={MyLayout}
      dashboard={AdminDashboard}
    >
      <Resource 
        name="users" 
        list={UserList}
        options={{ label: 'Utilisateurs' }}
        icon={() => <span className="material-icons">people</span>}
      />
      
      <Resource 
        name="communities" 
        list={CommunityList}
        edit={CommunityEdit}
        create={CommunityCreate}
        options={{ label: 'Communautés' }}
        icon={() => <span className="material-icons">location_city</span>}
      />
      
      <Resource 
        name="bins" 
        list={BinList}
        edit={BinEdit}
        create={BinCreate}
        options={{ label: 'Conteneurs' }}
        icon={() => <span className="material-icons">delete</span>}
      />
      
      <Resource 
        name="bin-types" 
        list={BinTypeList}
        edit={BinTypeEdit}
        create={BinTypeCreate}
        options={{ label: 'Types de conteneurs' }}
        icon={() => <span className="material-icons">category</span>}
      />
      
      <Resource 
        name="calendars" 
        list={CalendarList}
        edit={CalendarEdit}
        create={CalendarCreate}
        options={{ label: 'Calendrier' }}
        icon={() => <span className="material-icons">calendar_today</span>}
      />
      
      <Resource 
        name="collect-centers" 
        list={CollectCenterList}
        edit={CollectCenterEdit}
        create={CollectCenterCreate}
        options={{ label: 'Centres de collecte' }}
        icon={() => <span className="material-icons">warehouse</span>}
      />
      
      <Resource 
        name="garbage-types" 
        list={GarbageTypeList}
        edit={GarbageTypeEdit}
        create={GarbageTypeCreate}
        options={{ label: 'Types de déchets' }}
        icon={() => <span className="material-icons">recycling</span>}
      />
      
      <Resource 
        name="roles" 
        list={RoleList}
        edit={RoleEdit}
        create={RoleCreate}
        options={{ label: 'Rôles' }}
        icon={() => <span className="material-icons">admin_panel_settings</span>}
      />
      
      <Resource 
        name="user-addresses" 
        list={UserAddressList}
        edit={UserAddressEdit}
        create={UserAddressCreate}
        options={{ label: 'Adresses utilisateurs' }}
        icon={() => <span className="material-icons">home</span>}
      />
      
      <Resource 
        name="user-preference" 
        list={UserPreferenceList}
        edit={UserPreferenceEdit}
        create={UserPreferenceCreate}
        options={{ label: 'Préférences utilisateurs' }}
        icon={() => <span className="material-icons">settings</span>}
      />

      <CustomRoutes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route path="/system-logs" element={<SystemLogs />} />
        <Route path="/calendar-board" element={<CalendarBoard />} />
      </CustomRoutes>
    </Admin>
  )
}