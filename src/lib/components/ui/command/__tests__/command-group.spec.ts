import { render } from '@testing-library/svelte';
import CommandGroup from '../command-group.svelte';

describe('CommandGroup', () => {
  it('renders with heading', () => {
    const { getByText, getByRole } = render(CommandGroup, { heading: 'Group 1' });
    expect(getByText('Group 1')).toBeInTheDocument();
    expect(getByRole('group')).toBeInTheDocument();
  });

  it('renders slot content', () => {
    const { getByText } = render(CommandGroup, { heading: 'Group 2', $$slots: { default: '<div>Slot Content</div>' }, $$scope: {} });
    expect(getByText('Slot Content')).toBeInTheDocument();
  });
});
