/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Change Color Style - Choose how market gains and losses are highlighted. */
  "changeColorStyle": "green-up-red-down" | "red-up-green-down"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `display-markets` command */
  export type DisplayMarkets = ExtensionPreferences & {
  /** Only Show Trading Markets - Only show markets that are currently trading. */
  "showTradingOnly": boolean
}
  /** Preferences accessible in the `display-watchlist` command */
  export type DisplayWatchlist = ExtensionPreferences & {}
  /** Preferences accessible in the `display-watch-funds` command */
  export type DisplayWatchFunds = ExtensionPreferences & {}
  /** Preferences accessible in the `search-stock` command */
  export type SearchStock = ExtensionPreferences & {}
  /** Preferences accessible in the `configure-watchlist` command */
  export type ConfigureWatchlist = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `display-markets` command */
  export type DisplayMarkets = {}
  /** Arguments passed to the `display-watchlist` command */
  export type DisplayWatchlist = {}
  /** Arguments passed to the `display-watch-funds` command */
  export type DisplayWatchFunds = {}
  /** Arguments passed to the `search-stock` command */
  export type SearchStock = {}
  /** Arguments passed to the `configure-watchlist` command */
  export type ConfigureWatchlist = {}
}

