/*
  Hostaway API client: obtains OAuth2 access token and fetches reviews.
  Environment variables:
  - HOSTAWAY_CLIENT_ID
  - HOSTAWAY_CLIENT_SECRET
  - HOSTAWAY_SCOPE (optional, default: "general")
  - HOSTAWAY_BASE_URL (optional, default: https://api.hostaway.com)
*/

type TokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  scope?: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

function getBaseUrl(): string {
  return process.env.HOSTAWAY_BASE_URL || "https://api.hostaway.com/v1"
}

export async function getHostawayAccessToken(): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt - 60 > nowSec) {
    return cachedToken.token
  }

  const clientId = process.env.HOSTAWAY_CLIENT_ID
  const clientSecret = process.env.HOSTAWAY_CLIENT_SECRET
  const scope = process.env.HOSTAWAY_SCOPE || "general"
  if (!clientId || !clientSecret) {
    throw new Error("Missing HOSTAWAY_CLIENT_ID or HOSTAWAY_CLIENT_SECRET")
  }

  const tokenUrl = `${getBaseUrl()}/accessTokens`
  const body = new URLSearchParams()
  body.set("grant_type", "client_credentials")
  body.set("client_id", clientId)
  body.set("client_secret", clientSecret)
  body.set("scope", scope)

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Hostaway token request failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as TokenResponse
  cachedToken = { token: json.access_token, expiresAt: nowSec + (json.expires_in) }
  return cachedToken.token
}

export type HostawayReview = Record<string, any>

export async function fetchHostawayReviews(params?: { listingId?: number | string; limit?: number; offset?: number }): Promise<HostawayReview[]> {
  const token = await getHostawayAccessToken()
  const url = new URL(`${getBaseUrl()}/reviews`)
  if (params?.listingId != null) url.searchParams.set("listingId", String(params.listingId))
  url.searchParams.set("limit", String(params?.limit ?? 100))
  if (params?.offset != null) url.searchParams.set("offset", String(params.offset))

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Hostaway reviews request failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as any
  // Hostaway often wraps payloads; try a few common shapes
  const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.result) ? json.result : Array.isArray(json?.reviews) ? json.reviews : []
  return list as HostawayReview[]
}

// Listings
export type HostawayListing = Record<string, any>

export type NormalizedListing = {
  id: number | string
  name: string
  summary: string
  description: string
  category: string
  channel: string
  guests: number
  bedrooms: number
  bathrooms: number
  address: string
  city?: string
  country?: string
  lat?: number
  lng?: number
  price?: number
  rating?: number
  reviewCount?: number
  amenities: Array<{ icon?: string; label: string }>
  gallery: string[]
  houseRules: { checkIn?: string | number; checkOut?: string | number; petsAllowed?: boolean; smokingAllowed?: boolean }
  cancellationPolicy?: string
  createdAt?: string
}

export async function fetchHostawayListings(params?: {
  limit?: number
  offset?: number
  sortOrder?: string
  city?: string
  match?: string
  country?: string
  isSyncig?: string | number | boolean
  contactName?: string
  propertyTypeId?: number | string
}): Promise<HostawayListing[]> {
  const token = await getHostawayAccessToken()
  const url = new URL(`${getBaseUrl()}/listings`)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).length > 0) url.searchParams.set(k, String(v))
    }
  }
  if (!url.searchParams.has("limit")) url.searchParams.set("limit", "50")

  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Hostaway listings request failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as any
  const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : Array.isArray(json?.result) ? json.result : Array.isArray(json?.listings) ? json.listings : []
  return list as HostawayListing[]
}

export async function fetchHostawayListingById(id: number | string): Promise<HostawayListing | null> {
  const token = await getHostawayAccessToken()
  const res = await fetch(`${getBaseUrl()}/listings/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    if (res.status === 404) return null
    const text = await res.text().catch(() => "")
    throw new Error(`Hostaway listing request failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as any
  return json?.result || json?.data || json || null
}

// Amenities
export type HostawayAmenity = { id: number; name: string }

let cachedAmenities: { items: HostawayAmenity[]; fetchedAt: number } | null = null

export async function fetchHostawayAmenities(): Promise<HostawayAmenity[]> {
  // Cache for 6 hours
  const now = Date.now()
  if (cachedAmenities && now - cachedAmenities.fetchedAt < 6 * 60 * 60 * 1000) {
    return cachedAmenities.items
  }
  const token = await getHostawayAccessToken()
  const res = await fetch(`${getBaseUrl()}/amenities`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Hostaway amenities request failed: ${res.status} ${text}`)
  }
  const json = (await res.json()) as any
  const list = Array.isArray(json) ? json : Array.isArray(json?.result) ? json.result : Array.isArray(json?.data) ? json.data : []
  const items: HostawayAmenity[] = list
    .map((a: any) => ({ id: Number(a?.id), name: String(a?.name || "") }))
    .filter((a: HostawayAmenity) => Number.isFinite(a.id) && a.name)
  cachedAmenities = { items, fetchedAt: now }
  return items
}

export async function getHostawayAmenityMap(): Promise<Record<string, string>> {
  const list = await fetchHostawayAmenities()
  const map: Record<string, string> = {}
  for (const a of list) map[String(a.id)] = a.name
  return map
}

export function normalizeHostawayListing(
  raw: HostawayListing,
  options?: { amenityMap?: Record<string, string> },
): NormalizedListing {
  const id = raw.id ?? raw.listingId ?? raw.listing_id
  const name = raw.name ?? raw.externalListingName ?? raw.internalListingName ?? `Listing ${id}`
  const description = String(
    raw.description ??
      raw.homeawayPropertyDescription ??
      raw.bookingcomPropertyDescription ??
      raw.airbnbSummary ??
      "",
  )
  const summaryParts: string[] = []
  const guests = Number(raw.personCapacity ?? raw.guestsIncluded ?? 0)
  const bedrooms = Number(raw.bedroomsNumber ?? 0)
  const bathrooms = Number(raw.bathroomsNumber ?? raw.guestBathroomsNumber ?? 0)
  if (guests) summaryParts.push(`${guests} ${guests === 1 ? "guest" : "guests"}`)
  if (bedrooms || bedrooms === 0) summaryParts.push(`${bedrooms} ${bedrooms === 1 ? "bedroom" : "bedrooms"}`)
  if (bathrooms || bathrooms === 0) summaryParts.push(`${bathrooms} ${bathrooms === 1 ? "bathroom" : "bathrooms"}`)
  const summary = [raw.propertyType || raw.roomType || "Apartment", "•", summaryParts.join(" • ")].filter(Boolean).join(" ")

  const category = String(raw.roomType ?? raw.propertyType ?? "Apartment")
  const channel = "Hostaway"
  const address = raw.publicAddress ?? raw.address ?? [raw.street, raw.city, raw.state, raw.zipcode, raw.country].filter(Boolean).join(", ")
  const city = raw.city
  const country = raw.country
  const lat = typeof raw.lat === "number" ? raw.lat : undefined
  const lng = typeof raw.lng === "number" ? raw.lng : undefined
  const price = typeof raw.price === "number" ? raw.price : undefined
  const rating = typeof raw.starRating === "number" ? raw.starRating : undefined
  const reviewCount = undefined

  const amenities: Array<{ icon?: string; label: string }> = Array.isArray(raw.listingAmenities)
    ? raw.listingAmenities
        .map((a: any) => {
          const idStr = String(a?.amenityId ?? a?.id)
          const label = options?.amenityMap?.[idStr] || idStr
          return { icon: idStr, label }
        })
        .filter((a: any) => a.label)
    : []

  const gallery: string[] = Array.isArray(raw.listingImages)
    ? raw.listingImages
        .filter((img: any) => typeof img?.url === "string" && img.url)
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((img: any) => String(img.url))
    : []

  const houseRules = {
    checkIn: raw.checkInTimeStart,
    checkOut: raw.checkOutTime,
    petsAllowed: false,
    smokingAllowed: false,
  }

  const cancellationPolicy = raw.cancellationPolicy
  const createdAt = new Date().toISOString()

  return {
    id,
    name: String(name),
    summary,
    description,
    category,
    channel,
    guests,
    bedrooms,
    bathrooms,
    address: String(address || ""),
    city,
    country,
    lat,
    lng,
    price,
    rating,
    reviewCount,
    amenities,
    gallery,
    houseRules,
    cancellationPolicy,
    createdAt,
  }
}
export type NormalizedReview = {
  id: number | string
  approvalKey: string
  listingId?: number | string
  property: string
  guest: string
  rating: number
  date: string
  comment: string
  isPublic: boolean
  category: string
  channel: string
}

export function computeApprovalKey(input: { id: any; listingId?: any }): string {
  const idPart = String(input.id ?? "")
  const listingPart = input.listingId != null ? String(input.listingId) : ""
  return listingPart ? `${listingPart}:${idPart}` : idPart
}

export function normalizeHostawayReview(raw: HostawayReview): Omit<NormalizedReview, "isPublic"> {
  const id = raw.id ?? raw.reviewId ?? raw.review_id ?? raw._id ?? raw.uuid ?? raw.externalId ?? Math.random().toString(36).slice(2)
  const listingId = raw.listingId ?? raw.listing_id ?? raw.listingMapId ?? raw.listing_map_id ?? raw.propertyId ?? raw.property_id
  const propertyName = raw.listingName ?? raw.propertyName ?? raw.listing?.name ?? raw.property?.name ?? (listingId ? `Listing ${listingId}` : "Unknown Listing")
  const guest = raw.guestName ?? raw.reviewerName ?? raw.authorName ?? raw.author ?? raw.userName ?? "Guest"

  // Derive rating: prefer explicit rating; otherwise average reviewCategory (often 1–10 scale → map to 1–5)
  const explicitRating = Number(raw.rating ?? raw.stars ?? raw.overallRating ?? raw.score)
  let derivedRating: number | undefined
  const categories = Array.isArray(raw.reviewCategory) ? raw.reviewCategory : []
  if (categories.length > 0) {
    const values = categories
      .map((c: any) => Number(c?.rating))
      .filter((n) => Number.isFinite(n) && n > 0)
    if (values.length > 0) {
      const avg10 = values.reduce((s, n) => s + n, 0) / values.length
      derivedRating = Math.round(Math.max(1, Math.min(5, avg10 / 2)))
    }
  }
  const ratingCandidate = Number.isFinite(explicitRating) && (explicitRating as number) > 0 ? Math.round(explicitRating as number) : derivedRating ?? 0

  // Prefer submittedAt; fall back to other common fields, then departure/arrival dates
  const dateStr = String(
    raw.submittedAt ??
      raw.submitted_at ??
      raw.createdAt ??
      raw.date ??
      raw.created_at ??
      raw.reviewDate ??
      raw.updatedAt ??
      raw.departureDate ??
      raw.arrivalDate ??
      new Date().toISOString(),
  )

  // Prefer publicReview text; fall back to private/response and other common fields
  const comment = String(
    raw.publicReview ??
      raw.privateFeedback ??
      raw.revieweeResponse ??
      raw.comment ??
      raw.text ??
      raw.content ??
      raw.body ??
      "",
  )

  const channel = String(raw.channel ?? raw.source ?? raw.platform ?? "Hostaway")
  const category = "Apartment"
  const approvalKey = computeApprovalKey({ id, listingId })
  return {
    id,
    approvalKey,
    listingId,
    property: String(propertyName),
    guest: String(guest),
    rating: Number.isFinite(ratingCandidate) && (ratingCandidate as number) > 0 ? (ratingCandidate as number) : 5,
    date: dateStr,
    comment,
    category,
    channel,
  }
}


