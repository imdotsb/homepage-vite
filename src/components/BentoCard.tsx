import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Text } from "@cloudflare/kumo/components/text";
import { cn } from "@cloudflare/kumo/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BentoCardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

/**
 * Base bento tile. Uses `ring` (not border) alongside shadow to keep sharp
 * edges, and only transitions transform/shadow on hover — never colors.
 */
export function BentoCard({ className, children, ...props }: BentoCardProps) {
  return (
    <LayerCard
      className={cn(
        "flex min-h-52 flex-col justify-between overflow-hidden rounded-xl bg-kumo-base px-5 py-4 shadow-sm ring ring-kumo-line sm:min-h-0",
        "transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </LayerCard>
  );
}

/**
 * Card heading with a duotone icon optically aligned to the first text line.
 */
export function CardTitle({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="flex h-lh items-center text-lg text-kumo-subtle">
        {icon}
      </span>
      <Text as="h2" variant="heading3">
        {children}
      </Text>
    </div>
  );
}
