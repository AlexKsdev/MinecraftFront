import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { User } from "lucide-react";
import { CopyServerIp } from "@/components/CopyServerIp/CopyServerIp";
import { SERVER_IP } from "../constants";
import styles from "./CtaSection.module.scss";

export function CtaSection() {
  const t = useTranslations("Home");
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t("cta.heading")}</h2>
        <p className={styles.subtitle}>{t("cta.subtitle")}</p>
        <div className={styles.actions}>
          <CopyServerIp serverIp={SERVER_IP} />
          <Link href="/account" className={styles.accountButton}>
            <User size={14} /> {t("cta.createAccount")}
          </Link>
        </div>
      </div>
    </section>
  );
}
