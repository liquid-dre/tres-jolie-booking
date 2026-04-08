import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET all categories with items
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch {
    // Table may not exist yet if migration hasn't been run
    return NextResponse.json({ categories: [] });
  }
}

// POST create a new category or item
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.type === "category") {
    const maxSort = await prisma.menuCategory.aggregate({ _max: { sortOrder: true } });
    const category = await prisma.menuCategory.create({
      data: {
        name: body.name,
        label: body.label || body.name,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json(category);
  }

  if (body.type === "item") {
    // Check for duplicate item name across all categories
    const existing = await prisma.menuItem.findFirst({
      where: { name: { equals: body.name, mode: "insensitive" } },
      include: { category: { select: { name: true } } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "duplicate", message: `A menu item named "${existing.name}" already exists in ${existing.category.name}` },
        { status: 409 }
      );
    }

    const maxSort = await prisma.menuItem.aggregate({
      where: { categoryId: body.categoryId },
      _max: { sortOrder: true },
    });
    const item = await prisma.menuItem.create({
      data: {
        categoryId: body.categoryId,
        name: body.name,
        description: body.description || null,
        price: body.price,
        sortOrder: (maxSort._max.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json(item);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// PUT update a category or item
export async function PUT(request: NextRequest) {
  const body = await request.json();

  if (body.type === "category") {
    const category = await prisma.menuCategory.update({
      where: { id: body.id },
      data: {
        name: body.name,
        label: body.label,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(category);
  }

  if (body.type === "item") {
    // Check for duplicate item name across all categories (excluding self)
    const existing = await prisma.menuItem.findFirst({
      where: {
        name: { equals: body.name, mode: "insensitive" },
        id: { not: body.id },
      },
      include: { category: { select: { name: true } } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "duplicate", message: `A menu item named "${existing.name}" already exists in ${existing.category.name}` },
        { status: 409 }
      );
    }

    const item = await prisma.menuItem.update({
      where: { id: body.id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(item);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// DELETE a category or item
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  if (type === "category") {
    await prisma.menuCategory.delete({ where: { id } });
  } else if (type === "item") {
    await prisma.menuItem.delete({ where: { id } });
  } else {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
