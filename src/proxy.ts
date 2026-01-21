import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const isAtWeddingsBaseRoute = request.nextUrl.pathname === "/weddings";

    if (session.user.totalWeddings === 0 && !isAtWeddingsBaseRoute) {
        return NextResponse.redirect(new URL("/weddings", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/weddings/:path*"],
};