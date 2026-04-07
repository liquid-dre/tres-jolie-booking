"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarDays,
  List,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: List },
  { href: "/admin/bookings/new", label: "New Booking", icon: PlusCircle },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavContent({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-4">
        <Link href="/admin" className="text-lg font-bold text-primary">
          Tres Jolie
        </Link>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-2 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/admin/login");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-background lg:block">
        <NavContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <div className="fixed left-0 top-0 z-40 flex h-14 w-full items-center border-b bg-background px-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <NavContent pathname={pathname} onLogout={handleLogout} />
          </SheetContent>
        </Sheet>
        <span className="ml-3 text-sm font-bold text-primary">Tres Jolie Admin</span>
      </div>
      <div className="h-14 lg:hidden" /> {/* Spacer for fixed header */}
    </>
  );
}
