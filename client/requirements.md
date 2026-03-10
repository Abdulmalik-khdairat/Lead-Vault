## Packages
date-fns | Needed for formatting dates elegantly in the admin dashboard and metrics
framer-motion | Essential for page load animations and smooth transitions on the landing page

## Notes
- Tailwind config needs to be updated with Poppins font family for display if needed, but we will use CSS variables in index.css to enforce it globally.
- Replit Auth is used for the admin panel. The `useAuth` hook from `@/hooks/use-auth` is assumed to be present.
- Zod schemas are imported from `@shared/schema` and route configs from `@shared/routes`.
