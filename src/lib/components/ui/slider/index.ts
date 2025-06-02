import Slider from "./slider.svelte";

export { Slider };

export type SliderProps = {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  class?: string;
};
