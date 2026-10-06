import { lazy } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'
import { QuoteProvider } from '@/store/quote'

// Home is eager for fastest first paint; everything else is code-split.
const Shop = lazy(() => import('@/pages/Shop'))
const Product = lazy(() => import('@/pages/Product'))
const CustomBags = lazy(() => import('@/pages/CustomBags'))
const BulkOrder = lazy(() => import('@/pages/BulkOrder'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Policy = lazy(() => import('@/pages/Policy'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/product/:slug', element: <Product /> },
      { path: '/customized-bags', element: <CustomBags /> },
      { path: '/bulk-order', element: <BulkOrder /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/policies/:slug', element: <Policy /> },
      // Keep old WordPress URLs working (SEO + shared links).
      { path: '/product-category/:slug', element: <CategoryRedirect /> },
      { path: '/about-us', element: <Navigate to="/about" replace /> },
      { path: '/contact-us', element: <Navigate to="/contact" replace /> },
      { path: '/cart', element: <Navigate to="/shop" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function CategoryRedirect() {
  const slug = location.pathname.split('/').filter(Boolean)[1]
  return <Navigate to={`/shop?category=${slug}`} replace />
}

export default function App() {
  return (
    <QuoteProvider>
      <RouterProvider router={router} />
    </QuoteProvider>
  )
}
