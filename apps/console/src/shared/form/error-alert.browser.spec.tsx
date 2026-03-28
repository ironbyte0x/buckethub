import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { ErrorAlert } from './error-alert';

describe('ErrorAlert', () => {
  it('show={false} - alert not visible', async () => {
    const screen = await render(
      <ErrorAlert show={false} title="Error" description="Something went wrong" />
    );

    await expect.element(screen.getByRole('alert')).not.toBeInTheDocument();
  });

  it('show={true} - alert visible with title, description, and role="alert"', async () => {
    const screen = await render(
      <ErrorAlert show={true} title="Error Title" description="Error description text" />
    );

    await expect.element(screen.getByRole('alert')).toBeVisible();
    await expect.element(screen.getByText('Error Title')).toBeVisible();
    await expect.element(screen.getByText('Error description text')).toBeVisible();
  });
});
