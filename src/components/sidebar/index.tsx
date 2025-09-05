"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Handshake,
  History,
  Lightbulb,
  LifeBuoy,
  Goal,
  Flower,
  Send,
  Settings,
  LayoutDashboard,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Gerenciar Coletas",
      url: "#",
      icon: History,
      isActive: true,
      items: [
        {
          title: "Meus Descartes",
          url: "/wastes",
        },
        {
          title: "Novo Descarte",
          url: "/discard",
        },
        {
          title: "Coletar Resíduo",
          url: "/waste-collection",
        },
      ],
    },
    {
      title: "Parceiros de Reciclagem ",
      url: "#",
      icon: Handshake,
      items: [
        {
          title: "Lista de Parceiros",
          url: "#",
        },
        {
          title: "Adicionar Novo Parceiro",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Dicas de Reciclagem",
      url: "#",
      icon: Lightbulb,
    },
    {
      name: "Impacto Ambiental",
      url: "#",
      icon: Flower,
    },
    {
      name: "Objetivos da ONU",
      url: "#",
      icon: Goal,
    },
  ],
};

export function SidebarComponent({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState({
    name: "Carregando...",
    email: "carregando@email.com",
  });
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.user.name,
            email: data.user.email,
          });
        } else {
          setUserData({
            name: "Usuário",
            email: "usuario@email.com",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        setUserData({
          name: "Usuário",
          email: "usuario@email.com",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    alt="logo-recoleta"
                    src="/images/logo-recoleta-image.svg"
                    width={32}
                    height={32}
                    className="bg-sidebar size-full"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ReColeta</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: userData.name,
            email: userData.email,
            avatar: "https://api.dicebear.com/9.x/bottts/svg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
