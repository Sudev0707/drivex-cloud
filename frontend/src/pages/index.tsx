import { Link } from "react-router-dom";

import {
  ArrowRight,
  Cloud,
  Lock,
  Share2,
  Smartphone,
  Sparkles,
  Star,
  Check,
  FolderOpen,
  Upload,
} from "lucide-react";
import { Button } from "@/components/common/Button";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-primary text-primary-foreground inline-flex items-center justify-center font-bold">D</span>
          <span className="font-semibold text-foreground tracking-tight">DriveX <span className="text-muted-foreground font-normal">Lite</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-md">Sign in</Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> New · 15GB free for every account
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
          The cloud workspace
          <br />
          your files <span className="text-primary">deserve.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
          DriveX Lite gives you a beautifully simple home for documents, photos, and videos —
          with instant search, sharing, and zero clutter.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Start for free</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">Sign in</Button>
          </Link>
        </div>

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div className="surface-card overflow-hidden">
            <div className="h-10 border-b border-border bg-secondary/60 flex items-center gap-1.5 px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="grid sm:grid-cols-[200px_1fr]">
              <div className="hidden sm:block border-r border-border p-4 bg-sidebar">
                {["My Drive", "Shared", "Recent", "Trash"].map((l, i) => (
                  <div key={l} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${i === 0 ? "bg-primary-soft text-accent-foreground font-medium" : "text-muted-foreground"}`}>
                    <FolderOpen className="h-4 w-4" /> {l}
                  </div>
                ))}
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { c: "#3b82f6", n: "Documents" },
                    { c: "#ec4899", n: "Photos" },
                    { c: "#f59e0b", n: "Projects" },
                    { c: "#10b981", n: "Invoices" },
                  ].map((f) => (
                    <div key={f.n} className="rounded-lg border border-border p-3 bg-card hover-lift">
                      <div className="h-7 w-7 rounded-md text-white flex items-center justify-center" style={{ backgroundColor: f.c }}>
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <p className="mt-2 text-xs font-medium text-foreground">{f.n}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Upload, title: "Drag & drop uploads", desc: "Bring files in instantly with smooth, animated progress." },
    { icon: Share2, title: "One-click sharing", desc: "Share securely with anyone — control who can view and edit." },
    { icon: Lock, title: "Private by default", desc: "Your files stay yours. Granular permissions on every item." },
    { icon: Cloud, title: "Anywhere access", desc: "Open, edit, and organize from any device, online or off." },
    { icon: Smartphone, title: "Mobile-ready", desc: "A responsive experience designed for phones and tablets." },
    { icon: Sparkles, title: "Smart search", desc: "Find anything across folders the moment you start typing." },
  ];
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Everything you need, nothing you don't.</h2>
          <p className="mt-3 text-muted-foreground">A focused set of tools that make managing files feel effortless.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="surface-card p-6 hover-lift">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary inline-flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Free", price: "$0", desc: "For getting started", features: ["2 GB storage", "Personal use", "Basic sharing"] },
    { name: "Pro", price: "$9", desc: "For creators & power users", features: ["15 GB storage", "Advanced sharing", "Priority support"], featured: true },
    { name: "Business", price: "$24", desc: "For growing teams", features: ["1 TB storage", "Team workspaces", "Admin controls"] },
  ];
  return (
    <section id="pricing" className="py-20 sm:py-28 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-primary">Pricing</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Simple, transparent plans</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade only when you need more space.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`surface-card p-6 flex flex-col ${t.featured ? "ring-2 ring-primary shadow-[var(--shadow-card)]" : ""}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{t.name}</h3>
                {t.featured && (
                  <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-medium">Popular</span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">
                {t.price}<span className="text-base text-muted-foreground font-normal">/mo</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-foreground">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-6">
                <Button className="w-full" variant={t.featured ? "primary" : "outline"}>
                  Choose {t.name}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Priya Patel", role: "Product Designer", quote: "DriveX Lite finally made my files feel calm. Beautiful, fast, and out of the way." },
    { name: "Diego Ramos", role: "Founder, Northsea", quote: "We replaced two tools with this. Sharing with clients takes seconds now." },
    { name: "Mei Tanaka", role: "Photographer", quote: "Uploads are buttery smooth and the previews actually look good. Highly recommend." },
  ];
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Loved by users</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">What people are saying</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="surface-card p-6">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm text-foreground leading-relaxed">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}&backgroundColor=3b82f6&textColor=ffffff`} alt={t.name} className="h-9 w-9 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="surface-card p-10 sm:p-14 text-center bg-gradient-to-br from-card via-primary-soft to-card">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Ready to clean up your cloud?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Join thousands of teams and creators using DriveX Lite to organize their work.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>Create free account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost">I already have an account</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-md bg-primary text-primary-foreground inline-flex items-center justify-center font-bold text-sm">D</span>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} DriveX Lite</span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground">Customers</a>
        </div>
      </div>
    </footer>
  );
}
