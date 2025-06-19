'use client';
import { useEffect } from "react";
import { PremiumTestimonials } from "@/components/ui/premium-testimonials";

export default function MemberHomePage() {
  useEffect(() => {
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  return <PremiumTestimonials />;
}
