"use client";
import { removeSession } from "@/actions/auth-actions";
import {  Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, } from "@nextui-org/react";
import Link from "next/link";

export default function Header({ session }: { session: string | null }) {
  const handleUserLogout = () => {
    removeSession();
  };
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit"></p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {!session ? (
            <Link href="/login">Login</Link>
          ) : (
            <Button color="primary" onClick={handleUserLogout}>
              Logout
            </Button>
          )}
        </NavbarItem>
        {!session && (
          <NavbarItem>
            <Button as={Link} color="primary" href="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
