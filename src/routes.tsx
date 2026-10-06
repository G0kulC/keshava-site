import { lazy } from 'react'
import { Navigate, useParams, type RouteObject } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { paths, policyPaths, type PolicySlug } from '@/config/routes'
import { getPost } from '@/data'
import { getArea } from '@/data/seo'
import Home from '@/pages/Home'

// Home is eager for the fastest first paint; everything else is code-split.
const Shop = lazy(() => import('@/pages/Shop'))
const Category = lazy(() => import('@/pages/Category'))
const Product = lazy(() => import('@/pages/Product'))
const CustomBags = lazy(() => import('@/pages/CustomBags'))
const BulkOrder = lazy(() => import('@/pages/BulkOrder'))
const About = lazy(() => import('@/pages/About'))
const Contact = lazy(() => import('@/pages/Contact'))
const Industries = lazy(() => import('@/pages/Industries'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Area = lazy(() => import('@/pages/Area'))
const Policy = lazy(() => import('@/pages/Policy'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Root-level slugs: blog posts (old WordPress permalinks) and local area pages. */
function RootSlug() {
  const { slug = '' } = useParams()
  if (getPost(slug)) return <BlogPost />
  const area = getArea(slug)
  if (area) return <Area area={area} />
  return <NotFound />
}

function OldPolicyRedirect() {
  const { slug = '' } = useParams()
  const to = policyPaths[slug as PolicySlug]
  return <Navigate to={to ?? paths.home} replace />
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/shop', element: <Shop /> },
      { path: '/product-category/:slug', element: <Category /> },
      { path: '/product/:slug', element: <Product /> },
      { path: '/customized-bags', element: <CustomBags /> },
      { path: '/bulk-order', element: <BulkOrder /> },
      { path: '/about-us', element: <About /> },
      { path: '/contact-us', element: <Contact /> },
      { path: '/industries-use-cases', element: <Industries /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/blog', element: <Blog /> },
      ...(Object.entries(policyPaths) as [PolicySlug, string][]).map(([slug, path]) => ({ path, element: <Policy slug={slug} /> })),
      { path: '/:slug', element: <RootSlug /> },
      // Short / earlier URLs → canonical (hosting also 301s these).
      { path: '/about', element: <Navigate to={paths.about} replace /> },
      { path: '/contact', element: <Navigate to={paths.contact} replace /> },
      { path: '/policies/:slug', element: <OldPolicyRedirect /> },
      { path: '/cart', element: <Navigate to={paths.shop} replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
