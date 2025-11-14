"use client";

import { Button } from "@travelpulse/ui";

export function HeroCtaButton({ className }: { className?: string }) {
  const scrollToDestination = () => {
    const el = document.getElementById("destination-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Button
      variant="secondary"
      className={className}
      onClick={scrollToDestination}
    >
      Explore eSIMs for 200+ Countries
    </Button>
  );
}
