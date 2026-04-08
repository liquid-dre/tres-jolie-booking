"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Pencil,
  X,
  Check,
} from "lucide-react";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  sortOrder: number;
  isActive: boolean;
};

type MenuCategory = {
  id: string;
  name: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
};

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // New category form
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", label: "" });

  // New item form per category
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "" });

  // Editing
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setCategories(data.categories || []);
      // Expand all by default on first load
      if (data.categories) {
        setExpandedCategories(new Set(data.categories.map((c: MenuCategory) => c.id)));
      }
    } catch {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(id: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function addCategory() {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "category",
          name: newCategory.name,
          label: newCategory.label || newCategory.name,
        }),
      });
      if (!res.ok) throw new Error();
      const category = await res.json();
      setCategories((prev) => [...prev, { ...category, items: [] }]);
      setExpandedCategories((prev) => new Set([...prev, category.id]));
      setNewCategory({ name: "", label: "" });
      setShowNewCategory(false);
      toast.success("Category added");
    } catch {
      toast.error("Failed to add category");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category and all its items?")) return;
    try {
      await fetch(`/api/admin/menu?type=category&id=${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  }

  function findDuplicateItem(name: string, excludeItemId?: string): MenuCategory | null {
    const normalized = name.trim().toLowerCase();
    for (const cat of categories) {
      for (const item of cat.items) {
        if (item.name.trim().toLowerCase() === normalized && item.id !== excludeItemId) {
          return cat;
        }
      }
    }
    return null;
  }

  async function addItem(categoryId: string) {
    if (!newItem.name.trim() || !newItem.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const dupCat = findDuplicateItem(newItem.name);
    if (dupCat) {
      toast.error(`A menu item named "${newItem.name.trim()}" already exists in ${dupCat.name}`);
      return;
    }
    try {
      const res = await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "item",
          categoryId,
          name: newItem.name,
          description: newItem.description || null,
          price: newItem.price,
        }),
      });
      if (!res.ok) throw new Error();
      const item = await res.json();
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId ? { ...c, items: [...c.items, item] } : c
        )
      );
      setNewItem({ name: "", description: "", price: "" });
      setAddingItemTo(null);
      toast.success("Item added");
    } catch {
      toast.error("Failed to add item");
    }
  }

  async function deleteItem(categoryId: string, itemId: string) {
    try {
      await fetch(`/api/admin/menu?type=item&id=${itemId}`, { method: "DELETE" });
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
            : c
        )
      );
      toast.success("Item removed");
    } catch {
      toast.error("Failed to delete item");
    }
  }

  function startEditItem(item: MenuItem) {
    setEditingItem(item.id);
    setEditForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
    });
  }

  async function saveEditItem(categoryId: string, itemId: string) {
    const dupCat = findDuplicateItem(editForm.name, itemId);
    if (dupCat) {
      toast.error(`A menu item named "${editForm.name.trim()}" already exists in ${dupCat.name}`);
      return;
    }
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "item",
          id: itemId,
          name: editForm.name,
          description: editForm.description || null,
          price: editForm.price,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) => (i.id === itemId ? { ...i, ...updated } : i)),
              }
            : c
        )
      );
      setEditingItem(null);
      toast.success("Item updated");
    } catch {
      toast.error("Failed to update item");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <Button onClick={() => setShowNewCategory(true)} variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add Category
        </Button>
      </div>

      {showNewCategory && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Label className="text-xs">Category Name</Label>
                <Input
                  placeholder="e.g. Starters"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="w-full sm:w-40">
                <Label className="text-xs">Label</Label>
                <Input
                  placeholder="e.g. To Start"
                  value={newCategory.label}
                  onChange={(e) => setNewCategory((p) => ({ ...p, label: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={addCategory} size="sm">
                  <Check className="mr-1 h-4 w-4" /> Save
                </Button>
                <Button
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory({ name: "", label: "" });
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">
          No menu categories yet. Run the database seed or add categories above.
        </p>
      )}

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="cursor-pointer pb-3" onClick={() => toggleCategory(category.id)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <CardTitle className="text-base">{category.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {category.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {category.items.length} items
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCategory(category.id);
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardHeader>

          {expandedCategories.has(category.id) && (
            <CardContent className="pt-0">
              {addingItemTo === category.id ? (
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <Label className="text-xs">Name</Label>
                    <Input
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Description</Label>
                    <Input
                      placeholder="Optional description"
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((p) => ({ ...p, description: e.target.value }))
                      }
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <Label className="text-xs">Price</Label>
                    <Input
                      placeholder="R0.00"
                      value={newItem.price}
                      onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => addItem(category.id)}>
                      <Check className="mr-1 h-4 w-4" /> Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAddingItemTo(null);
                        setNewItem({ name: "", description: "", price: "" });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-3 text-xs"
                  onClick={() => {
                    setAddingItemTo(category.id);
                    setNewItem({ name: "", description: "", price: "" });
                  }}
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Item
                </Button>
              )}

              <Separator className="mb-3" />

              <div className="space-y-1">
                {category.items.map((item) => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <div className="flex flex-col gap-2 rounded border bg-secondary/30 p-3 sm:flex-row sm:items-end">
                        <div className="flex-1">
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, name: e.target.value }))
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, description: e.target.value }))
                            }
                          />
                        </div>
                        <div className="w-full sm:w-28">
                          <Label className="text-xs">Price</Label>
                          <Input
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm((p) => ({ ...p, price: e.target.value }))
                            }
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => saveEditItem(category.id, item.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingItem(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="group flex items-center justify-between rounded px-3 py-2 hover:bg-secondary/30">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {item.price}
                            </span>
                          </div>
                          {item.description && (
                            <p className="truncate text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => startEditItem(item)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => deleteItem(category.id, item.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
