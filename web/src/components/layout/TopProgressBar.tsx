"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [progreso, setProgreso] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgreso(35);

    const t1 = setTimeout(() => setProgreso(78), 120);
    const t2 = setTimeout(() => setProgreso(100), 280);
    const t3 = setTimeout(() => {
      setVisible(false);
      setProgreso(0);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[120] h-0.5 bg-transparent pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#0066b1] via-[#1c69d4] to-[#e22718] transition-all duration-200 ease-out shadow-[0_0_10px_#0066b1]"
        style={{ width: `${progreso}%` }}
      />
    </div>
  );
}
