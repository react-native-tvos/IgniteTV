// TODO: write documentation for colors and palette in own markdown file and add links from here

import { Platform } from "react-native"

const palette = {
  neutral100: Platform.isTV ? "#121212" : "#FFFFFF",
  neutral200: Platform.isTV ? "#282828" : "#F4F2F1",
  neutral300: Platform.isTV ? "#3f3f3f" : "#D7CEC9",
  neutral400: Platform.isTV ? "#575757" : "#B6ACA6",
  neutral500: Platform.isTV ? "#717171" : "#978F8A",
  neutral600: Platform.isTV ? "#8b8b8b" : "#564E4A",
  neutral700: Platform.isTV ? "#D7CEC9" : "#3C3836",
  neutral800: Platform.isTV ? "#F4F2F1" : "#191015",
  neutral900: Platform.isTV ? "#FFFFFF" : "#000000",

  primary100: Platform.isTV ? "#382bf0" : "#F4E0D9",
  primary200: Platform.isTV ? "#5e43f3" : "#E8C1B4",
  primary300: Platform.isTV ? "#7a5af5" : "#DDA28E",
  primary400: Platform.isTV ? "#9171f8" : "#D28468",
  primary500: Platform.isTV ? "#a688fa" : "#C76542",
  primary600: Platform.isTV ? "#ba9ffb" : "#A54F31",

  secondary100: Platform.isTV ? "#ba9ffb" : "#DCDDE9",
  secondary200: Platform.isTV ? "#ba9ffb" : "#BCC0D6",
  secondary300: Platform.isTV ? "#ba9ffb" : "#9196B9",
  secondary400: Platform.isTV ? "#ba9ffb" : "#626894",
  secondary500: Platform.isTV ? "#ba9ffb" : "#41476E",

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",

  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral700,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
