import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { BentoCard } from "../BentoCard";

const BING_IMAGE_URL = "https://api.staticdn.net/bing?rand=true&size=1366x768";

export function BingCard() {
  return (
    <BentoCard
      className="bg-cover bg-center ring-0 sm:col-span-2"
      style={{ backgroundImage: `url('${BING_IMAGE_URL}')` }}
    >
      {/* Spacer keeps the tile's height while the photo fills the card. */}
      <div aria-hidden />
      <div className="-mx-5 -mb-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pt-10 pb-4 text-right">
        <a
          href="https://www.7ed.net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white"
        >
          Bing 每日一图
          <ArrowSquareOutIcon />
        </a>
      </div>
    </BentoCard>
  );
}
