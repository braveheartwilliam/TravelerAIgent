import { render, fireEvent } from '@testing-library/svelte';
import CommandInput from '../command-input.svelte';

describe('CommandInput', () => {
  it('renders and updates value', async () => {
    const { getByRole } = render(CommandInput, { value: 'test' });
    const input = getByRole('textbox');
    expect(input).toHaveValue('test');

    await fireEvent.input(input, { target: { value: 'hello' } });
    expect(input).toHaveValue('hello');
  });

  it('calls onValueChange', async () => {
    const handle = vi.fn();
    const { getByRole, component } = render(CommandInput, { onValueChange: handle });
    const input = getByRole('textbox');
    await fireEvent.input(input, { target: { value: 'foo' } });
    expect(handle).toHaveBeenCalledWith('foo');
  });
});
