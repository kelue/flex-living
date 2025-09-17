# Property Rental – Hostaway Integration

## Hostaway API Setup

1. Get API credentials from your Hostaway dashboard:
   - Settings → Integrations → Hostaway API → Configure
   - Create an API key to obtain Client ID and Client Secret
   - Save the Client Secret securely

2. Create `.env.local` in the project root with:

```
HOSTAWAY_CLIENT_ID=your_client_id
HOSTAWAY_CLIENT_SECRET=your_client_secret
# optional
# HOSTAWAY_SCOPE=general
# HOSTAWAY_BASE_URL=https://api.hostaway.com
```

3. Restart the dev server. When credentials are present, `/api/reviews` will:
   - Obtain an OAuth token and fetch reviews from Hostaway
   - Normalize fields and overlay local approval flags

## Reviews API

- GET `/api/reviews?listingId=123&limit=50&offset=0`
  - Returns normalized reviews and `isPublic` based on local approvals
- POST `/api/reviews`
  - When Hostaway is configured: send minimal payload `{ approvalKey, isPublic }`
  - Fallback (no Hostaway creds): send full reviews array (legacy demo)

`approvalKey` format: `listingId:reviewId` if listingId is present, otherwise `reviewId`.

# Property Rental – Hostaway Integration Notes

Environment variables (create .env.local):

```
HOSTAWAY_CLIENT_ID=your_client_id
HOSTAWAY_CLIENT_SECRET=your_client_secret
# Optional
HOSTAWAY_SCOPE=general
HOSTAWAY_BASE_URL=https://api.hostaway.com
```

How it works:
- If credentials are set, `/api/reviews` fetches reviews from Hostaway OAuth + `/v1/reviews`, normalizes them, and overlays approval flags stored in `data/review-approvals.json`.
- Admin toggle in Review Management updates approvals via `POST /api/reviews` (stores `{ approvalKey: boolean }`).
- If credentials are not set, the app falls back to local `data/reviews.json` for both GET and POST (demo mode).

Testing locally:
- Without env vars: admin toggles write to `data/reviews.json`; public UI reads approved reviews from `/api/reviews`.
- With env vars: toggles persist to `data/review-approvals.json`; public UI reads Hostaway reviews with approval overlay.

Notes:
- `approvalKey` is computed from `listingId:id` when available, otherwise just `id`.
- You can extend `/api/reviews` to filter by `listingId`, `limit`, or `offset` if needed.

