"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    const baseClass = "transition-colors hover:text-gray-900";
    const activeClass = "text-gray-900 font-semibold";
    const inactiveClass = "text-gray-500";

    return (
      <Link
        ref={ref}
        href={href}
        className={twMerge(
          `${baseClass} ${isActive ? activeClass : inactiveClass}`,
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export default NavLink;
