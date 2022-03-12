import React, { useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'

import Sidebar from '../components/Sidebar'
import Header2 from '../components/Header2'
import { useSelector } from 'react-redux'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'
import { getMe } from '../slices/infouser'
import { useAppDispatch } from '../store'
import { inforUserSelector } from '../slices/infouser'

const Page404 = lazy(() => import('../pages/404'))

function Layout() {
  //WHY: get info user by
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getMe())
  }, [])
  const { inforUser, success } = useSelector(inforUserSelector)
  let sidebar
  let router_temp = []
  // Admin or trusted has sidebar to edit
  if (success) {
    if (inforUser.Is_Admin == 0 || inforUser.Is_Admin == 1) {
      sidebar = <Sidebar />
    }
    if (inforUser.Is_Admin == 2) {
      routes.map((route, i) => {
        if (route.globalRole == 'Member') {
          router_temp.push(route)
        }
      })
    }
    if (inforUser.Is_Admin == 0) {
      router_temp = routes
    }
    if (inforUser.Is_Admin == 1) {
      routes.map((route, i) => {
        if (route.globalRole == 'Member' || route.globalRole == 'Trusted') {
          router_temp.push(route)
        }
      })
    }
  }
  //Sidebar
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  let location = useLocation()

  useEffect(() => {
    closeSidebar()
  }, [location])

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && 'overflow-hidden'
      }`}
    >
      <div className="flex flex-col flex-1 w-full">
        <Header2 />
        <div className="flex">
          {sidebar}
          <div className="w-full">
            <Suspense fallback={<ThemedSuspense />}>
              <Switch>
                {router_temp.map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`/app${route.path}`}
                      render={(props) => <route.component {...props} />}
                    />
                  ) : null
                })}
                <Redirect exact from="/app" to="/app/projects" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
