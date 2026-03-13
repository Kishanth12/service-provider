"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Briefcase,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const page: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function HomePage() {
  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950"
    >
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease }}
          className="absolute -top-28 -right-32 h-[30rem] w-[30rem] rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease, delay: 0.1 }}
          className="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/10"
        />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:22px_22px] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              aria-hidden
              initial={{ rotate: -8, scale: 0.95, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease }}
              className="relative h-9 w-9 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500"
            >
              <div className="absolute inset-0 rounded-2xl blur-md bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-fuchsia-500/40" />
            </motion.div>

            <div className="leading-tight">
              <p className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ServiceHub
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Book trusted services faster
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
              >
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition">
                <span className="relative z-10 flex items-center">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </span>
                {/* shine */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-5xl"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto max-w-4xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300">
              <Sparkles className="h-4 w-4" />
              Book trusted local services — fast
            </span>

            <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Book Local Services{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
                In Minutes
              </span>
            </h2>

            <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300">
              Connect with verified service providers and schedule appointments
              instantly — easy, secure, and reliable.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-xl px-8 text-base sm:text-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="relative z-10 flex items-center">
                    Book a Service{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Button>
              </Link>

              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 text-base sm:text-lg border-slate-200 bg-white/60 hover:bg-white dark:border-slate-800 dark:bg-slate-950/30 dark:hover:bg-slate-900/40"
                >
                  Become a Provider
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust / Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
          >
            {[
              { label: "Instant booking", value: "1–2 mins", icon: Zap },
              {
                label: "Verified providers",
                value: "Admin approved",
                icon: ShieldCheck,
              },
              { label: "Real reviews", value: "Trusted ratings", icon: Star },
              { label: "Secure platform", value: "Reliable", icon: Users },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/40"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/5 dark:bg-white/5">
                      <Icon className="h-4 w-4 text-slate-900 dark:text-white" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {s.label}
                    </p>
                  </div>
                  <p className="mt-2 font-bold text-slate-900 dark:text-white">
                    {s.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Choose ServiceHub?
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Everything you need to book and manage services smoothly.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: Calendar,
                title: "Easy Booking",
                desc: "Schedule appointments in just a few clicks — no hassle.",
              },
              {
                icon: Users,
                title: "Verified Providers",
                desc: "Providers are reviewed and approved by our admin team.",
              },
              {
                icon: Briefcase,
                title: "Wide Range of Services",
                desc: "Home repairs, cleaning, consultations, and more.",
              },
              {
                icon: Star,
                title: "Reviews & Ratings",
                desc: "Choose confidently with real customer feedback.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.22 }}
                  >
                    <Card className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white/75 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800/60 dark:bg-slate-950/40">
                      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-50 group-hover:opacity-90 transition" />
                      <CardHeader>
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/5 dark:bg-white/5">
                          <Icon className="h-6 w-6 text-slate-900 dark:text-white" />
                        </div>
                        <CardTitle className="text-slate-900 dark:text-white">
                          {f.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-600 dark:text-slate-300">
                          {f.desc}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 p-10 text-white shadow-xl"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />

            <div className="relative text-center">
              <h3 className="text-3xl font-extrabold tracking-tight">
                Ready to Get Started?
              </h3>
              <p className="mt-3 text-white/90 text-lg">
                Join customers and providers using ServiceHub today.
              </p>

              <div className="mt-8 flex justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group relative overflow-hidden rounded-xl px-8 text-lg bg-white text-slate-900 hover:bg-white/90"
                  >
                    <span className="relative z-10 flex items-center">
                      Sign Up Now{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/60 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/40 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>&copy; 2026 ServiceHub. All rights reserved.</p>
        </div>
      </footer>
    </motion.div>
  );
}
