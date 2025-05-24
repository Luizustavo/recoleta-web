"use client";

import Image from "next/image";
import LoginForm from "@/components/forms/login";
import RegisterForm from "@/components/forms/register";
import { useState } from "react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <main className="relative flex w-full h-screen overflow-hidden">
      <section
        className={`absolute top-0 right-0 w-1/2 h-full transition-transform duration-300 ease-in-out ${
          isLogin ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Image
          src="/images/login-page-image.webp"
          alt="Login"
          layout="fill"
          objectFit="cover"
          priority
          quality={80}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
        />
      </section>
      <section
        className={`flex flex-col items-center justify-center w-1/2 transition-transform duration-300 ease-in-out ${
          isLogin ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggle={() => setIsLogin(true)} />
        )}
      </section>
    </main>
  );
}
