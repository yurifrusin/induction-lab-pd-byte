import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ClassroomRoot from './ClassroomRoot.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClassroomRoot />
  </StrictMode>,
)
