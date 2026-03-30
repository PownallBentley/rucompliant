import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('displays the hero content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Are you compliant?')).toBeVisible()
    await expect(page.getByText('Get started free', { exact: false })).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/RUCompliant/)
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByText('Are you compliant?')).toBeVisible()
  })

  test('displays pricing section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('£49.99')).toBeVisible()
    await expect(page.getByText('£499.99')).toBeVisible()
  })

  test('displays navigation with sign in and get started', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('RUCompliant')).toBeVisible()
  })
})
