"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Coins, Gem, LogOut, User as UserIcon } from "lucide-react";
import { clearSession } from "@/lib/auth/api";
import {
  getProfile,
  avatarUrl,
  UnauthorizedError,
  type Profile,
} from "@/lib/account/api";
import styles from "./UserMenu.module.scss";

export function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    getProfile()
      .then((p) => active && setProfile(p))
      .catch((err: unknown) => {
        if (err instanceof UnauthorizedError) return;
      });
    return () => {
      active = false;
    };
  }, []);

  const src = profile
    ? avatarUrl(profile)
    : `https://mc-heads.net/avatar/${encodeURIComponent(name)}/64`;

  function logout() {
    clearSession();
    setOpen(false);
    router.push("/");
  }

  return (
    <div
      className={styles.wrap}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
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
              {profile ? profile.coins.toLocaleString("en-US") : "—"}
            </span>
            <span className={`${styles.balance} ${styles.gems}`}>
              <Gem size={14} />
              {profile ? profile.gems.toLocaleString("en-US") : "—"}
            </span>
          </div>

          <Link
            href="/account"
            className={styles.accountBtn}
            onClick={() => setOpen(false)}
          >
            <UserIcon size={14} /> Go to Account
          </Link>
          <button className={styles.logoutBtn} type="button" onClick={logout}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
