import { test, expect } from '@playwright/test'

test.describe('Organizer Tournament Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as organizer
    await page.goto('http://localhost:5173/login')
    await page.getByLabel(/email/i).fill('organizer@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForURL(/.*dashboard/)
  })

  test('should navigate to organizer dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/dashboard')
    await expect(page.getByRole('heading', { name: /organizer dashboard/i })).toBeVisible()
  })

  test('should display create tournament button', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/dashboard')
    await expect(page.getByRole('button', { name: /create tournament/i })).toBeVisible()
  })

  test('should navigate to create tournament page', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/dashboard')
    await page.getByRole('button', { name: /create tournament/i }).click()
    await expect(page).toHaveURL(/.*organizer\/tournaments\/create/)
    await expect(page.getByRole('heading', { name: /create tournament/i })).toBeVisible()
  })

  test('should show validation errors on empty tournament form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/tournaments/create')
    await page.getByRole('button', { name: /create tournament/i }).click()
    await expect(page.getByText(/tournament name must be at least 3 characters/i)).toBeVisible()
  })

  test('complete tournament creation flow', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/tournaments/create')

    // Fill in tournament details
    await page.getByLabel(/tournament name/i).fill('Test Championship 2024')
    await page.getByLabel(/description/i).fill('A test tournament')
    await page.getByLabel(/start date/i).fill('2024-12-01')
    await page.getByLabel(/end date/i).fill('2024-12-03')
    await page.getByLabel(/tournament type/i).selectOption('single_elimination')
    await page.getByLabel(/association id/i).fill('123e4567-e89b-12d3-a456-426614174000')

    // Fill in settings
    await page.getByLabel(/max teams/i).fill('32')
    await page.getByLabel(/team size/i).fill('2')

    // Submit form
    await page.getByRole('button', { name: /create tournament/i }).click()

    // Should redirect to tournament management page
    await expect(page).toHaveURL(/.*organizer\/tournaments\/\d+/)
  })

  test('should display tournament tabs', async ({ page }) => {
    // Assuming a tournament exists with ID 1
    await page.goto('http://localhost:5173/organizer/tournaments/1')
    
    await expect(page.getByRole('button', { name: /overview/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /enrollments/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /participants/i })).toBeVisible()
  })

  test('should switch between tournament tabs', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/tournaments/1')
    
    // Click enrollments tab
    await page.getByRole('button', { name: /enrollments/i }).click()
    await expect(page.getByText(/pending requests/i)).toBeVisible()

    // Click participants tab
    await page.getByRole('button', { name: /participants/i }).click()
    await expect(page.getByText(/total teams/i)).toBeVisible()
  })

  test('should approve enrollment request', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/tournaments/1')
    await page.getByRole('button', { name: /enrollments/i }).click()

    // Assuming there's a pending enrollment
    const approveButton = page.getByRole('button', { name: /approve/i }).first()
    if (await approveButton.isVisible()) {
      await approveButton.click()
      await expect(page.getByText(/enrollment approved successfully/i)).toBeVisible()
    }
  })

  test('should update tournament status', async ({ page }) => {
    await page.goto('http://localhost:5173/organizer/tournaments/1')
    
    // Change status
    await page.getByLabel(/tournament status/i).selectOption('in_progress')
    await expect(page.getByText(/tournament status updated successfully/i)).toBeVisible()
  })
})
