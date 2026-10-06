import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { routes } from './routes'
import { QuoteProvider } from './store/quote'

const router = createBrowserRouter(routes)

const app = (
  <StrictMode>
    <QuoteProvider>
      <RouterProvider router={router} />
    </QuoteProvider>
  </StrictMode>
)

const root = document.getElementById('root')!
// Pages are prerendered at build time — hydrate them. In `vite dev` the root is empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
