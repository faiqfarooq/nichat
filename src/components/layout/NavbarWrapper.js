"use client";

import { usePathname } from "next/navigation";
import EnhancedNavbar from "./EnhancedNavbar";
import SecondaryNavbar from "./SecondaryNavbar";

const NavbarWrapper = () => {
  const pathname = usePathname();

  // Show footer only on landing page, login, register, and forgot-password pages
  const showFooter =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/contact-us" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/verify-email-otp" ||
    pathname === "/forgot-password";

  return showFooter ? <EnhancedNavbar /> : <SecondaryNavbar />;
};

export default NavbarWrapper;
