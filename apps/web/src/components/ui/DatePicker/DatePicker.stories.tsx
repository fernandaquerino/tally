import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";

import { DatePicker, type DatePickerPresetRange } from "./DatePicker";

const reference = new Date(2026, 5, 9); // 9 Jun 2026

const rangePresets: DatePickerPresetRange[] = [
  {
    label: "Este mês",
    value: { from: startOfMonth(reference), to: endOfMonth(reference) },
  },
  {
    label: "Últimos 30 dias",
    value: { from: subDays(reference, 29), to: reference },
  },
  {
    label: "Este ano",
    value: { from: startOfYear(reference), to: endOfYear(reference) },
  },
];

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    mode: "single",
    defaultValue: reference,
    defaultMonth: reference,
  },
};

export const Range: Story = {
  args: {
    mode: "range",
    defaultValue: { from: new Date(2026, 5, 5), to: reference },
    defaultMonth: reference,
  },
};

export const RangeWithPresets: Story = {
  args: {
    mode: "range",
    defaultMonth: reference,
    defaultValue: { from: startOfMonth(reference), to: endOfMonth(reference) },
    presets: rangePresets,
  },
};

export const WithDisabledDays: Story = {
  args: {
    mode: "single",
    defaultMonth: reference,
    disabled: { dayOfWeek: [0, 6] },
  },
};
