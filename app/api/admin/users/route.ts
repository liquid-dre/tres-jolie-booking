import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (data.users || []).map((u) => ({
    id: u.id,
    email: u.email,
    createdAt: u.created_at,
  }));

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    createdAt: data.user.created_at,
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Guard: ensure at least 1 admin remains
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  if ((listData.users || []).length <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last admin account. At least one admin must remain." },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
