---
name: forgescript
description: Build, debug, and review Discord bots using @tryforge/forgescript. Use when setting up ForgeClient, writing prefix, slash, or event commands, using module.exports or .fs files, or writing ForgeScript ($function[...]) code.
license: MIT
metadata:
  author: botforge
  version: "1.0"
---

# ForgeScript Bot Development

Use this skill when building or modifying Discord bots powered by `@tryforge/forgescript`.

## Core Workflow

1. **Verify every `$function`'s `args` metadata and behavior.** Never guess `$function` names, parameter order, enum values, or callback semantics from memory. Look up full `args` metadata (not just signatures) using the BotForge MCP (`extensions` with `item_name` or `search`), and read the implementation via `forgescript` (`read`) whenever an argument's runtime behavior is ambiguous.
2. **Validate every ForgeScript snippet** with the BotForge MCP `validate` tool (`strict: true`) and format with `format` before presenting it.
3. **Check required intents and events.** Prefix commands need `events: ['messageCreate']` and `intents: ['Guilds', 'GuildMessages', 'MessageContent']`. Slash commands and components need `events: ['interactionCreate']` (or `applicationCommands.load(...)`) and do not require `MessageContent`.
4. **Match existing project conventions.** Follow the project's existing style for command exports (`module.exports` or `export default`; `.fs` files are deprecated—only use them if the project already does, and prefer `.js`/`.ts` for new code) and slash command `data` (plain JSON object vs `discord.js` `SlashCommandBuilder`).

## Project Setup (`ForgeClient`)

Most ForgeScript bots use CommonJS (`require` / `module.exports`) or TypeScript compiled to CommonJS because `FileReader` loads `.js` command files via `require()`:

```js
const { ForgeClient } = require('@tryforge/forgescript')

const client = new ForgeClient({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
  events: ['ready', 'messageCreate', 'interactionCreate'],
  prefixes: ['!'],
})

client.commands.load('./commands')
client.applicationCommands.load('./slash')

client.login(process.env.DISCORD_TOKEN)
```

- For `ForgeClient` options, `module.exports` vs `.fs` command files, events, and slash command folder trees (`config.json`, subcommands, subcommand groups), read [references/client-and-commands.md](references/client-and-commands.md).
- For a minimal starter project, see [assets/starter-bot/index.js](assets/starter-bot/index.js) and [assets/starter-bot/package.json](assets/starter-bot/package.json).

## Key ForgeScript Behaviors

- **0-based indexing:** Indexes start at `0`, not `1` (`$message[0]`, `$mentioned[0;true]`, `$arrayAt[arr;0]`, `$splitText[0]`).
- **Function operators (modifiers):**
  - `$!fn[...]` (**Negation**): Runs the function for side effects and suppresses its return value.
  - `$#fn[...]` (**Silent**): Suppresses the Discord error alert (`ctx.alert()`) and exits execution cleanly on failure (does not suppress console/Logger errors).
  - `$@[delimiter]fn[...]` (**Count**): Splits a string return value by `delimiter` and returns the number of parts (`0` if empty).
  - Combined order: `$!#@[count]fn[...]`.
- **Syntax & escaping:** Arguments are `;`-separated inside `[...]`. Escape literal `[`, `]`, `;`, or `\` with `\`.
- **Always-execute & dynamic prefixes:** Omitting `name` on a `messageCreate` command runs it on every message; `prefixes` entries are compiled as ForgeScript (so dynamic prefixes like `'$getGuildVar[prefix;!]'` work).
- **Variables & control flow:** Use `$let[key;value]` / `$get[key]`, `$onlyIf[condition;error]`, and `$if[condition;ifTrue;ifFalse]`.

Read [references/syntax-and-control-flow.md](references/syntax-and-control-flow.md) for syntax details and [references/ui-components.md](references/ui-components.md) for embeds, buttons, select menus, and modals.
