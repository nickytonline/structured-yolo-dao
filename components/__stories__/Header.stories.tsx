import { Meta } from '@storybook/react';
import { Header } from '@components/Header';

const meta: Meta = {
  title: 'Components/Example Header',
  component: Header,
  argTypes: {},
};
export default meta;

export const Default: React.VFC = () => {
  return <Header />;
};
