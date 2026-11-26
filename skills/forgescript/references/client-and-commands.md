# ForgeClient, Commands, Events & Slash Command Trees

## `ForgeClient` Options (`IRawForgeClientOptions`)

`ForgeClient` extends `discord.js` `ClientOptions`:

- `intents` (required): Array of `GatewayIntentBits` or intent names.
- `events`: `CommandType[]` (keys of `discord.js` `ClientEvents`, e.g. `['ready', 'messageCreate', 'interactionCreate']`).
- `prefixes`: `string[]` for prefix commands. Each entry is compiled as ForgeScript, so you can use functions for dynamic per-guild or mention prefixes (e.g. `['!', '<@$botID>', '$getGuildVar[prefix;!]']`).
- `prefixCaseInsensitive`: `boolean` (default `false`).
- `commands`: `string` folder path to auto-load commands.
- `functions`: `string` folder path to auto-load custom ForgeScript functions.
- `extensions`: `ForgeExtension[]` array of BotForge extensions (e.g. `new ForgeDB()`).
- `allowBots`: `boolean` (default `false`).
- `respondOnEdit`: `boolean | number` (default `false`; if number, max message age in ms).
- `trackers`: `{ invites?: boolean; voice?: boolean }`.
- `restrictions`: `{ guildIDs?: string[]; userIDs?: string[] }`.
- `mobile`: `boolean` (default `false`).

## Events

Every command's `type` corresponds to a Discord event (e.g. `'messageCreate'`, `'ready'`, `'guildMemberAdd'`, `'interactionCreate'`).

- **You must list the event in `ForgeClient({ events: [...] })`** for the bot to listen to it. If a loaded command uses an event not listed in `events`, `BaseCommandManager` logs a warning and the command will not fire.
- **Exception:** `ApplicationCommandManager` automatically registers `interactionCreate` when slash commands are registered.

## Adding Commands

### 1. `.js` Files (`module.exports` / `export default`)

`client.commands.load('./commands')` recursively loads `.js` and `.fs` files. For `.js` files, `FileReader` uses `require()`, so standard CommonJS `module.exports` (or TypeScript compiled to CommonJS) is the standard pattern:

```js
const { PrefixMode } = require('@tryforge/forgescript')

module.exports = {
  name: 'ping',
  aliases: ['p'],
  type: 'messageCreate',
  guildOnly: false,
  prefixMode: PrefixMode.Required, // Required (0), Optional (1), None (2)
  code: `$sendMessage[$channelID;Pong! $pingms]`,
}
```

A single `.js` file can also export an array of commands (`module.exports = [cmd1, cmd2]`).

### 2. `.fs` Files (Native ForgeScript Format — Deprecated)

> **Warning:** `.fs` files are deprecated. Prefer standard `.js` / `.ts` command files (`module.exports` or `export default`) unless maintaining an existing `.fs` codebase.

`.fs` files use `[property]` blocks without JavaScript boilerplate:

```text
[name]
ping
[type]
messageCreate
[code]
$sendMessage[$channelID;Pong! $pingms]
```

### 3. Inline Commands (`client.commands.add(...)`)

```js
client.commands.add({
  type: 'ready',
  code: `$log[Logged in as $username[$botID]]`,
})
```

### 4. Interaction Commands (`allowedInteractionTypes`)

For buttons, modals, and select menus handled via `interactionCreate`, set `allowedInteractionTypes` and `name` (matched against `customId`):

```js
module.exports = {
  name: 'ticket_close',
  type: 'interactionCreate',
  allowedInteractionTypes: ['button'],
  code: `$interactionReply[$ephemeral Ticket closed.]`,
}
```

Valid `allowedInteractionTypes` values (check `dist/structures/base/BaseCommand.d.ts` via the BotForge MCP `forgescript` tool or local `node_modules` for newer versions): `'button'`, `'modal'`, `'slashCommand'`, `'autocomplete'`, `'contextMenu'`, `'userContextMenu'`, `'messageContextMenu'`, `'selectMenu'`, `'userSelectMenu'`, `'roleSelectMenu'`, `'channelSelectMenu'`, `'mentionableSelectMenu'`, `'activityCommand'`, `'messageComponent'`.

### 5. Special Command Behaviors

- **Always-execute commands (omit `name`):** Leaving `name` undefined or empty on a `messageCreate` (or any event) command runs it on **every** event regardless of prefix or command name. Useful for XP/leveling, AFK checks, or auto-responders.
- **`prefixMode` (replaces legacy `unprefixed`):**
  - `PrefixMode.Required` (`0`, default): Requires a matching prefix.
  - `PrefixMode.Optional` (`1`): Runs both with and without a prefix.
  - `PrefixMode.None` (`2`): Runs only when no prefix is present (note: `args[0]` is the matched word itself).
- **`allowBots`:** Bots (including the bot itself) are ignored by default; set `allowBots: true` on `ForgeClient` or per command to opt in.

## Slash Commands & Folder Tree (`client.applicationCommands.load`)

`applicationCommands.load('./slash')` loads `.js` files only (one command per file; exporting an array is disallowed). **Folder depth defines the Discord slash command hierarchy:**

```text
slash/
├── ping.js                  -> /ping
└── admin/
    ├── config.json          -> { "description": "Admin commands" }
    ├── ban.js               -> /admin ban
    └── user/
        ├── config.json      -> { "description": "User moderation" }
        └── kick.js          -> /admin user kick
```

- **Max depth is 2 folders** (command -> subcommand group -> subcommand). A 3rd nested folder throws an error.
- **`config.json`:** Optional file inside a folder to set `description` (defaults to `"none"`) or permissions for that command/group.
- **`independent: true`:** Set on a command inside a subfolder to register it as a top-level command instead of a subcommand.
- **Style consistency:** `data` accepts either a `discord.js` `SlashCommandBuilder` / `ContextMenuCommandBuilder` or a plain JSON object (`RESTPostAPIApplicationCommandsJSONBody`). **Match whichever style the user's project already uses** (and likewise match `module.exports` vs `export default` or `.fs` files).
- **Registration:**

```js
// Plain JSON object style (no discord.js builder needed)
const { RegistrationType } = require('@tryforge/forgescript')

module.exports = {
  type: RegistrationType.Global, // Global (0), Guild (1), All (2)
  data: {
    name: 'avatar',
    description: 'Show a user avatar',
    options: [
      {
        name: 'user',
        description: 'Target user',
        type: 6, // ApplicationCommandOptionType.User
        required: false,
      },
    ],
  },
  code: `
    $let[target;$if[$option[user]!=;$option[user];$authorID]]
    $title[Avatar]
    $image[$userAvatar[$get[target];1024]]
  `,
}
```

Or using `SlashCommandBuilder`:

```js
const { RegistrationType } = require('@tryforge/forgescript')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  type: RegistrationType.Global,
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show a user avatar')
    .addUserOption((opt) =>
      opt.setName('user').setDescription('Target user').setRequired(false)
    ),
  code: `
    $let[target;$if[$option[user]!=;$option[user];$authorID]]
    $title[Avatar]
    $image[$userAvatar[$get[target];1024]]
  `,
}
```
