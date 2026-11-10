import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  API_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(60),
  SESSION_SECRET: z.string().min(16).default('development-secret-key-32-chars-long!'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV ?? 'development',
    })
  }
  return result.data
}

export const env = validateEnv()
