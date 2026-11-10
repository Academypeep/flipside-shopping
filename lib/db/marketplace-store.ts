import { CreateOfferInput, CreateRequestInput, MarketRequest, Offer } from './types'

// Pre-seeded marketplace requests
const INITIAL_REQUESTS: MarketRequest[] = [
  {
    id: 1,
    title: 'iPhone 15 Pro 256GB',
    category: 'Electronics',
    location: 'Nairobi, KE',
    budget: 'KES 92,000',
    budgetAmount: 92000,
    currency: 'KES',
    offers: 8,
    time: '2h 14m',
    initials: 'JM',
    color: '#e8dfd2',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    description: 'Looking for a clean iPhone 15 Pro in Natural Titanium, unlocked with battery health > 90%.',
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5 headphones',
    category: 'Electronics',
    location: 'Mombasa, KE',
    budget: 'KES 28,500',
    budgetAmount: 28500,
    currency: 'KES',
    offers: 5,
    time: '5h 42m',
    initials: 'AK',
    color: '#d9e4e1',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    description: 'Black or Silver color, box and original accessories preferred.',
  },
  {
    id: 3,
    title: '2BR apartment near Westlands',
    category: 'Home & Living',
    location: 'Nairobi, KE',
    budget: 'KES 65,000 / mo',
    budgetAmount: 65000,
    currency: 'KES',
    offers: 12,
    time: '1d 3h',
    initials: 'NW',
    color: '#e2dfe8',
    createdAt: new Date(Date.now() - 27 * 3600 * 1000).toISOString(),
    description: 'Modern finishing, borehole water supply, high-speed lift, and parking space.',
  },
  {
    id: 4,
    title: 'MacBook Air M2',
    category: 'Electronics',
    location: 'Kisumu, KE',
    budget: 'KES 105,000',
    budgetAmount: 105000,
    currency: 'KES',
    offers: 3,
    time: '8h 09m',
    initials: 'SO',
    color: '#ead8d3',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    description: '16GB Unified RAM, 512GB SSD preferred. Space Grey or Midnight.',
  },
  {
    id: 5,
    title: 'Genuine leather work bag',
    category: 'Fashion',
    location: 'Nakuru, KE',
    budget: 'KES 8,000',
    budgetAmount: 8000,
    currency: 'KES',
    offers: 7,
    time: '14h 22m',
    initials: 'RM',
    color: '#dedbd0',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    description: 'Full-grain leather with padded compartment for a 14-inch laptop.',
  },
  {
    id: 6,
    title: 'Toyota Fielder 2015–2018',
    category: 'Vehicles',
    location: 'Nairobi, KE',
    budget: 'KES 1.4M',
    budgetAmount: 1400000,
    currency: 'KES',
    offers: 18,
    time: '2d 7h',
    initials: 'BK',
    color: '#d8e0e8',
    createdAt: new Date(Date.now() - 55 * 3600 * 1000).toISOString(),
    description: 'Direct import or single owner locally used, low mileage, silver or pearl white.',
  },
]

class MarketplaceStore {
  private requests: MarketRequest[] = [...INITIAL_REQUESTS]
  private offers = new Map<number, Offer[]>()
  private nextId = 7

  constructor() {
    // Seed initial dummy offers
    this.offers.set(1, [
      {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        requestId: 1,
        amount: 90000,
        sellerName: 'QuickTech Gadgets',
        notes: 'In stock now, brand new sealed box with 1-year Apple care warranty.',
        createdAt: new Date().toISOString(),
      },
    ])
  }

  async list(options?: {
    category?: string
    query?: string
    page?: number
    limit?: number
  }): Promise<{ items: MarketRequest[]; total: number; page: number; limit: number }> {
    const page = Math.max(1, options?.page ?? 1)
    const limit = Math.max(1, Math.min(50, options?.limit ?? 12))
    const query = options?.query?.toLowerCase().trim()
    const category = options?.category

    let filtered = [...this.requests]

    if (category && category !== 'All requests') {
      filtered = filtered.filter((r) => r.category.toLowerCase() === category.toLowerCase())
    }

    if (query) {
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query) ||
          (r.description && r.description.toLowerCase().includes(query)),
      )
    }

    const total = filtered.length
    const offset = (page - 1) * limit
    const items = filtered.slice(offset, offset + limit)

    return { items, total, page, limit }
  }

  async findById(id: number): Promise<MarketRequest | null> {
    const item = this.requests.find((r) => r.id === id)
    return item ? { ...item } : null
  }

  async create(input: CreateRequestInput): Promise<MarketRequest> {
    const randomColors = ['#e8dfd2', '#d9e4e1', '#e2dfe8', '#ead8d3', '#dedbd0', '#d8e0e8']
    const color = randomColors[Math.floor(Math.random() * randomColors.length)]

    // Extract initials from title or default to 'UR' (User Request)
    const words = input.title.trim().split(/\s+/)
    const initials = (words[0][0] + (words[1]?.[0] ?? words[0][1] ?? 'R')).toUpperCase()

    const newRequest: MarketRequest = {
      id: this.nextId++,
      title: input.title.trim(),
      category: input.category,
      location: input.location.trim(),
      budget: input.budget.trim().startsWith('KES') ? input.budget.trim() : `KES ${input.budget.trim()}`,
      currency: 'KES',
      offers: 0,
      time: 'Just now',
      initials,
      color,
      createdAt: new Date().toISOString(),
      description: input.description?.trim(),
    }

    this.requests.unshift(newRequest)
    return { ...newRequest }
  }

  async getOffers(requestId: number): Promise<Offer[]> {
    return [...(this.offers.get(requestId) ?? [])]
  }

  async addOffer(requestId: number, input: CreateOfferInput): Promise<Offer> {
    const request = await this.findById(requestId)
    if (!request) {
      throw new Error(`Request with ID ${requestId} not found`)
    }

    const offer: Offer = {
      id: crypto.randomUUID(),
      requestId,
      amount: input.amount,
      sellerName: input.sellerName.trim(),
      notes: input.notes?.trim(),
      createdAt: new Date().toISOString(),
    }

    const currentOffers = this.offers.get(requestId) ?? []
    this.offers.set(requestId, [...currentOffers, offer])

    // Update offer count on request
    const idx = this.requests.findIndex((r) => r.id === requestId)
    if (idx !== -1) {
      this.requests[idx].offers += 1
    }

    return offer
  }
}

// Global singleton for Next.js hot reload safety
const globalStore = globalThis as unknown as { __flipsideStore?: MarketplaceStore }
export const marketplaceStore = globalStore.__flipsideStore ?? new MarketplaceStore()
if (process.env.NODE_ENV !== 'production') {
  globalStore.__flipsideStore = marketplaceStore
}
