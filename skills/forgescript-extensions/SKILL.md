---
name: forgescript-extensions
description: Install, configure, and use official and community BotForge extensions with @tryforge/forgescript. Use when adding databases (ForgeDB), canvas image generation (ForgeCanvas), music (ForgeMusic, ForgeLinked), giveaways, Top.gg, or Minecraft integrations.
license: MIT
metadata:
  author: botforge
  version: "1.0"
---

# ForgeScript Extensions

Use this skill when extending a `@tryforge/forgescript` bot with BotForge extensions.

## Wiring Extensions into `ForgeClient`

Install the extension package alongside `@tryforge/forgescript`, instantiate it, and pass it in the `extensions` array of `ForgeClient`:

```js
const { ForgeClient } = require('@tryforge/forgescript')
const { ForgeDB } = require('@tryforge/forge.db')

const client = new ForgeClient({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
  events: ['ready', 'messageCreate', 'interactionCreate'],
  prefixes: ['!'],
  extensions: [new ForgeDB()],
})
```

## Guidelines

1. **Verify extension functions before writing code.** Call the BotForge MCP `extensions` tool with `name: "<extension-id>"` and `resource: "functions"` (or `events` / `enums`) to inspect exact signatures.
2. **Check extension-specific intents.** Voice extensions such as `ForgeMusic` and `ForgeLinked` require `GuildVoiceStates` in `ForgeClient.intents`.
3. **Check extension events.** Extensions that emit custom events (like `ForgeDB` or `ForgeTopGG`) expose event handlers loaded via their own command manager or `ForgeClient` configuration; inspect the extension's `events` resource or guides on `https://docs.botforge.org` before writing event listeners.

For the full list of extensions, npm package names, and required intents, read [references/extensions-catalog.md](references/extensions-catalog.md).
