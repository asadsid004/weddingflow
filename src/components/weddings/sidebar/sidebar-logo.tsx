import { SidebarMenuButton } from "@/components/ui/sidebar";
import Image from "next/image";

export const SidebarLogo = () => {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
        <Image src={"/logo.svg"} alt="Logo" width={25} height={25} priority />
      </div>
      <div className="flex-1 text-left text-sm leading-tight">
        <span className="text-2xl font-bold tracking-tight">WeddingFlow</span>
      </div>
    </SidebarMenuButton>
  );
};
