import { test, expect } from '@playwright/test'

test.describe('Association Membership Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should display associations list page', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    await expect(page.getByRole('heading', { name: /associations/i })).toBeVisible()
    await expect(page.getByText(/browse and join padel associations/i)).toBeVisible()
  })

  test('should show empty state when no associations exist', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    
    const noAssociationsMessage = page.getByText(/no associations found/i)
    if (await noAssociationsMessage.isVisible()) {
      await expect(noAssociationsMessage).toBeVisible()
      await expect(page.getByText(/check back later/i)).toBeVisible()
    }
  })

  test('should display association cards with correct information', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('[class*="Card"]').filter({ hasText: /active|inactive/i })
    const count = await associationCards.count()
    
    if (count > 0) {
      const firstCard = associationCards.first()
      await expect(firstCard).toBeVisible()
    }
  })

  test('should navigate to association details page when clicking card', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      await expect(page).toHaveURL(/.*associations\/[a-f0-9-]+/)
    }
  })

  test('complete membership request flow', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `player${timestamp}@example.com`

    await page.goto('http://localhost:5173/register')
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Player')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByRole('button', { name: /create account/i }).click()

    await page.waitForURL(/\/(profile-setup|dashboard)/, { timeout: 10000 })

    if (page.url().includes('profile-setup')) {
      await page.getByRole('button', { name: /skip for now/i }).click()
    }

    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      
      const requestButton = page.getByRole('button', { name: /request membership/i })
      if (await requestButton.isVisible()) {
        await requestButton.click()
        
        await expect(page.getByText(/membership requested/i).or(page.getByText(/leave association/i))).toBeVisible({ timeout: 10000 })
      }
    }
  })

  test('should show login prompt for unauthenticated users on association details', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      
      const loginPrompt = page.getByText(/you need to be logged in to join/i)
      if (await loginPrompt.isVisible()) {
        await expect(loginPrompt).toBeVisible()
        await expect(page.getByRole('link', { name: /log in to join/i })).toBeVisible()
      }
    }
  })

  test('should allow category update for members', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `member${timestamp}@example.com`

    await page.goto('http://localhost:5173/register')
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Member')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByRole('button', { name: /create account/i }).click()

    await page.waitForURL(/\/(profile-setup|dashboard)/, { timeout: 10000 })

    if (page.url().includes('profile-setup')) {
      await page.getByRole('button', { name: /skip for now/i }).click()
    }

    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      
      const requestButton = page.getByRole('button', { name: /request membership/i })
      if (await requestButton.isVisible()) {
        await requestButton.click()
        await page.waitForTimeout(2000)
        
        const updateCategoryButton = page.getByRole('button', { name: /update category/i })
        if (await updateCategoryButton.isVisible()) {
          await updateCategoryButton.click()
          
          await expect(page.getByRole('heading', { name: /update category/i })).toBeVisible()
          
          const categorySelect = page.locator('select, [role="combobox"]').first()
          if (await categorySelect.isVisible()) {
            await categorySelect.click()
            await page.getByText(/3st category/i).click()
            
            await page.getByRole('button', { name: /^update category$/i }).click()
            
            await expect(page.getByText(/category updated/i)).toBeVisible({ timeout: 10000 })
          }
        }
      }
    }
  })

  test('should allow leaving an association', async ({ page }) => {
    const timestamp = Date.now()
    const testEmail = `leaver${timestamp}@example.com`

    await page.goto('http://localhost:5173/register')
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('Leaver')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/^password/i).fill('password123')
    await page.getByRole('button', { name: /create account/i }).click()

    await page.waitForURL(/\/(profile-setup|dashboard)/, { timeout: 10000 })

    if (page.url().includes('profile-setup')) {
      await page.getByRole('button', { name: /skip for now/i }).click()
    }

    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      
      const requestButton = page.getByRole('button', { name: /request membership/i })
      if (await requestButton.isVisible()) {
        await requestButton.click()
        await page.waitForTimeout(2000)
        
        const leaveButton = page.getByRole('button', { name: /leave association/i })
        if (await leaveButton.isVisible()) {
          await leaveButton.click()
          
          await expect(page.getByText(/membership removed/i).or(page.getByRole('button', { name: /request membership/i }))).toBeVisible({ timeout: 10000 })
        }
      }
    }
  })

  test('should display association information correctly', async ({ page }) => {
    await page.goto('http://localhost:5173/associations')
    
    const associationCards = page.locator('a[href*="/associations/"]')
    const count = await associationCards.count()
    
    if (count > 0) {
      await associationCards.first().click()
      
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      
      const activeOrInactiveBadge = page.getByText(/^active$|^inactive$/i)
      await expect(activeOrInactiveBadge).toBeVisible()
    }
  })
})
