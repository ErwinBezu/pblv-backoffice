import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from 'react-admin'
import dataProvider from './dataProvider'
import authProvider from './authProvider'
import { Route } from 'react-router-dom'

import { BinList, BinCreate, BinEdit } from './resources/bins'
import { GarbageTypeList, GarbageTypeCreate, GarbageTypeEdit } from './resources/garbageTypes'
import { CommunityList, CommunityCreate, CommunityEdit } from './resources/communities'
import { CollectCenterList, CollectCenterCreate, CollectCenterEdit } from './resources/collectCenters'
import { CalendarList, CalendarCreate, CalendarEdit } from './resources/calendars'

import { UserList } from './resources/users'
import { UserAddressList, UserAddressCreate, UserAddressEdit } from './resources/userAddresses'
import { UserPreferenceList, UserPreferenceCreate, UserPreferenceEdit } from './resources/userPreferences'

import SecurityDashboard from './pages/SecurityDashboard'
import SystemLogs from './pages/SystemLogs'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CalendarBoard from './pages/CalendarBoard.jsx'



import MyLayout from './layout/MyLayout'


export default function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout} dashboard={AdminDashboard} >
      {/* existantes */}
      <Resource name="users" list={UserList} />

      <Resource name="user-addresses" list={UserAddressList} create={UserAddressCreate} edit={UserAddressEdit} />   {/* /api/user-address */}  {/* :contentReference[oaicite:25]{index=25} */}
      <Resource name="user-preferences" list={UserPreferenceList} create={UserPreferenceCreate} edit={UserPreferenceEdit} /> {/* /api/user-preference */} {/* :contentReference[oaicite:26]{index=26} */}


      <Resource name="reports" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="communities" list={CommunityList} create={CommunityCreate} edit={CommunityEdit} />
      <Resource name="collect-centers" list={CollectCenterList} create={CollectCenterCreate} edit={CollectCenterEdit} />

      {/* 👇 nouvelles */}
      <Resource name="bins" list={BinList} create={BinCreate} edit={BinEdit} />
      <Resource name="bin-types" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="calendars" list={CalendarList} create={CalendarCreate} edit={CalendarEdit} />

      {/* autres */}
      <Resource name="roles" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="garbage-types" list={GarbageTypeList} create={GarbageTypeCreate} edit={GarbageTypeEdit} />

      <CustomRoutes>
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route path="/system-logs" element={<SystemLogs />} />
        <Route path="/calendar-board" element={<CalendarBoard />} />
      </CustomRoutes>
    </Admin>
  )
}