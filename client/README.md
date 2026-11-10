# ScazStore Frontend

ScazStore is a responsive ecommerce demonstration frontend built with React, Vite, React Router, and Tailwind CSS. It showcases a storefront experience for groceries, fresh produce, daily essentials, shop promotions, customer accounts, and order tracking.

> **Demo notice:** This repository is a frontend demonstration. Authentication, payments, checkout, product management, delivery operations, and some account actions require a real backend before production use.

## Requirements

- Node.js 20.19+ or a compatible current LTS release
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

   Set this to the base URL of your backend API. The value is exposed to the browser, so never put secrets in `VITE_*` variables.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Check code quality and create a production build:

   ```bash
   npm run lint
   npm run build
   ```

## Main routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/products` | All products |
| `/groceries` | Groceries |
| `/vegetables` | Vegetables |
| `/fruits` | Fruits |
| `/daily-needs` | Daily needs |
| `/electronics` | Electronics |
| `/personal-care` | Personal care |
| `/offers` | Shop-sponsored and platform offers |
| `/login` | Login demo |
| `/signup` | Signup demo |
| `/account` | Profile, addresses, and order history |
| `/notice` | External-link and production-feature notice |\n| `/notifications` | Demo notice for the planned notifications feature |
| `/about` | About ScazStore |
| `/contact` | Contact demo |
| `/help` | Help center |
| `/faq` | FAQs |
| `/shipping-policy` | Shipping policy demo |
| `/return-policy` | Return policy demo |
| `/privacy-policy` | Privacy policy demo |
| `/refund-policy` | Refund policy demo |
| `/terms` | Terms and conditions demo |

See [DEVELOPER_NOTES.md](./DEVELOPER_NOTES.md) for architecture, API contracts, conventions, known gaps, and production-readiness tasks.
