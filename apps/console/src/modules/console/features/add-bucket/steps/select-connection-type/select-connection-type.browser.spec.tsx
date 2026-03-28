import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { createMockOrpcClient, DialogTestWrapper } from '@/test/browser';
import { SelectConnectionTypeStep } from './select-connection-type';

describe('SelectConnectionTypeStep', () => {
  it('Next button disabled initially (no radio selected)', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <SelectConnectionTypeStep onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await expect.element(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('clicking "Use existing connection" enables Next', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <SelectConnectionTypeStep onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await screen.getByText('Use existing connection').click();
    await expect.element(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('clicking "Add new connection" enables Next', async () => {
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <SelectConnectionTypeStep onNext={vi.fn()} />
      </DialogTestWrapper>
    );

    await screen.getByText('Add new connection').click();
    await expect.element(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('clicking Next calls onNext with correct type', async () => {
    const onNext = vi.fn();
    const screen = await render(
      <DialogTestWrapper mockOrpc={createMockOrpcClient()}>
        <SelectConnectionTypeStep onNext={onNext} />
      </DialogTestWrapper>
    );

    await screen.getByText('Use existing connection').click();
    await screen.getByRole('button', { name: 'Next' }).click();

    expect(onNext).toHaveBeenCalledWith('existing');
  });
});
