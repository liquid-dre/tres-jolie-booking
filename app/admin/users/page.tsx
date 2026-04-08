"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, X, Check } from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    if (!newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Email and password are required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create admin");
        return;
      }
      setUsers((prev) => [...prev, data]);
      setNewUser({ email: "", password: "" });
      setShowForm(false);
      toast.success("Admin user created");
    } catch {
      toast.error("Failed to create admin user");
    } finally {
      setCreating(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this admin user?")) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete admin");
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Admin user deleted");
    } catch {
      toast.error("Failed to delete admin user");
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" /> Add Admin
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Password</Label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={newUser.password}
                  onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={createUser} size="sm" disabled={creating}>
                  {creating ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-1 h-4 w-4" />
                  )}
                  Create
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setNewUser({ email: "", password: "" });
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {users.length} admin{users.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No admin users found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {users.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground" title="At least one admin must remain">
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
