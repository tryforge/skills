# ForgeScript Syntax, Operators & Control Flow

## Function Syntax

- Zero-argument functions: `$authorID`, `$username`, `$guildID`, `$channelID`
- Parameterized functions: `$fn[arg1;arg2;arg3]`
- Optional arguments: leave empty slots (`$userAvatar[$authorID;;png]`) or omit trailing optional arguments.
- Nested calls: `$title[Hello, $username[$authorID]!]`

## 0-Based Indexing

Unlike 1-based bot scripting languages, **ForgeScript indexes start at `0`**:

- `$message[0]` returns the first word/argument after the command name (omitting brackets, `$message` returns the full argument string).
- `$mentioned[0;true]` returns the first mentioned user ID, or falls back to `$authorID` when `return author` is `true`.
- `$arrayAt[myArray;0]` returns the first element of an array.
- `$splitText[0]` returns the first segment after `$textSplit[...]`.

## Function Operators (Modifiers)

ForgeScript supports three prefix operators right after `$` (in the order `$!#@[count]name`):

| Operator | Syntax | Behavior |
| :--- | :--- | :--- |
| **Negation** | `$!fn[...]` | Executes the function normally but suppresses its return value from the output. Useful for functions like `$!clearMessages[$channelID;10]` or `$!sendMessage[...]` when you do not want the returned ID/count printed. |
| **Silent** | `$#fn[...]` | Silences errors thrown by the function and exits execution cleanly instead of logging/failing. |
| **Count** | `$@[delimiter]fn[...]` | Splits a string return value by `delimiter` and returns the number of parts (`0` if empty). |

## Escaping Special Characters

Because `[`, `]`, `;`, and `\` are syntax delimiters, escape them with `\` when you need them as literal text inside an argument:

```fs
$description[Use \; to include a literal semicolon and \[brackets\] safely.]
```

## Local Variables (`$let` / `$get`)

Store intermediate values within a single command execution using `$let` and read them with `$get`:

```fs
$let[target;$mentioned[0;true]]
$let[avatar;$userAvatar[$get[target];1024]]
$title[Avatar]
$image[$get[avatar]]
```

## Guards (`$onlyIf`)

Use `$onlyIf[condition;error]` to abort execution early with a reply when a precondition fails:

```fs
$onlyIf[$hasPerms[$guildID;$authorID;ManageMessages];You need the Manage Messages permission.]
$!clearMessages[$channelID;10]
$sendMessage[$channelID;Cleared 10 messages.]
```

## Conditionals (`$if[condition;ifTrue;ifFalse]`)

Supported comparison operators inside condition fields: `==`, `!=`, `<=`, `>=`, `<`, `>`.

```fs
$onlyIf[$isBot[$authorID]==false;]
$if[$guildID==;$sendMessage[$channelID;This command only works in a server.];$sendMessage[$channelID;Hello from $guildName!]]
```
