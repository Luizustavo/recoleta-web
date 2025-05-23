"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export function Header() {

  const navTitles = [
    { title: "Notícias", href: "https://recoleta-news.vercel.app/" },
    { title: "Sobre nós", href: "#" },
    { title: "Nosso impacto", href: "#" },
    { title: "Parceiros", href: "#" },
  ];
  
  return (
    <main className="grid grid-cols-6 items-start px-6 relative z-10 pt-10">
      <header className="flex flex-row items-center gap-4">
        <Image
          src="/images/logo-recoleta-image.svg"
          alt="logo-recoleta"
          width={60}
          height={60}
          quality={80}
        />
        <h1
          className="xl:text-3xl text-2xl font-bold text-[#F6F6F6]"
          style={{ textShadow: "1px 2px 4px rgba(0, 0, 0, 0.7)" }}
        >
          ReColeta
        </h1>
      </header>

      <nav className="hidden md:block col-span-4 justify-center pt-3">
        <ul
          className="flex flex-row font-bold text-[#F6F6F6] justify-center 2xl:space-x-24 xl:space-x-12 md:gap-x-2 space-x-5 xl:text-xl text-base"
          style={{ textShadow: "1px 2px 4px rgba(0, 0, 0, 0.7)" }}
        >
          {navTitles.map((nav) => (
            <li key={nav.title}>
              <a href={nav.href}>{nav.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <span className="flex justify-end pt-3">
        <Button className="bg-[#F6F6F6] text-green-950">
          <Link href="#">Acessar</Link>
        </Button>
      </span>
    </main>
  );
}
