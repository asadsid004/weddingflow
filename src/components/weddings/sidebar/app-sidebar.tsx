import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WeddingSwitcher } from "./wedding-switcher";
import { SidebarLogo } from "./sidebar-logo";
import { getWeddings } from "@/actions/weddings";
import { NavMain } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AppSidebar() {
  const weddings = await getWeddings();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
        <WeddingSwitcher weddings={weddings} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarUser
        user={{
          ...session.user,
          image: session.user.image as string,
        }}
      />
      <SidebarRail />
    </Sidebar>
  );
}
