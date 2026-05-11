import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

async function handleSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL!), { status: 303 });
}

export const GET = handleSignOut;
export const POST = handleSignOut;
