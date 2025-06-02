import { render, fireEvent } from '@testing-library/svelte';
import CommandItem from '../command-item.svelte';

describe('CommandItem', () => {
  it('renders slot content', () => {
    const { getByText } = render(CommandItem, { $$slots: { default: '<span>Item</span>' }, $$scope: {} });
    expect(getByText('Item')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', async () => {
    const handle = vi.fn();
    const { getByRole } = render(CommandItem, { value: 'foo', onSelect: handle });
    const option = getByRole('option');
    await fireEvent.click(option);
    expect(handle).toHaveBeenCalledWith('foo');
  });

  it('does not call onSelect if disabled', async () => {
    const handle = vi.fn();
    const { getByRole } = render(CommandItem, { value: 'bar', onSelect: handle, disabled: true });
    const option = getByRole('option');
    await fireEvent.click(option);
    expect(handle).not.toHaveBeenCalled();
  });
});
