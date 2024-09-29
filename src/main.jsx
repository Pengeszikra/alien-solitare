import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AlienGame } from './AlienGame';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlienGame />
  </StrictMode>,
)
