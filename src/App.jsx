import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Authenticator from './components/Authenticator'
import Home from './components/Home'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Authenticator />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
