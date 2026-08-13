import path from 'path'
import { defineConfig } from 'prisma/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db'
  },
  migrate: {
    async adapter() {
      const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
      const libsql = createClient({ url: dbUrl })
      return new PrismaLibSql(libsql)
    },
  },
})
