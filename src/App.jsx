import React from 'react'
// import React, { useState } from 'react'

import './global.css'

import Header from './components/Header.jsx'
import Contacts from './components/Contacts.jsx'
import { ContactProvider } from './ContactContext.jsx'

function App() {
  return (
    <ContactProvider>
      <Header />
      <Contacts />
    </ContactProvider>
  )
}

export default App;