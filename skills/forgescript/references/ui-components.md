# Discord UI Components in ForgeScript

## Embeds

Embed builder functions attach to the outgoing response in the current command context:

```fs
$title[Server Info]
$description[Welcome to **$guildName**!]
$addField[Members;$guildMemberCount;true]
$addField[Created;<t:$truncate[$divide[$guildCreatedAt;1000]]:R>;true]
$color[#5865F2]
$footer[Requested by $username;$userAvatar[$authorID]]
```

## Action Rows & Buttons

Call `$addActionRow` before adding up to 5 buttons per row:

```fs
$title[Your Avatar]
$image[$userAvatar[$authorID;1024]]
$addActionRow
$addButton[$userAvatar[$authorID;256];256px;Link]
$addButton[$userAvatar[$authorID;512];512px;Link]
$addButton[$userAvatar[$authorID;1024];1024px;Link]
```

For interactive buttons (non-Link styles like `Primary`, `Secondary`, `Success`, `Danger`), pass a `customID` as the first argument and handle clicks in an `interactionCreate` command with `allowedInteractionTypes: ['button']` and matching `name`.

## Select Menus

```fs
$addActionRow
$addStringSelectMenu[role_picker;Pick a role;1;1;false]
$addOption[Announcements;Get release alerts;announcements]
$addOption[Events;Get community event pings;events]
```

## Modals

Trigger a modal from a slash command or button interaction with `$modal[customID;title]`, `$addTextInput[customID;label;style;required?;placeholder?;value?;minLength?;maxLength?]`, and `$showModal`, then handle submission in an `interactionCreate` command with `allowedInteractionTypes: ['modal']`.

Always verify exact parameter order with the BotForge MCP `search` or `extensions` tool before using unfamiliar UI functions.
