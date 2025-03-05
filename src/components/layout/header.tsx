"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Toxos Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Search bar */}
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-2xl">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full rounded-full border-2 border-orange-500 pl-4 pr-12 focus:border-orange-600"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 h-full rounded-r-full bg-orange-500 px-6 hover:bg-orange-600"
                >
                  <Search className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            <Link
              href="/auth/login"
              className="flex items-center text-sm text-gray-700 hover:text-orange-500"
            >
              <User className="mr-1 h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center text-sm text-gray-700 hover:text-orange-500"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex h-12 items-center space-x-8">
          <Link
            href="/categories"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            All Categories
          </Link>
          <Link
            href="/deals"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            Today's Deals
          </Link>
          <Link
            href="/new"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            New Arrivals
          </Link>
          <Link
            href="/trending"
            className="text-sm font-medium text-gray-700 hover:text-orange-500"
          >
            Trending
          </Link>
        </nav>
      </div>
    </header>
  );
}
