import { NextResponse } from "next/server";

const ADMIN_USER = "Admin";
const ADMIN_PASSWORD = "123";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    username?: string;
    password?: string;
  } | null;

  if (body?.username !== ADMIN_USER || body?.password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Usuario o contrasena incorrectos." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("mesa-viva-admin", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
