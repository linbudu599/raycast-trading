# raycast-trading

A [Raycast](https://www.raycast.com/) extension for trading — view market status, manage your watch list, and configure tracked symbols.

## Commands

| Command | Description |
|---|---|
| **Display Markets** | Shows market quotes and drill-down details |
| **Display Watch List** | Shows your personal watch list |
| **Display Watch Funds** | Shows watched Mainland China fund NAV performance |
| **Search Stock** | Searches mock stock quotes with trading session status |
| **Configure Watch List** | Add or remove symbols from your watch list |

## Prerequisites

- [Raycast](https://www.raycast.com/) installed on macOS
- [Node.js](https://nodejs.org/) ≥ 22
- [pnpm](https://pnpm.io/) ≥ 10

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

   This runs `ray develop`, which compiles the extension and hot-reloads on file changes.

## Running in Raycast

1. Open Raycast (`⌘ Space` by default).
2. Search for one of the commands:
   - **Display Markets**
   - **Display Watch List**
   - **Display Watch Funds**
   - **Search Stock**
   - **Configure Watch List**
3. Press `↵` to run the selected command.

> **Tip:** If the commands don't appear, make sure `pnpm dev` is running. Raycast automatically discovers extensions that are being developed locally.

## Build for production

```bash
pnpm build
```

This compiles the extension into the `dist/` folder and makes it ready for submission to the [Raycast Store](https://www.raycast.com/store).

## Publish

```bash
pnpm release
```

This runs `ray publish`.

## Development notes

- Source files live in `src/`. Each file that matches a `name` in `package.json`'s `commands` array is the entry point for that command.
- The extension uses [`@raycast/api`](https://developers.raycast.com/api-reference) for all UI primitives.
