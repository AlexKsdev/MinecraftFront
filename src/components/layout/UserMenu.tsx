"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { Coins, Gem, LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/lib/auth/api";
import {
  getProfile,
  avatarUrl,
  UnauthorizedError,
  type Profile,
} from "@/lib/account/api";
import {
  useBalances,
  publishBalances,
  clearBalances,
} from "@/lib/account/balances";
import styles from "./UserMenu.module.scss";

export function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const balances = useBalances();
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((p) => {
        if (!active) return;
        setProfile(p);
        publishBalances({ coins: p.coins, gems: p.gems });
      })
      .catch((err: unknown) => {
        if (err instanceof UnauthorizedError) return;
      });
    return () => {
      active = false;
    };
  }, []);

  // Click-to-open menu: close on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const src = profile
    ? avatarUrl(profile)
    : `https://mc-heads.net/avatar/${encodeURIComponent(name)}/64`;

  function handleLogout() {
    // Fire-and-forget: only the server can clear the httpOnly session cookies.
    void logout();
    clearBalances();
    setOpen(false);
    router.push("/");
  }

  const coins = balances?.coins ?? profile?.coins ?? null;
  const gems = balances?.gems ?? profile?.gems ?? null;

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        className={styles.avatarBtn}
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Image
          src={src}
          alt={name}
          width={36}
          height={36}
          className={styles.avatar}
          unoptimized
        />
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.head}>
            <Image
              src={src}
              alt={name}
              width={40}
              height={40}
              className={styles.popAvatar}
              unoptimized
            />
            <div className={styles.identity}>
              <p className={styles.name}>{profile?.name ?? name}</p>
              {profile && <span className={styles.rank}>{profile.rank}</span>}
            </div>
          </div>

          <div className={styles.balances}>
            <span className={`${styles.balance} ${styles.coins}`}>
              <Coins size={14} />
              {coins !== null ? coins.toLocaleString("en-US") : "—"}
            </span>
            <span className={`${styles.balance} ${styles.gems}`}>
              <Gem size={14} />
              {gems !== null ? gems.toLocaleString("en-US") : "—"}
            </span>
          </div>

          <Link
            href="/account"
            className={styles.accountBtn}
            onClick={() => setOpen(false)}
          >
            <UserIcon size={14} /> Go to Account
          </Link>
          <button className={styles.logoutBtn} type="button" onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
