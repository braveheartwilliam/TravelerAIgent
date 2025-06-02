import { render } from '@testing-library/svelte';
import CommandShortcut from '../command-shortcut.svelte';

describe('CommandShortcut', () => {
  it('renders slot content', () => {
    const { getByText } = render(CommandShortcut, { $$slots: { default: '<kbd>⌘K</kbd>' }, $$scope: {} });
    expect(getByText('⌘K')).toBeInTheDocument();
  });
});
