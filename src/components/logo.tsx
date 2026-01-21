import Link from "next/link";
import Image from "next/image";

export const Logo = ({ href = "/weddings" }: { href?: string }) => {
  return (
    <Link href={href} className="flex items-center">
      <Image src={"/logo.svg"} alt="Logo" width={30} height={30} priority />
      <span className="ml-0.5 text-3xl font-bold tracking-tight">
        WeddingFlow
      </span>
    </Link>
  );
};
