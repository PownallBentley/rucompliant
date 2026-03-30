import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('displays the hero content', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Compliance That Has Your Back')).toBeVisible()
    await expect(page.getByText('Get Started')).toBeVisible()
  })

  test('has correct page title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/RUCompliant/)
  })

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByText('Compliance That Has Your Back')).toBeVisible()
  })
})
