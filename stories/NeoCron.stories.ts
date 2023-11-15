import type { Meta, StoryObj } from '@storybook/react';
import NeoCron from '../src/NeoCron';

const meta = {
  title: 'NeoCron',
  component: NeoCron,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['neocron'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NeoCron>;

export default meta;
type Story = StoryObj<typeof meta>;

// Define the default args for your story
const defaultArgs = {
  cronString: '* * * * *', // Default cron string
  defaultCronString: '* * * * *',
  setCronString: (val: string) => console.log(val), // Dummy function for demonstration
  disableInput: false,
  disableSelectors: false,
  disableExplainerText: false,
  selectorText: 'Run every',
};

export const NeoCronC: Story = { args: defaultArgs };
