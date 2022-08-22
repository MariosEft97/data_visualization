import { scaleLinear } from "d3-scale";
import { writable } from "svelte/store";

export const build_width = 700;
export const build_height = 50;
export const xScale = scaleLinear().domain([1,744]).range([0, build_width]);
export const yScale_perline = writable();
export const yScale_perlines = writable();
export const radioValue2 = writable();