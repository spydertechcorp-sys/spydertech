const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

// Replace @default(ENUM_VALUE) with @default("ENUM_VALUE")
schema = schema.replace(/@default\(([A-Z_]+)\)/g, '@default("$1")')

fs.writeFileSync('prisma/schema.prisma', schema)
