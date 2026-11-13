import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

// Los tests verifican los textos en inglés
import i18n from '@/i18n/config'
i18n.changeLanguage('en')
