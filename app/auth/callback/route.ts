import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'
import { WelcomeEmail } from '@/components/emails/welcome-email'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  const cookieStore = await cookies()
  const cookieNext = cookieStore.get('next-redirect')?.value
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? cookieNext ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session?.user) {
      const user = data.session.user;
      
      // Check if user is newly created (within the last 30 seconds)
      const createdAt = new Date(user.created_at).getTime();
      const now = Date.now();
      const isNewUser = (now - createdAt) < 30000;
      
      if (isNewUser && user.email) {
        // Send welcome email asynchronously so it doesn't block the redirect
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
        
        resend.emails.send({
          from: "Yücel Avize <siparis@yucelavize.com>",
          to: [user.email],
          subject: "Yücel Avize'ye Hoş Geldiniz!",
          react: WelcomeEmail({ customerName: fullName }) as React.ReactElement,
        }).catch((emailError) => {
          console.error("Welcome email could not be sent:", emailError);
        });
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=Invalid_link`)
}
