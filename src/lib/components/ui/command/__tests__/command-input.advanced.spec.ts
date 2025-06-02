import { render, fireEvent } from '@testing-library/svelte';
import CommandInput from '../command-input.svelte';

describe('CommandInput – Advanced', () => {
  it('is accessible by role', () => {
    const { getByRole } = render(CommandInput);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('has correct placeholder and disabled states', () => {
    const { getByPlaceholderText, getByRole } = render(CommandInput, { placeholder: 'Type…', disabled: true });
    expect(getByPlaceholderText('Type…')).toBeDisabled();
    expect(getByRole('textbox')).toHaveAttribute('disabled');
  });

  it('applies custom className', () => {
    const { getByRole } = render(CommandInput, { class: 'custom-class' });
    expect(getByRole('textbox').className).toMatch(/custom-class/);
  });

  it('handles rapid input changes', async () => {
    const handle = vi.fn();
    const { getByRole } = render(CommandInput, { onValueChange: handle });
    const input = getByRole('textbox');
    for (const value of ['a', 'ab', 'abc']) {
      await fireEvent.input(input, { target: { value } });
    }
    expect(handle).toHaveBeenCalledTimes(3);
    expect(handle).toHaveBeenLastCalledWith('abc');
  });
});
