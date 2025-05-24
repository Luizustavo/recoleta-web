"use client";

import Image from "next/image";
import LoginForm from "@/components/forms/login";

export default function Login() {
  return (
    <main className="relative flex w-full h-screen overflow-hidden">
      <section
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-300 ease-in-out ${
          /* isLoginComponent ? 'translate-x-0' : '-translate-x-full' */ ""
        }`}
      >
        <Image
          src="/images/login-page-image.webp"
          alt="Login"
          layout="fill"
          objectFit="cover"
          priority
          quality={80}
        />
      </section>
      <section
        className={`flex flex-col items-center justify-center w-1/2 transition-transform duration-300 ease-in-out translate-x-0${
          /* isLoginComponent ? 'translate-x-0' : 'translate-x-full' */ ""
        }`}
      >
        <LoginForm />
      </section>
    </main>
  );
}
