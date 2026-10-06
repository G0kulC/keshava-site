// Build-time renderer: turns a URL into static HTML (used by scripts/prerender.mjs).
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { SITE_URL } from './config/routes'
import { allPaths, getPageMeta } from './seo/meta'
import { renderHead } from './seo/head'
import { QuoteProvider } from './store/quote'

const handler = createStaticHandler(routes)

export async function render(url: string) {
  const request = new Request(new URL(url, SITE_URL))
  const context = await handler.query(request)
  if (context instanceof Response) throw new Error(`Unexpected redirect while prerendering ${url}`)
  const router = createStaticRouter(handler.dataRoutes, context)

  // prerender waits for every lazy page / Suspense boundary, so the HTML is complete.
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <QuoteProvider>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </QuoteProvider>
    </StrictMode>,
  )
  let html = ""
  const decoder = new TextDecoder()
  for await (const chunk of prelude as unknown as AsyncIterable<Uint8Array | string>) html += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true })

  return { html, head: renderHead(getPageMeta(url)), status: getPageMeta(url).noindex ? 404 : 200 }
}

export { allPaths, getPageMeta }
