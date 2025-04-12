"use client";

import { usePathname } from "next/navigation";
import FooterMain from "./FooterMain";

const FooterWrapper = () => {
  const pathname = usePathname();

  // Show footer only on landing page, login, register, and forgot-password pages
  const showFooter =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/contact-us" ||
    pathname === "/features" ||
    pathname === "/pricing" ||
    pathname === "/forgot-password";

  return showFooter ? <FooterMain /> : null;
};

export default FooterWrapper;
