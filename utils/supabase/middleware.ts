import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const privatePaths = ['/court/create', '/court/(.*)/edit', '/match/create'];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const { data, error } = await supabase.auth.getUser()
  const { user } = data;
  const pathname = request.nextUrl.pathname

  // admin 경로 체크
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.rewrite(new URL('/login', request.url));
    }
    
    // admin role 체크
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    console.log('profile', profile)

    if (profile?.role !== 'admin') {
      console.log('admin role 아님') // todo : 내 계정에 admin 넣어야 함
      return NextResponse.rewrite(new URL('/match', request.url));
    }
  }
  
  // 다른 private 경로들은 로그인만 체크
  else if (!user && privatePaths.some(path => new RegExp(path).test(pathname))) {
    return NextResponse.rewrite(new URL('/login', request.url));
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}