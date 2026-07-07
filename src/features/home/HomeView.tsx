import { Hero } from "./components/Hero";
import { QuickLinks } from "./components/QuickLinks";
import { StatsSection } from "./components/StatsSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { PricingSection } from "./components/PricingSection";
import { CtaSection } from "./components/CtaSection";
import styles from "./HomeView.module.scss";

export function HomeView() {
  return (
    <div className={styles.page}>
      <Hero />
      <QuickLinks />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
    </div>
  );
}
