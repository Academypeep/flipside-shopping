import { marketplaceStore } from '../lib/db/marketplace-store'
import { CreateRequestInputSchema, CreateOfferInputSchema } from '../lib/db/types'
import { rateLimiter } from '../lib/rate-limit'

async function runTests() {
  console.log('🧪 Starting Flipside Marketplace automated test suite...\n')

  let passed = 0
  let failed = 0

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`)
      passed++
    } else {
      console.error(`  ❌ FAIL: ${testName}`)
      failed++
    }
  }

  // Test 1: Store list pagination & filtering
  const all = await marketplaceStore.list()
  assert(all.items.length > 0, 'Store returns pre-seeded requests')
  assert(all.total >= 6, 'Store total count is accurate')

  const elec = await marketplaceStore.list({ category: 'Electronics' })
  assert(elec.items.every((i) => i.category === 'Electronics'), 'Category filter properly filters Electronics')

  const search = await marketplaceStore.list({ query: 'MacBook' })
  assert(search.items.length === 1 && search.items[0].title.includes('MacBook'), 'Search query returns matching records')

  // Test 2: Zod Validation
  const validReq = CreateRequestInputSchema.safeParse({
    title: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    location: 'Nairobi, KE',
    budget: 'KES 110,000',
  })
  assert(validReq.success === true, 'Valid request input passes schema validation')

  const invalidReq = CreateRequestInputSchema.safeParse({
    title: 'ab', // too short
    category: 'InvalidCat',
    budget: '',
  })
  assert(invalidReq.success === false, 'Invalid input fails schema validation')

  // Test 3: Creation and persistence
  const created = await marketplaceStore.create({
    title: 'Sony PlayStation 5 Slim',
    category: 'Electronics',
    location: 'Eldoret, KE',
    budget: 'KES 68,000',
  })
  assert(created.id > 0, 'Created request receives unique ID')
  assert(created.title === 'Sony PlayStation 5 Slim', 'Created request persists title')

  const retrieved = await marketplaceStore.findById(created.id)
  assert(retrieved !== null && retrieved.id === created.id, 'Created request is retrievable by ID')

  // Test 4: Counter offer submission
  const validOffer = CreateOfferInputSchema.safeParse({
    amount: 67000,
    sellerName: 'GamingHub Kenya',
    notes: 'Brand new sealed with warranty',
  })
  assert(validOffer.success === true, 'Valid offer input passes validation')

  const offer = await marketplaceStore.addOffer(created.id, {
    amount: 67000,
    sellerName: 'GamingHub Kenya',
  })
  assert(typeof offer.id === 'string', 'Offer returns valid UUID')

  const offers = await marketplaceStore.getOffers(created.id)
  assert(offers.length === 1 && offers[0].amount === 67000, 'Offer properly attached to request')

  const updatedReq = await marketplaceStore.findById(created.id)
  assert(updatedReq?.offers === 1, 'Request offer count incremented')

  // Test 5: Sliding window rate limiter
  const key = `test_client_${Date.now()}`
  for (let i = 0; i < 5; i++) {
    rateLimiter.check(key, 5, 1000)
  }
  const blocked = rateLimiter.check(key, 5, 1000)
  assert(blocked.success === false && blocked.remaining === 0, 'Rate limiter blocks after threshold is reached')

  // 7. Test Sanitization
  const { sanitizeText } = await import('../lib/sanitize')
  const dirty = '<script>alert("xss")</script>Hello & goodbye'
  const clean = sanitizeText(dirty)
  assert(!clean.includes('<script>') && clean.includes('&lt;script&gt;'), 'Input sanitization escapes HTML tags')

  // 8. Test Idempotency Store
  const { idempotencyStore } = await import('../lib/idempotency')
  const idemKey = 'test-idem-key-1'
  idempotencyStore.setInFlight(idemKey)
  assert(idempotencyStore.checkInFlight(idemKey) === true, 'Idempotency marks in-flight requests')
  idempotencyStore.set(idemKey, 201, { 'content-type': 'application/json' }, '{"ok":true}')
  assert(idempotencyStore.checkInFlight(idemKey) === false, 'Idempotency clears in-flight on completion')
  const cached = idempotencyStore.get(idemKey)
  assert(cached !== null && cached.statusCode === 201, 'Idempotency returns cached response')

  console.log(`\n========================================`)
  console.log(`Test Results: ${passed} passed, ${failed} failed`)
  console.log(`========================================\n`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err)
  process.exit(1)
})
