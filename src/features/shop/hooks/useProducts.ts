"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getProducts, type Product, type ProductSort } from "@/lib/shop/api";
import { categories, PAGE_SIZE, MIN_LOADING_MS } from "../constants";

/**
 * Owns the product listing: paginated fetch driven by category/sort/page, with
 * a minimum loading window so the skeleton doesn't flicker on fast responses.
 * `error` and `setError` are exposed because gem checkout shares the same slot
 * (a checkout failure replaces the listing, matching the original behavior).
 */
export function useProducts() {
  const t = useTranslations("Shop");

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sort, setSort] = useState<"" | ProductSort>("");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCategoryId =
    categories.find((c) => c.value === activeCategory)?.id ?? "all";

  // Re-fetch the current page whenever the filter, sort, or page changes.
  useEffect(() => {
    let active = true;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    const start = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    // Applies the settled result, padding out to MIN_LOADING_MS if the
    // response came back faster than that so the skeleton doesn't flicker.
    function settle(apply: () => void) {
      if (!active) return;
      const remaining = MIN_LOADING_MS - (Date.now() - start);
      if (remaining > 0) {
        delayTimer = setTimeout(() => {
          if (active) apply();
        }, remaining);
      } else {
        apply();
      }
    }

    getProducts({
      page,
      limit: PAGE_SIZE,
      category: activeCategory,
      sort: sort || undefined,
    })
      .then((data) => {
        settle(() => {
          setProducts(data.items);
          setTotal(data.total);
          setError(null);
          setLoading(false);
        });
      })
      .catch((err: unknown) => {
        settle(() => {
          setError(err instanceof Error ? err.message : t("errors.loadFailed"));
          setLoading(false);
        });
      });

    return () => {
      active = false;
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [activeCategory, sort, page, t]);

  function selectCategory(category: string) {
    setActiveCategory(category);
    setPage(1);
  }

  function changeSort(value: "" | ProductSort) {
    setSort(value);
    setPage(1);
  }

  return {
    products,
    total,
    loading,
    error,
    setError,
    activeCategory,
    activeCategoryId,
    sort,
    page,
    totalPages,
    setPage,
    selectCategory,
    changeSort,
  };
}
