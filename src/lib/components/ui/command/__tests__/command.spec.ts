import { render } from '@testing-library/svelte';
import Command from '../command.svelte';

describe('Command', () => {
  it('renders root dialog and container', () => {
    const { getByRole, container } = render(Command);
    expect(getByRole('dialog')).toBeInTheDocument();
    expect(container.querySelector('[data-cmdk-container]')).toBeInTheDocument();
  });

  it('renders slot content', () => {
    const { getByText } = render(Command, { $$slots: { default: '<span>Dialog Content</span>' }, $$scope: {} });
    expect(getByText('Dialog Content')).toBeInTheDocument();
  });
});
