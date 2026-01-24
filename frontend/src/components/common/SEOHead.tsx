import { useEffect } from 'react'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
}

export function SEOHead({ 
  title = 'Padel Tournament Management',
  description = 'Manage padel tournaments, enroll with partners, view rankings, and track your performance.',
  keywords = 'padel, tournament, management, rankings, enrollment, sports',
  ogImage = '/og-image.jpg'
}: SEOHeadProps) {
  useEffect(() => {
    document.title = title ? `${title} | Padel Tournament` : 'Padel Tournament Management'
    
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    const updateOGTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateOGTag('og:title', title)
    updateOGTag('og:description', description)
    updateOGTag('og:image', ogImage)
    updateOGTag('og:type', 'website')
  }, [title, description, keywords, ogImage])

  return null
}
