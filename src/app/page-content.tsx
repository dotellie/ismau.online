"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export function PageContent({ isMauOnline }: { isMauOnline: boolean }) {
  const [rotate, setRotate] = useState(false);

  const animate = () => {
    setRotate(true);
    setTimeout(() => setRotate(false), 10000);
  };

  return (
    <main
      className={[
        styles.main,
        inter.className,
        rotate ? styles.rotate : null,
      ].join(" ")}
    >
      <h1 className={styles.title}>MAU is...</h1>
      <button
        className={styles.blob}
        onClick={animate}
        data-online={isMauOnline ? "true" : undefined}
      >
        {isMauOnline ? "online" : "offline"}
      </button>
    </main>
  );
}
