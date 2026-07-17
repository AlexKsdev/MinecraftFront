import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { serverFetch } from "@/lib/server/api";
import type { PaginatedProducts } from "@/lib/admin/api";
import { ProductCreate } from "./ProductCreate";
import { ProductRowActions } from "./ProductRowActions";
import styles from "./AdminUsers.module.scss";

const PAGE_SIZE = 20;

/**
 * A Server Component, like the users table: paging travels through the URL, so
 * each view is a fresh server render with no client fetching. Only the row
 * actions and the create form are interactive.
 *
 * Reads /products/manage rather than /products — the admin has to see what they
 * deactivated in order to put it back.
 */
export async function AdminProductsView({ page }: { page: number }) {
  const t = await getTranslations("Admin");
  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  const res = await serverFetch(`/products/manage?${query.toString()}`);

  if (!res.ok) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.empty}>{t("loadFailed")}</p>
        </div>
      </div>
    );
  }

  const data = (await res.json()) as PaginatedProducts;
  const lastPage = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{t("products.title")}</h1>
        <p className={styles.subtitle}>
          {t("products.count", { count: data.total })}
        </p>

        <ProductCreate />

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("products.table.item")}</th>
                <th>{t("products.table.category")}</th>
                <th>{t("products.table.price")}</th>
                <th>{t("products.table.status")}</th>
                <th className={styles.actionsCol}>
                  {t("products.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((product) => (
                <tr key={product.id} className={product.active ? "" : styles.dim}>
                  <td>
                    {product.emoji} {product.name}
                  </td>
                  <td className={styles.mono}>{product.category}</td>
                  <td className={styles.mono}>
                    {product.price.toLocaleString("en-US")}{" "}
                    {product.currency === "GEMS"
                      ? t("products.gems")
                      : t("products.coins")}
                  </td>
                  <td>
                    <span
                      className={`${styles.role} ${
                        product.active ? styles.roleAdmin : ""
                      }`}
                    >
                      {product.active
                        ? t("products.active")
                        : t("products.inactive")}
                    </span>
                  </td>
                  <td>
                    <ProductRowActions product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lastPage > 1 && (
          <nav className={styles.pager} aria-label={t("users.pagination")}>
            <PagerLink
              page={page - 1}
              disabled={page <= 1}
              label={t("users.prev")}
            />
            <span className={styles.pagerState}>
              {t("users.pageOf", { page, total: lastPage })}
            </span>
            <PagerLink
              page={page + 1}
              disabled={page >= lastPage}
              label={t("users.next")}
            />
          </nav>
        )}
      </div>
    </div>
  );
}

function PagerLink({
  page,
  disabled,
  label,
}: {
  page: number;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className={`${styles.pagerBtn} ${styles.pagerBtnOff}`}>{label}</span>
    );
  }
  return (
    <Link className={styles.pagerBtn} href={`/admin/products?page=${page}`}>
      {label}
    </Link>
  );
}
