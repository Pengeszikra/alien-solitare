import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlienSolitare } from './AlienSolitare';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlienSolitare />
  </StrictMode>,
)
