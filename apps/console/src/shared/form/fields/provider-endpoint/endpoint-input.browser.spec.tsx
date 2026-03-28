import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { ProviderEndpointInput } from './endpoint-input';

describe('ProviderEndpointInput', () => {
  it('typing text updates value via onChange', async () => {
    const onChange = vi.fn();
    const screen = await render(<ProviderEndpointInput value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');

    await expect.element(input).toBeVisible();
    await input.click();
    await userEvent.keyboard('https://example.com');

    expect(onChange).toHaveBeenCalled();
  });

  it('Enter key is prevented (no line breaks)', async () => {
    const onChange = vi.fn();
    const screen = await render(<ProviderEndpointInput value="test" onChange={onChange} />);

    const input = screen.getByRole('textbox');

    await expect.element(input).toBeVisible();
    await input.click();
    await userEvent.keyboard('{Enter}');

    const element = input.element();

    expect(element.innerHTML).not.toContain('<br');
    expect(element.innerHTML).not.toContain('<div');
  });

  it('clicking provider tag button fills endpoint template and calls onChange', async () => {
    const onChange = vi.fn();
    const screen = await render(<ProviderEndpointInput value="" onChange={onChange} />);

    await screen.getByRole('button', { name: 'AWS' }).click();

    expect(onChange).toHaveBeenCalledWith('https://s3.amazonaws.com');
  });

  it('placeholders like {region} are rendered as <mark> elements', async () => {
    const screen = await render(
      <ProviderEndpointInput value="https://s3.{region}.wasabisys.com" onChange={vi.fn()} />
    );

    const input = screen.getByRole('textbox');

    await expect.element(input).toBeVisible();

    const marks = input.element().querySelectorAll('mark');

    expect(marks.length).toBe(1);
    expect(marks[0].textContent).toBe('{region}');
  });

  it('disabled prop sets contentEditable to false', async () => {
    const screen = await render(<ProviderEndpointInput value="test" disabled onChange={vi.fn()} />);

    const input = screen.getByRole('textbox');

    await expect.element(input).toBeVisible();

    const element = input.element();

    if (!(element instanceof HTMLElement)) {
      throw new Error('Input element is not an HTMLElement');
    }

    expect(element.contentEditable).toBe('false');
  });

  it('error prop sets aria-invalid', async () => {
    const screen = await render(<ProviderEndpointInput value="test" error onChange={vi.fn()} />);

    const input = screen.getByRole('textbox');

    await expect.element(input).toBeVisible();
    expect(input.element().getAttribute('aria-invalid')).toBe('true');
  });
});
