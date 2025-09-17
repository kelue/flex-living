# Property Rental

Flex livig property rental app integrated with Hostaway. Public listings live at `/properties`, and an admin dashboard (no auth) is available at `/admin` and via the button in the public
header.
## Quick start

1. Install dependencies

   ```bash
   npm install
   ```

2. Set environment variables
   - Use `env.example` as a guide. Create a `.env` in the project root.
   - Typical values:

     ```
     HOSTAWAY_CLIENT_ID=your_client_id
     HOSTAWAY_CLIENT_SECRET=your_client_secret
     # Optional
     # HOSTAWAY_SCOPE=general
     # HOSTAWAY_BASE_URL=https://api.hostaway.com/v1
     ```

3. Run the dev server

   ```bash
   npm run dev
   ```

   App starts on `http://localhost:3000`.

## Routes

- `/` → redirects to `/properties`
- `/properties` → public listings
- `/properties/[id]` → property details (gallery, amenities, booking panel, reviews)
header 
- `/admin` → admin dashboard (no authentication); also linked from the public footer
- `/admin/overview` → admin overview
- `/admin/reviews` → admin reviews
- `/admin/analytics` → admin analytics
- `/admin/properties` → admin properties
- `/admin/properties/[id]` → admin property details
- `/admin/properties/[id]/edit` → admin property edit
- `/admin/properties/[id]/delete` → admin property delete

## Data & integrations

- **Hostaway integration**: Properties, amenities, and reviews are fetched from Hostaway when credentials are provided.
- **Approved reviews**: The public UI shows only approved reviews. Admin can approve/unapprove reviews in `/admin`.
- **Fallback**: Without Hostaway credentials, the app uses local JSON under `data/` for demo purposes.

## API (minimal reference)

- **Properties**
  - GET `/api/properties` → list properties
  - GET `/api/properties/[id]` → single property with details

- **Reviews**
  - GET `/api/reviews?listingId=123&limit=50&offset=0` → normalized reviews with `isPublic`
  - POST `/api/reviews` → toggle approval for a review (no auth; admin UI only)

### Hostaway notes

- With valid env vars, the server obtains an OAuth token and queries Hostaway (e.g., `/v1/reviews`), normalizes data, and overlays local approval flags.
- Without env vars, endpoints read from `data/reviews.json` and `data/properties.json`.
- `approvalKey` is `listingId:reviewId` when a listingId exists; otherwise `reviewId`.


## Extend: Google Reviews via Google Places API

- **Core tool**: Google Places API (Google Maps Platform) exposes place details including photos, ratings, and user reviews.

### Steps

1. Get an API key
   - In Google Cloud Console: create/select a project.
   - Enable the Places API.
   - Create an API key under Credentials.
   - Restrict the key: limit to Places API and set HTTP referrers if used client-side.

2. Find your Place ID
   - Use Google's Place ID Finder to search your business by name/address.
   - Save the Place ID (e.g., `ChIJN1t_tDeuEmsRUsoyG83frY4`).

3. Fetch Place Details (including reviews)
   - Endpoint: `https://maps.googleapis.com/maps/api/place/details/json`
   - Required params:
     - `placeid`: your Place ID
     - `key`: your API key
     - `fields`: request only what you need to control cost; e.g. `name,rating,reviews`
   - Example request:

     ```
     https://maps.googleapis.com/maps/api/place/details/json?placeid=YOUR_PLACE_ID&fields=name,rating,reviews&key=YOUR_API_KEY
     ```

   - Sample response snippet:

     ```json
     {
       "result": {
         "name": "Your Business Name",
         "rating": 4.7,
         "reviews": [
           {
             "author_name": "John Smith",
             "rating": 5,
             "relative_time_description": "a month ago",
             "text": "Amazing experience! The place was clean and the host was very communicative.",
             "profile_photo_url": "https://..."
           },
           {
             "author_name": "Jane Doe",
             "rating": 4,
             "relative_time_description": "two weeks ago",
             "text": "Great location, but could have been a bit cleaner.",
             "profile_photo_url": "https://..."
           }
         ]
       },
       "status": "OK"
     }
     ```

### Environment variables

Add to your `.env`:

```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACE_ID=your_google_place_id
# Optional: request fields to control cost
GOOGLE_PLACES_FIELDS=name,rating,reviews
```

### Normalization and merge

- Reviews are already normalized in this app; map Google fields into the existing shape and tag with `source: "google"` so they can be displayed alongside Hostaway.
- Common mapping:
  - `author_name` → author
  - `rating` → rating
  - `text` → comment
  - `relative_time_description` (or a derived ISO date from `time`) → date
  - `profile_photo_url` → avatarUrl
- Approval overlay: compute an `approvalKey` for Google reviews (e.g., `google:{stable-id-or-hash}`) and reuse the same approval toggling flow in `/admin`.
- Optionally support `source=hostaway|google|all` in `/api/reviews` to merge or filter sources.

