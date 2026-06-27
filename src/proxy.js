import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from './lib/auth'
 
// This function can be marked `async` if using `await` inside
export async function proxy(request) {
     const session = await auth.api.getSession({
        headers: await headers() 
    })
    if(!session){
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
 
}
 
export const config = {
 
    matcher: ['/lessions/:id', '/dashboard/user','/dashboard/user/add-lesson','/dashboard/user/my-lessons','/dashboard/user/myFav','/dashboard/user/myProf','/dashboard/admin','/dashboard/admin/manage-lessons','/dashboard/admin/manage-users','/dashboard/admin/profile','/dashboard/admin/reported-lessons']
}