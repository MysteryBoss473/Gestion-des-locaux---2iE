"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const showNavbar = pathname !== "/login";

  if (!showNavbar) return null;
  
  return <Navbar />;
}