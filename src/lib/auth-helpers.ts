import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const getSession = async () => auth.api.getSession({
    headers: await headers()
})

export const isAuthenticated = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/")
    }

    return session;
}