import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase middleware for Next.js App Router.
 * Refreshes the user's session and attaches it to the request.
 * 
 * Add this to your middleware.ts:
 * 
 * @example
 * import { updateSession } from '@shipmobile/utils/supabase/middleware';
 * 
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * 
 * export const config = {
 *   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
 * };
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Optional: Redirect unauthenticated users to login
  // Uncomment and customize the path checks as needed
  /*
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  */

  return supabaseResponse;
}
