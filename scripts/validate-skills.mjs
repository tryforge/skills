import fs from 'node:fs'
import path from 'node:path'

const SKILLS_DIR = path.resolve(import.meta.dirname, '../skills')
const NAME_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return null

  const rawYaml = match[1]
  const body = match[2]
  const fields = {}
  let currentKey = null

  for (const line of rawYaml.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const topMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (topMatch) {
      currentKey = topMatch[1]
      const val = topMatch[2].trim()
      fields[currentKey] = val.replace(/^['"]|['"]$/g, '')
    } else if (currentKey && /^\s+/.test(line)) {
      // Nested mapping (e.g., metadata)
      fields[currentKey] = fields[currentKey] || {}
    }
  }

  return { fields, body }
}

let errors = 0
function fail(msg) {
  console.error(`ERROR: ${msg}`)
  errors += 1
}

if (!fs.existsSync(SKILLS_DIR)) {
  fail(`Missing skills directory: ${SKILLS_DIR}`)
  process.exit(1)
}

const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())
if (entries.length === 0) {
  fail('No skill directories found under skills/')
}

for (const entry of entries) {
  const dirName = entry.name
  const skillDir = path.join(SKILLS_DIR, dirName)
  const skillFile = path.join(skillDir, 'SKILL.md')

  if (!fs.existsSync(skillFile)) {
    fail(`${dirName}: missing SKILL.md`)
    continue
  }

  const content = fs.readFileSync(skillFile, 'utf8')
  const parsed = parseFrontmatter(content)
  if (!parsed) {
    fail(`${dirName}/SKILL.md: missing or invalid YAML frontmatter`)
    continue
  }

  const { name, description, compatibility } = parsed.fields
  if (!name) {
    fail(`${dirName}/SKILL.md: missing required "name" field`)
  } else {
    if (name !== dirName) {
      fail(`${dirName}/SKILL.md: "name" (${name}) must match directory name (${dirName})`)
    }
    if (name.length > 64) {
      fail(`${dirName}/SKILL.md: "name" exceeds 64 characters (${name.length})`)
    }
    if (!NAME_REGEX.test(name)) {
      fail(`${dirName}/SKILL.md: "name" (${name}) must be lowercase alphanumeric + single hyphens`)
    }
  }

  if (!description) {
    fail(`${dirName}/SKILL.md: missing required "description" field`)
  } else if (description.length > 1024) {
    fail(`${dirName}/SKILL.md: "description" exceeds 1024 characters (${description.length})`)
  }

  if (compatibility && compatibility.length > 500) {
    fail(`${dirName}/SKILL.md: "compatibility" exceeds 500 characters (${compatibility.length})`)
  }

  const bodyLines = parsed.body.split(/\r?\n/).length
  if (bodyLines > 500) {
    fail(`${dirName}/SKILL.md: body exceeds 500 lines (${bodyLines} lines)`)
  }

  // Verify any relative links to references/ or assets/ exist
  const linkMatches = parsed.body.matchAll(/\]\(((?:references|assets|scripts)\/[^)#\s]+)\)/g)
  for (const m of linkMatches) {
    const target = path.join(skillDir, m[1])
    if (!fs.existsSync(target)) {
      fail(`${dirName}/SKILL.md: broken relative link "${m[1]}"`)
    }
  }

  console.log(`OK: ${dirName} (${bodyLines} body lines, description ${description?.length ?? 0} chars)`)
}

if (errors > 0) {
  console.error(`\nValidation failed with ${errors} error(s).`)
  process.exit(1)
}

console.log(`\nValidated ${entries.length} skill(s) successfully.`)
