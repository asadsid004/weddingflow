
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Calendar02Icon,
  TickDouble04Icon,
  UserMultiple02Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ReactNode } from "react";

const FEATURES_DATA = [
  {
    title: "Guest Management",
    description:
      "Track RSVPs, plus-ones, and dietary needs in real-time. Manage your entire guest list with ease.",
    Icon: (
      <HugeiconsIcon
        icon={UserMultiple02Icon}
        strokeWidth={2}
        className="size-6"
      />
    ),
  },
  {
    title: "Budget Tracking",
    description:
      "Monitor your spending across all events. Stay on top of every expense and vendor payment with ease.",
    Icon: (
      <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} className="size-6" />
    ),
  },
  {
    title: "Event Coordination",
    description:
      "Organize everything from rehearsal to reception. Keep your entire wedding schedule perfectly on track.",
    Icon: (
      <HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} className="size-6" />
    ),
  },
  {
    title: "Task Management",
    description:
      "Break down your planning into manageable tasks. Track progress and ensure nothing falls through the cracks.",
    Icon: (
      <HugeiconsIcon
        icon={TickDouble04Icon}
        strokeWidth={2}
        className="size-6"
      />
    ),
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-medium text-balance lg:text-5xl">
            Everything you need for your big day
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            WeddingFlow provides intuitive, powerful tools to help you manage
            every aspect of your wedding planning journey without the chaos.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 md:max-w-none md:grid-cols-2 lg:grid-cols-4">
          {FEATURES_DATA.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: React.ReactNode;
}) {
  return (
    <Card className="group border-muted/50 hover:bg-muted/5 rounded-md shadow-zinc-950/5 transition-all">
      <CardHeader>
        <CardDecorator>{Icon}</CardDecorator>
        <h3 className="text-lg font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l shadow-sm">
      {children}
    </div>
  </div>
);