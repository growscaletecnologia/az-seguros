# Project Rules – Seguros Viagem (Frontend + Backend)

## Framework Version and Dependencies

### Frontend
- **Node.js**: 20+
- **Next.js**: 15.5.2
- **React**: 19.1.0
- **React DOM**: 19.1.0
- **TypeScript**: ^5
- **TailwindCSS**: ^4 with @tailwindcss/postcss
- **State Management**: Zustand ^5.0.8
- **Forms & Validation**: Zod ^3.24.3, zod-form-data ^2.0.7
- **UI/UX Libraries**:
  - Radix UI (@radix-ui/react-*)
  - ShadCN utilities (class-variance-authority, tailwind-merge)
  - Headless UI ^2.2.7
  - Embla Carousel (core, autoplay, react)
  - Motion ^12.9.4
  - Lucide-react ^0.542.0
  - Sonner ^2.0.3
- **Other**:
  - date-fns ^4.1.0
  - dompurify ^3.2.6
  - react-day-picker ^9.9.0
  - react-phone-input-2 ^2.15.1
  - @tanstack/react-table ^8.21.3
  - jsdom ^26.1.0 (test environment)

### Backend
- **Node.js**: 22+
- **NestJS**: ^11.1.6
- **Prisma ORM**: ^6.15.0 with @prisma/client
- **Database**: MariaDB/MySQL (via Prisma)
- **Auth & Security**:
  - @nestjs/jwt ^11.0.0
  - passport, passport-jwt, passport-local
  - bcrypt ^6.0.0
  - helmet ^8.1.0
  - express-session ^1.18.2
- **Infrastructure**:
  - ioredis ^5.7.0
  - nodemailer ^7.0.6
  - uuid ^13.0.0
- **API Documentation**:
  - @nestjs/swagger ^11.2.0
  - swagger-ui-express ^5.0.1
- **Best Practices**:
  - class-validator ^0.14.2, class-transformer ^0.5.1
  - rxjs ^7.8.1

---

## Testing Framework

### Frontend
- **Unit tests**: Jest
- **Component tests**: React Testing Library
- **End-to-end tests**: Playwright or Cypress
- **Mocking**: external APIs, zustand store, authentication hooks
- **Environment**: jsdom

### Backend
- **Framework**: Jest ^30.0.0 with ts-jest
- **Unit tests**: services, guards, pipes
- **Integration tests**: complete NestJS modules
- **End-to-end tests**: supertest for HTTP calls
- **File naming**: `*.spec.ts`
- **Coverage**: stored in `../coverage`
- **Environment**: Node.js

---

## APIs to Avoid

- Do not use `eval()` or unsafe dynamic execution.
- Avoid deprecated or unstable Node.js APIs.
- Do not overuse TypeScript `any`; enforce strong typing.
- In frontend, do not manipulate the DOM directly; rely on React’s declarative model.
- Avoid `dangerouslySetInnerHTML`; sanitize HTML with dompurify when necessary.
- Do not call third-party APIs directly from the frontend; always proxy through backend services.
- In backend, avoid raw SQL queries; always use Prisma ORM.
- Do not access environment variables scattered across files; centralize configuration in NestJS config.
- Do not leave async promises unhandled.
- Do not expose public routes without proper authentication and authorization guards.
