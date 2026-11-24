# ScazStore — Developer Notes

Last reviewed: 2026-11-07

## 1. Project overview

ScazStore is a React single-page application built with:

- React 19
- Vite
- React Router
- Tailwind CSS 4 through the Vite plugin
- Browser `fetch` for API communication

The app currently contains a demo storefront and frontend integration points. It is **not a complete production ecommerce system**. Do not process real payments or collect real customer information until the backend, security controls, privacy policy, and operational workflows have been implemented and reviewed.

## 2. Source layout

```text
src/
├── assets/
│   ├── banners/
│   │   └── horizontal/          # Homepage banner images
│   └── images/                  # Brand assets
├── components/
│   └── banners/
│       └── BannerCarousel.jsx
├── pages/
│   ├── account/
│   │   └── ProfilePage.jsx
│   ├── auth/
│   │   └── AuthPage.jsx
│   ├── category/
│   │   └── CategoryPage.jsx
│   ├── home/
│   │   ├── HomePage.jsx
│   │   └── container/
│   │       └── ProductSections.jsx
│   ├── info/
│   │   └── InfoPages.jsx
│   ├── offers/
│   │   └── OffersPage.jsx
│   └── NoticePage.jsx
├── router/
│   ├── lazyPages.jsx             # Lazy route component registry
│   └── router.jsx                # Application route definitions
├── services/
│   ├── accountApi.js
│   ├── offersApi.js
│   └── productApi.js
├── universal/
│   ├── components/
│   │   ├── DemoNotice.jsx
│   │   ├── ErrorPage.jsx
│   │   ├── Loader.jsx
│   │   ├── NavBar.jsx
│   │   └── SiteFooter.jsx
│   └── layouts/
│       └── RootLayout.jsx
├── index.css
└── main.jsx
```

## 3. Naming and code conventions

- React components and component files use `PascalCase`.
- Service modules use `camelCase` with an `Api` suffix, for example `productApi.js`.
- Route slugs use lowercase kebab-case, for example `/daily-needs`.
- API functions use descriptive verbs: `getProducts`, `getOffers`, `updateProfile`.
- Keep API/network code in `src/services`; keep page rendering and interaction in `src/pages`.
- Prefer named exports for reusable page components and a default export for a page's primary component.
- Use semantic HTML, accessible labels, meaningful button text, and concise comments that explain intent rather than restating the code.
- Use `import.meta.env.VITE_API_BASE_URL` for the API base URL. Never store credentials, private keys, or server secrets in frontend environment variables.

## 4. Routing

`src/router/router.jsx` defines the route tree. `RootLayout` owns the shared navigation, footer, and initial demo disclaimer.

`src/router/lazyPages.jsx` is the single registry for lazy-loaded route components. When adding a page:

1. Create the page under the relevant `src/pages` folder.
2. Add a lazy export to `lazyPages.jsx`.
3. Add a route to `router.jsx`.
4. Add navigation/footer links only after the route exists.

The `/notifications` route currently displays the production-feature notice because a customer notification center has not yet been implemented.\n\nThe `:slug` route is deliberately placed after named static routes. It renders category pages such as `/groceries` and `/vegetables`. If new fixed routes are added, define them before `:slug`.

## 5. Backend configuration and API contracts

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The frontend currently expects the following API contracts. The backend must implement and validate these endpoints; frontend code alone does not make the operations functional.

### Products

| Method | Endpoint | Expected purpose |
| --- | --- | --- |
| `GET` | `/products?section=popular&limit=8` | Homepage product section |
| `GET` | `/products?category=vegetables&search=&sort=newest&page=1&limit=12` | Category listing, filtering, and pagination |
| `POST` | `/cart/items` | Add a product to the authenticated cart |

Homepage section identifiers: `popular`, `new`, `daily`, `vegetables`, `nearby`.

Category slugs: `products`, `groceries`, `vegetables`, `fruits`, `daily-needs`, `electronics`, `personal-care`.

A paginated category response should look like:

```json
{
  "success": true,
  "totalProducts": 48,
  "totalPages": 4,
  "currentPage": 1,
  "products": []
}
```

A product object is expected to expose fields used by the UI, including `_id`, `name`, `category`, `image`, `price`, `originalPrice`, `discount`, `rating`, `reviews`, and `stock`.

### Offers

| Method | Endpoint | Expected purpose |
| --- | --- | --- |
| `GET` | `/offers?type=all&category=vegetables&search=` | Search and filter offers |
| `POST` | `/offers/:id/click` | Record an offer click |

Offer `type` values used by the UI are `shop` and `platform`. The backend must only publish approved sponsored offers and must exclude expired or inactive offers.

### Customer account and delivery

| Method | Endpoint | Expected purpose |
| --- | --- | --- |
| `GET` | `/me/profile` | Current customer's profile |
| `PATCH` | `/me/profile` | Update allowed profile fields |
| `GET` | `/me/addresses` | List the customer's addresses |
| `POST` | `/me/addresses` | Create an address |
| `PATCH` | `/me/addresses/:id` | Update an owned address |
| `GET` | `/me/orders` | List the authenticated customer's orders |
| `GET` | `/orders/:id/tracking` | Get tracking details for an owned order |
| `PATCH` | `/orders/:id/receiver` | Update receiver details when order state permits |

`accountApi.js` sends cookies with `credentials: "include"`. Configure the backend's CORS and cookie settings accordingly. For cross-site deployments, use secure cookie settings and an appropriate CSRF defence.

The order UI expects order data containing an order identifier, status, creation date, total, payment information, line items, receiver details, delivery address, delivery partner details, estimated delivery date/time, and tracking events.

## 6. Current frontend behavior and known gaps

These are intentional integration points or unfinished features in the current demo. They should not be mistaken for complete backend functionality.

### Authentication

- Login and signup currently show a demo message.
- They do not authenticate users or create accounts.
- Connect them to backend auth endpoints, add form validation, handle session expiry, and protect account routes.
- Do not store plaintext passwords or authentication tokens in local storage.

### Product discovery

- Homepage sections and category pages call the product API.
- The homepage wishlist is held in React component state only; it is not persisted.
- The product detail URL (`/product/:id`) is referenced by product/offer interactions but a product details route has not yet been added.
- Browser geolocation is optional. The backend should validate coordinates and apply an appropriate nearby-search radius.

### Cart

- Add-to-cart calls `POST /cart/items`.
- The shared cart state/count is not implemented yet. The `cart-updated` custom event is only a notification hook.
- The product cards keep Add to Cart disabled until `POST /cart/items` is implemented. Add cart retrieval, quantity updates, removal, stock checks, and server-side price calculation before enabling it.

### Offers

- Search, type filters, category filters, coupon copying, and click tracking are wired to the API contract.
- The backend must validate coupon rules at checkout; displaying a coupon is not proof that it is eligible.
- Only allow trusted redirect destinations. Avoid accepting arbitrary redirect URLs from untrusted offer data.

### Profile and orders

- Profile read/update and order list calls are wired to `accountApi.js`.
- The address list and Add Address form are connected to `POST /me/addresses`. The frontend submits `label`, `house`, `area`, `landmark`, `city`, `state`, `pincode`, and `phone`; make sure the backend validates and accepts this shape. Address editing and default-address selection are not implemented yet.
- The tracking view displays tracking data returned with the order. `getOrderTracking` is available in the service but the page does not yet poll or subscribe to it for live updates.
- Receiver editing is a UI integration point. The backend must verify order ownership and enforce the allowed order statuses.
- Delivery partner phone details should only be returned to the customer assigned to that active delivery. Consider masking or hiding the number after delivery.
- Estimated delivery times and delivery status must be generated by trusted order/delivery services, not accepted from the customer.

### Contact, newsletter, and social links

- Contact and newsletter forms currently demonstrate UI behavior only; they do not submit to a service.
- Footer social links are placeholders until the official account URLs are configured.
- Navbar search navigates to the category listing with a `search` query parameter; the category listing sends it to `GET /products`.

### Policies and legal copy

- Terms, privacy, refund, shipping, and return pages contain demonstration copy.
- Replace them with reviewed policies before commercial launch. A demo notice is not a substitute for legal review or regulatory compliance.

## 7. Security and privacy requirements before production

- Authenticate every account endpoint and authorize every resource by the authenticated user.
- Validate and normalize all incoming data on the server.
- Never trust client-provided prices, discounts, stock values, order status, delivery assignments, or payment status.
- Use a trusted payment provider; verify payment webhooks server-side.
- Protect state-changing endpoints against CSRF when using cookies.
- Rate-limit authentication, coupon, contact, and order endpoints.
- Avoid logging passwords, tokens, full payment details, or unnecessary personal information.
- Keep secrets only in backend environment variables.
- Validate uploaded profile images and use a controlled storage service.
- Use HTTPS in production.
- Provide privacy controls and a retention/deletion process for personal data.

## 8. Developer commands

```bash
npm run dev       # Start Vite development server
npm run lint      # Run ESLint
npm run build     # Create production assets in dist/
npm run preview   # Preview the production build locally
```

## 9. Pre-release checklist

- [ ] Configure the production API URL.
- [ ] Implement and test authentication and protected routes.
- [ ] Complete product detail and cart pages.
- [ ] Complete address creation, editing, and default-address selection.
- [ ] Implement real order tracking updates and delivery partner assignment.
- [ ] Implement payment processing and server-side verification.
- [ ] Connect contact, newsletter, and search forms.
- [ ] Configure official social links.
- [ ] Replace demo policy text with reviewed legal content.
- [ ] Test mobile, tablet, desktop, accessibility, and error states.
- [ ] Verify authorization, validation, rate limits, CSRF protection, and privacy controls.
- [ ] Run `npm run lint` and `npm run build` in a clean dependency installation.
