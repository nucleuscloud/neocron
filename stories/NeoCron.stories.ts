import NeoCron from "@/src/NeoCron";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "NeoCron",
  component: NeoCron,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["neocron"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof NeoCron>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NeoCronC: Story = {};
