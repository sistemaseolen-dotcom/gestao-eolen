"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "./session";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const username = (formData.get("username") || "").toString().trim();
  const senha = (formData.get("senha") || "").toString();

  if (!username || !senha) {
    return { error: "Preencha usuário e senha." };
  }

  const supabase = createServiceClient();
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, username, password_hash, role, status")
    .eq("username", username)
    .maybeSingle();

  if (!usuario || !usuario.status) {
    return { error: "Usuário ou senha inválidos." };
  }

  const senhaOk = await bcrypt.compare(senha, usuario.password_hash);
  if (!senhaOk) {
    return { error: "Usuário ou senha inválidos." };
  }

  const token = await createSessionToken({
    sub: usuario.id,
    username: usuario.username,
    role: usuario.role,
  });

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
