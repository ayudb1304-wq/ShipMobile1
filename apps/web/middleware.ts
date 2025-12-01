import { updateSession } from '@shipmobile/utils/supabase/middleware';
import { type NextRequest } from 'next/server';

/**
 * Middleware to refresh Supabase auth session on each request.
 * This ensures the session stays fresh for server components.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
