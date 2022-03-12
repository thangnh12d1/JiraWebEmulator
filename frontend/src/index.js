import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { Windmill } from '@windmill/react-ui'
import { SidebarProvider } from './context/SidebarContext'
import ThemedSuspense from './components/ThemedSuspense'
ReactDOM.render(
  <React.StrictMode>
    <SidebarProvider>
      <Suspense fallback={<ThemedSuspense />}>
        <Windmill usePreferences>
          <Provider store={store}>
            <App />
          </Provider>
        </Windmill>
      </Suspense>
    </SidebarProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
