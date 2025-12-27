import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('should display landing page with sign up and sign in buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome to padel tournament manager/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /get started/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).first().click()
    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('button', { name: /get started/i }).click()
    await expect(page).toHaveURL(/.*register/)
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible()
  })

  test('should show validation errors on empty login form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/invalid email address/i)).toBeVisible()
  })

  test('should show validation errors on empty register form submission', async ({ page }) => {
    await page.goto('http://localhost:5173/register')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/first name must be at least 2 characters/i)).toBeVisible()
  })

  test('complete registration and login flow', async ({ page }) => {
    // Generate unique email for test
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`

    // Navigate to register page
    await page.goto('http://localhost:5173/register')

    // Fill in registration form
    await page.getByLabel(/first name/i).fill('Test')
    await page.getByLabel(/last name/i).fill('User')
    await page.getByLabel(/email/i).fill(testEmail)
    await page.getByLabel(/^password/i).fill('password123')

    // Submit registration
    await page.getByRole('button', { name: /create account/i }).click()

    // Should redirect to profile setup or dashboard
    await expect(page).toHaveURL(/\/(profile-setup|dashboard)/)

    // If on profile setup, skip it
    if (page.url().includes('profile-setup')) {
      await page.getByRole('button', { name: /skip for now/i }).click()
    }

    // Should be on dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
  })

  test('should redirect authenticated users from public pages', async ({ page }) => {
    // This test assumes a user is already logged in
    // You would need to set up authentication state first
    // For now, this is a placeholder test structure
  })

  test('should protect dashboard route for unauthenticated users', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard')
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })
})
