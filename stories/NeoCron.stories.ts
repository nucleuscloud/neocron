import type { Meta, StoryObj } from "@storybook/react";
import Cron from "@/components/ui/Cron/Cron";

const meta = {
  title: "NeoCron",
  component: Cron,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["neocron"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof Cron>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NeoCron: Story = {};
