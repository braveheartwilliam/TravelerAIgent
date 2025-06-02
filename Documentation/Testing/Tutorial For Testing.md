# Tutorial For Testing

This guide provides step-by-step instructions for running and interpreting both unit/component tests (Vitest) and end-to-end (E2E) tests (Playwright) in this project. It also explains where to find results and how to interpret them.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Running Vitest Unit/Component Tests](#running-vitest-unitcomponent-tests)
    - [How to Run](#how-to-run-vitest)
    - [Where to Find Results](#where-to-find-vitest-results)
    - [How to Interpret Results](#how-to-interpret-vitest-results)
    - [Generating Coverage Reports](#generating-coverage-reports)
3. [Running Playwright E2E Tests](#running-playwright-e2e-tests)
    - [How to Run](#how-to-run-playwright)
    - [Where to Find Results](#where-to-find-playwright-results)
    - [How to Interpret Results](#how-to-interpret-playwright-results)
4. [Troubleshooting](#troubleshooting)
5. [Advanced Testing Scenarios](#advanced-testing-scenarios)

## Prerequisites

- Node.js v18 or later
- All dependencies installed:

```bash
npm install
```

---

## Running Vitest Unit/Component Tests

### How to Run Vitest

1. **Run all tests in the terminal:**

```bash
npx vitest
```

1. **Open the interactive UI (optional):**

```bash
npx vitest --ui
```

### Where to Find Vitest Results

- **Terminal Output:**
  After running `npx vitest`, results will display in your terminal.
  Each test file and individual test will show as passed (✓) or failed (✗).
- **UI Output:**
  The UI shows a list of test files, their status, and details for each test.
- **Coverage Report:**
  Run with coverage:

```bash
npx vitest run --coverage
```

  Coverage output will be in the `/coverage` directory.
  Open `coverage/index.html` in your browser for a detailed, visual report.

### How to Interpret Vitest Results

- **Passed Test:** Green checkmark (✓)
- **Failed Test:** Red cross (✗) with error message and stack trace
- **Coverage Report:**
- Green: Code is fully tested
- Yellow: Partial coverage
- Red: Not covered by tests
- Click files in `coverage/index.html` to see which lines are covered/missed

### Generating Coverage Reports

- Run:

```bash
npx vitest run --coverage
```

- Open the HTML report:

```bash
open coverage/index.html
```

---

## Running Playwright E2E Tests

### How to Run Playwright

1. **Ensure Playwright browsers are installed:**

```bash
npx playwright install
```

1. **Run all E2E tests:**

```bash
npx playwright test
```

1. **Run tests in headed mode (see the browser):**

```bash
npx playwright test --headed
```

1. **Open the Playwright Test Reporter UI:**

```bash
npx playwright show-report
```

### Where to Find Playwright Results

- **Terminal Output:**
  - Test results (pass/fail) and summary
- **HTML Report:**
  - After running tests, Playwright generates an HTML report (shown in terminal output)
  - Open it with:

```bash
npx playwright show-report
```

### How to Interpret Playwright Results

- **Passed Test:** Green checkmark (✓)
- **Failed Test:** Red cross (✗) with error message and screenshot/video (if enabled)
- **HTML Report:**
  - Shows each test, steps, errors, and attached screenshots/videos
  - Click on a test to see details and traces

---

## Troubleshooting

- **Tests not found:** Ensure your test files are named `*.spec.ts` or `*.test.ts` and are in the correct directories.
- **Dependencies missing:** Run `npm install`.
- **Coverage not generating:** Check `vitest.config.ts` for correct coverage configuration.
- **Playwright browser errors:** Run `npx playwright install` to install required browsers.

---

## Advanced Testing Scenarios

This section covers advanced test techniques for both Vitest and Playwright, including accessibility, mocking, error boundaries, snapshots, and E2E power features.

### 1. Keyboard Navigation & Accessibility (Vitest)

Test keyboard navigation and focus management using Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/svelte';
import CommandInput from '../command-input.svelte';

describe('Keyboard navigation', () => {
  it('focuses input on mount and responds to Tab/Enter', async () => {
    const { getByRole } = render(CommandInput);
    const input = getByRole('textbox');
    input.focus();
    expect(document.activeElement).toBe(input);
    await fireEvent.keyDown(input, { key: 'Tab' });
    // Add assertions for focus movement
    await fireEvent.keyDown(input, { key: 'Enter' });
    // Assert on Enter behavior
  });
});
```

### 2. Mocking API Calls (Vitest)

Use `vi.mock` to mock modules or fetch:

```typescript
import { vi } from 'vitest';

global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({ data: 'mocked' })
})) as any;

// Now render component and assert on mocked data
```

### 3. Testing Error Boundaries (Vitest/Svelte)

Test that error boundaries catch and display errors:

```typescript
import { render } from '@testing-library/svelte';
import ErrorBoundary from '../ErrorBoundary.svelte';
import BrokenComponent from '../BrokenComponent.svelte';

describe('Error boundaries', () => {
  it('renders fallback UI when error occurs', () => {
    const { getByText } = render(ErrorBoundary, {
      props: { $$slots: { default: BrokenComponent }, $$scope: {} },
    });
    expect(getByText('Something went wrong')).toBeInTheDocument();
  });
});
```

### 4. Snapshot Testing (Vitest)

Check for unexpected UI changes:

```typescript
import { render } from '@testing-library/svelte';
import CommandInput from '../command-input.svelte';

describe('Snapshots', () => {
  it('matches snapshot', () => {
    const { container } = render(CommandInput, { value: 'snap' });
    expect(container).toMatchSnapshot();
  });
});
```

Run with:

```bash
npx vitest -u # To update snapshots
```

### 5. Playwright: Visual Regression, File Upload, Network Interception

#### Visual Regression

1. Install Playwright Test for visual comparisons:

```bash
npm install -D @playwright/test
```

1. In your test:

```typescript
await expect(page).toHaveScreenshot('command-palette.png');
```

#### File Upload

```typescript
await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.pdf');
```

#### Network Interception/Mocking

```typescript
test('mocks API response', async ({ page }) => {
  await page.route('**/api/endpoint', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'mocked' }),
    });
  });
  await page.goto('/');
  // Assert UI uses mocked data
});
```

### 6. How to Interpret Advanced Results

- **Keyboard/Accessibility:**
  - Test passes if focus and ARIA roles behave as expected.
- **Mocked APIs:**
  - Ensure your UI displays data from the mock, not the real backend.
- **Error Boundaries:**
  - Fallback UI appears and error details are hidden from users.
- **Snapshots:**
  - Test fails if UI output changes unexpectedly; update snapshot if change is intentional.
- **Playwright Visual/Network:**
  - Visual diff failures show side-by-side images in the HTML report.
  - Network mocks ensure your E2E tests are deterministic and fast.

---

## Summary Table

| Tool       | Run Command                  | Results Location      | Coverage Report         |
|------------|------------------------------|----------------------|-------------------------|
| Vitest     | `npx vitest`                 | Terminal/UI          | `coverage/index.html`   |
| Playwright | `npx playwright test`        | Terminal/HTML Report | (E2E only, not coverage)|

---

For more advanced usage, refer to the [Vitest docs](https://vitest.dev/) and [Playwright docs](https://playwright.dev/).
