import { useEffect } from 'react'

const SITE_URL = 'https://korfakhm.vercel.app'

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Держит <title>/<meta description>/OG/Twitter/canonical/robots в согласии
 * с текущим роутом — без этого SPA отдаёт один и тот же <title> и
 * canonical на все страницы, что для поиска выглядит как дубли контента.
 */
export function useSeo({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    if (!title) return
    const fullTitle = title.includes('КОРФАҲМ') ? title : `${title} — КОРФАҲМ`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertCanonical(url)
  }, [title, description, path, noindex])
}
