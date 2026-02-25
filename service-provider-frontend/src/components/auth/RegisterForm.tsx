"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/lib/hooks/useAuth";
import { Role } from "@/types";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const container: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.07,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

export function RegisterForm() {
  const { register, isLoading } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.USER,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    register(data);
  };

  return (
    <div className="relative flex w-full justify-center">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute -top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden rounded-2xl border bg-background/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {/* Top gradient strip */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

          <CardHeader className="space-y-2 text-center">
            <motion.div variants={item}>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Create an account ✨
              </CardTitle>
              <CardDescription className="text-sm">
                Enter your details to get started
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <motion.form
                variants={container}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <motion.div variants={item}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="John Doe"
                              autoComplete="name"
                              className="h-11 rounded-xl pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={item}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="john@example.com"
                              type="email"
                              autoComplete="email"
                              className="h-11 rounded-xl pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={item}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="••••••••"
                              type="password"
                              autoComplete="new-password"
                              className="h-11 rounded-xl pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Role */}
                <motion.div variants={item}>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I want to register as</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl">
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Select your role" />
                              </div>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            <SelectItem value={Role.USER}>Customer</SelectItem>
                            <SelectItem value={Role.PROVIDER}>
                              Service Provider
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={item} className="pt-1">
                  <Button
                    type="submit"
                    className="group h-11 w-full rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Create account
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </Button>

                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="hover:text-primary hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="hover:text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </motion.div>
              </motion.form>
            </Form>

            <motion.div
              variants={item}
              className="mt-5 text-center text-sm text-muted-foreground"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login here
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
