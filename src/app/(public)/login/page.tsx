"use client";

import Image from "next/image";

export default function Login() {
  return (
    <main className="relative flex w-full h-screen overflow-hidden">
      <Image
        src="/images/login-page-image.webp"
        alt="Login"
        layout="fill"
        objectFit="cover"
        priority
        quality={80}
      />
    </main>
  );
}
