import { render } from '@testing-library/svelte';
import CommandSeparator from '../command-separator.svelte';

describe('CommandSeparator', () => {
  it('renders an hr element', () => {
    const { container } = render(CommandSeparator);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
    expect(hr).toHaveAttribute('data-cmdk-separator', '');
  });
});
