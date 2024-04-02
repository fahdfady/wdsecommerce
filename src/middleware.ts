import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware(req: NextRequest) {
    if (await isAuthenticated(req) === false) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "WWW-Authenticate": "Basic" }
        })
    }
}

async function isAuthenticated(req: NextRequest) {
    const authHeader = req.headers.get("authorization") || req.headers.get("Autherization")


    if (authHeader == null) return false

    // why [1]??  ==>  encoded   "Basic encodedcredinitalsstring"
    //                 decoded   "username:password"
    const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":")

    await isValidPassword(password, "sdsds")

    return username === process.env.ADMIN_USERNAME && (await isValidPassword(password, process.env.ADMIN_HASHED_PASSWORD as string))
}

export const config = {
    matchet: "/admin/:path*"
}