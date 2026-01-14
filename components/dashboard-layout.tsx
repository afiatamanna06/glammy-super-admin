"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Menu,
  Search,
  Bell,
  LogOut,
  LineChart,
  Cpu,
  Sparkles,
  Briefcase,
  ShoppingBag,
  Palette,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type SectionId =
  | "dashboard"
  | "analytics"
  | "users"
  | "models"
  | "model-comparisons"
  | "orders"
  | "products"
  | "sellers"
  | "datasets";

interface NavDefinition {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

const NAVIGATION: NavDefinition[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "orders",
    label: "Orders",
    icon: Briefcase,
  },
  {
    id: "products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    id: "sellers",
    label: "Designers & Sellers",
    icon: Palette,
  },
  {
    id: "datasets",
    label: "Datasets",
    icon: Database,
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: LineChart,
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
  {
    id: "model-comparisons",
    label: "Model comparisons",
    icon: Sparkles,
  },
  {
    id: "models",
    label: "Active models",
    icon: Cpu,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [userInitial, setUserInitial] = useState("G");
  const [userName, setUserName] = useState("Glammy Admin");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in event ? event.matches : mediaQuery.matches;
      setIsMobile(matches);
      setSidebarOpen(!matches);
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      const listener = (event: MediaQueryListEvent) => handleChange(event);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }

    const legacyListener = (event: MediaQueryListEvent) => handleChange(event);
    mediaQuery.addListener(legacyListener);
    return () => mediaQuery.removeListener(legacyListener);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser) as {
        name?: string;
        email?: string;
      };
      if (parsed?.name) {
        setUserName(parsed.name);
        setUserInitial(parsed.name.charAt(0).toUpperCase());
      } else if (parsed?.email) {
        setUserName(parsed.email);
        setUserInitial(parsed.email.charAt(0).toUpperCase());
      }
    } catch {
      /* swallow */
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visible[0];

        if (
          topEntry?.target?.id &&
          NAVIGATION.some((item) => item.id === topEntry.target.id)
        ) {
          const sectionId = topEntry.target.id as SectionId;
          setActiveSection((prev) => (prev === sectionId ? prev : sectionId));
        }
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0.1, 0.25, 0.6],
      }
    );

    NAVIGATION.forEach((item) => {
      const block = document.getElementById(item.id);
      if (block) observer.observe(block);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavSelect = (section: SectionId) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (isMobile) {
      setSidebarOpen(false);
    }
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const pageSubtitle = useMemo(() => {
    switch (activeSection) {
      case "dashboard":
        return "Mission-critical overview fed directly from the admin endpoints.";
      case "analytics":
        return "Deep dive into orders, revenue, and engagement analytics.";
      case "users":
        return "Manage user accounts and update ban status.";
      case "model-comparisons":
        return "Compare AI model performance, latency, and costs.";
      case "orders":
        return "View and manage customer orders and transactions.";
      default:
        return "Glammy Admin";
    }
  }, [activeSection]);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {isMobile && sidebarOpen && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r border-border/60 bg-card/90 px-5 pb-6 pt-6 shadow-2xl backdrop-blur-xl transition-transform duration-300",
          "supports-[backdrop-filter]:bg-card/70",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:w-72"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30">
              G
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                Glammy
              </span>
              <span className="text-lg font-semibold text-foreground">
                Admin Console
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl border border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <Menu size={18} />
            <span className="sr-only">Collapse navigation</span>
          </Button>
        </div>

        <div className="mt-8 space-y-6">
          <div className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
            Navigation
          </div>
          <nav className="space-y-2">
            {NAVIGATION.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activeSection === item.id}
                onSelect={handleNavSelect}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl border border-transparent bg-transparent px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
          <div className="flex items-center gap-4 px-4 py-4 lg:px-10">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl border border-border/60 text-muted-foreground hover:bg-muted/60 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
              <span className="sr-only">Open navigation</span>
            </Button>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
                {NAVIGATION.find((item) => item.id === activeSection)?.label ??
                  "Xita Admin"}
              </h1>
              <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="relative hidden min-w-[260px] lg:block">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  placeholder="Search admin data"
                  className="rounded-xl border border-border/70 bg-background/60 pl-10 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary"
                  type="search"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl border border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/60"
              >
                <Bell size={18} />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />
                <span className="sr-only">View notifications</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold uppercase text-primary transition-colors hover:bg-primary/20">
                    {userInitial}
                    <span className="sr-only">Open account menu</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[220px] rounded-xl border-border/70 bg-card/95 p-2"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Administrator
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-lg text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg text-sm text-muted-foreground hover:text-foreground">
                    Notification settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg text-sm text-muted-foreground hover:text-foreground">
                    Workspace preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="rounded-lg text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-7xl space-y-10 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onSelect,
}: {
  item: NavDefinition;
  active: boolean;
  onSelect: (section: SectionId) => void;
}) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        "group w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200",
        active
          ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/20"
          : "border-border/70 bg-transparent hover:border-primary/30 hover:bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all",
            active
              ? "border-transparent bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "border-primary/15 bg-primary/10 text-primary group-hover:border-primary/30"
          )}
        >
          <item.icon size={18} />
        </span>
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-semibold transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {item.label}
          </p>
        </div>
      </div>
    </button>
  );
}
