import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, CustomRoutes } from 'react-admin'
import { Route } from 'react-router-dom'

import dataProvider from './dataProvider'
import authProvider from './authProvider'

import { BinList, BinCreate, BinEdit, BinShow } from './resources/bins'
import { GarbageTypeList, GarbageTypeCreate, GarbageTypeEdit } from './resources/garbageTypes'
import { CommunityList, CommunityCreate, CommunityEdit } from './resources/communities'
import { CollectCenterList, CollectCenterCreate, CollectCenterEdit } from './resources/collectCenters'
import { CalendarList, CalendarCreate, CalendarEdit } from './resources/calendars'
import { UserList } from './resources/users'
import { UserAddressList, UserAddressCreate, UserAddressEdit } from './resources/userAddresses'
import { UserPreferenceList, UserPreferenceCreate, UserPreferenceEdit } from './resources/userPreferences'
import LoginPage from './LoginPage'


import SecurityDashboard from './pages/SecurityDashboard'
import SystemLogs from './pages/SystemLogs'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CalendarBoard from './pages/CalendarBoard.jsx'



import MyLayout from './layout/MyLayout'


export default function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout} dashboard={AdminDashboard} loginPage={LoginPage}  >
      <Resource name="users" list={UserList} />
      <Resource name="user-addresses" list={UserAddressList} create={UserAddressCreate} edit={UserAddressEdit} />
      <Resource name="user-preferences" list={UserPreferenceList} create={UserPreferenceCreate} edit={UserPreferenceEdit} />


      <Resource name="reports" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="communities" list={CommunityList} create={CommunityCreate} edit={CommunityEdit} />
      <Resource name="collect-centers" list={CollectCenterList} create={CollectCenterCreate} edit={CollectCenterEdit} />

      <Resource name="bins" list={BinList} create={BinCreate} edit={BinEdit}  show={BinShow} />
      <Resource name="bin-types" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />
      <Resource name="calendars" list={CalendarList} create={CalendarCreate} edit={CalendarEdit} />

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