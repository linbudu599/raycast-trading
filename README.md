# raycast-trading

A [Raycast](https://www.raycast.com/) extension for trading — view market status, manage your watch list, and configure tracked symbols.

## Commands

| Command                  | Description                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **Display Markets**      | Shows live market quotes (via Longbridge CLI) with session status and drill-down details |
| **Display Watch List**   | Shows your personal watch list                                                           |
| **Display Watch Funds**  | Shows watched Mainland China fund NAV performance                                        |
| **Search Stock**         | Searches stock quotes with trading session status                                        |
| **Configure Watch List** | Add or remove symbols from your watch list                                               |

## Settings

### Extension preferences

| Preference            | Type     | Description                                          | Default               |
| --------------------- | -------- | ---------------------------------------------------- | --------------------- |
| **Change Color Style** | Dropdown | How market gains and losses are highlighted          | Green Up / Red Down   |

The **Change Color Style** preference has two options:

- **Green Up / Red Down** — gains shown in green, losses in red (Western convention)
- **Red Up / Green Down** — gains shown in red, losses in green (East Asian convention)

### Display Markets preferences

| Preference                    | Type     | Description                                   | Default |
| ----------------------------- | -------- | --------------------------------------------- | ------- |
| **Only Show Trading Markets** | Checkbox | Hide markets that are not currently in session | Off     |

## Prerequisites

- [Raycast](https://www.raycast.com/) installed on macOS
- [Node.js](https://nodejs.org/) ≥ 22
- [pnpm](https://pnpm.io/) ≥ 10
- [Longbridge CLI](https://open.longportapp.com/docs) — required by the **Display Markets** command to fetch live quotes

Install pnpm if needed:

```bash
npm install -g pnpm
```

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/linbudu599/raycast-trading.git
   cd raycast-trading
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   This runs `ray develop`, which compiles the extension and hot-reloads on file changes. Open Raycast (`⌘ Space`) and search for any of the commands above.

> **Tip:** If commands don't appear in Raycast, make sure `pnpm dev` is still running. Check the terminal for build errors or Raycast validation messages.

## Build and publish

```bash
# Type-check and lint before building
pnpm typecheck
pnpm lint

# Compile into dist/ for Raycast Store submission
pnpm build

# Publish to the Raycast Store
pnpm release
```

## Development notes

- Source files live in `src/`. Each file matching a `name` in `package.json`'s `commands` array is the entry point for that command.
- The extension uses [`@raycast/api`](https://developers.raycast.com/api-reference) for all UI primitives.
- **Display Markets** fetches real-time data by invoking the `longbridge` CLI. All other commands use bundled demo data.
