"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { rupiah } from "@/components/admin/status";
import { cldImg } from "@/lib/cloudinary";
import type { DbCategory, DbProduct } from "@/types";

const ICON_CHOICES = [
  "phone",
  "bolt",
  "globe",
  "droplet",
  "shield",
  "wifi",
  "card",
  "car",
  "tag",
  "qr",
  "users",
  "doc",
  "chat",
  "lock",
];

type Props = {
  categories: DbCategory[];
  products: DbProduct[];
};

type ProductDraft = {
  id?: string;
  category_id: string;
  name: string;
  detail: string;
  price: number;
  variable: boolean;
  group_name: string;
  image_url: string;
  sort: number;
  active: boolean;
};

type CategoryDraft = {
  id?: string;
  name: string;
  slug: string;
  icon: string;
  tile_class: string;
  description: string;
  nominal_title: string;
  field_label: string;
  field_placeholder: string;
  field_hint: string;
  admin_fee: number;
  sort: number;
  active: boolean;
};

const emptyProduct = (categoryId: string): ProductDraft => ({
  category_id: categoryId,
  name: "",
  detail: "",
  price: 0,
  variable: false,
  group_name: "",
  image_url: "",
  sort: 0,
  active: true,
});

const emptyCategory: CategoryDraft = {
  name: "",
  slug: "",
  icon: "card",
  tile_class: "bg-[#EFF6FF] text-[#2563EB]",
  description: "",
  nominal_title: "Pilih Layanan",
  field_label: "Nomor Tujuan",
  field_placeholder: "",
  field_hint: "",
  admin_fee: 0,
  sort: 0,
  active: true,
};

export function ProductsManager({ categories, products }: Props) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [productDraft, setProductDraft] = useState<ProductDraft | null>(null);
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      categoryFilter === "all"
        ? products
        : products.filter((product) => product.category_id === categoryFilter),
    [products, categoryFilter]
  );

  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? "—";

  async function request(url: string, method: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Permintaan gagal.");
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    if (!productDraft) return;
    const url = productDraft.id ? `/api/admin/products/${productDraft.id}` : "/api/admin/products";
    const method = productDraft.id ? "PUT" : "POST";
    if (await request(url, method, productDraft)) setProductDraft(null);
  }

  async function saveCategory(event: FormEvent) {
    event.preventDefault();
    if (!categoryDraft) return;
    const url = categoryDraft.id ? `/api/admin/categories/${categoryDraft.id}` : "/api/admin/categories";
    const method = categoryDraft.id ? "PUT" : "POST";
    if (await request(url, method, categoryDraft)) setCategoryDraft(null);
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="adm-eyebrow">Katalog</p>
          <h1 className="adm-page-title">Produk &amp; Kategori</h1>
          <p className="adm-page-sub">
            Semua yang tampil di bagian layanan dan form checkout situs diatur di sini.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setCategoryDraft({ ...emptyCategory })}
          >
            <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
              +
            </span>
            Kategori
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              setProductDraft(
                emptyProduct(categoryFilter === "all" ? categories[0]?.id ?? "" : categoryFilter)
              )
            }
            disabled={categories.length === 0}
          >
            <span aria-hidden="true" style={{ fontSize: 16, lineHeight: 1 }}>
              +
            </span>
            Tambah produk
          </button>
        </div>
      </header>

      {error ? (
        <p
          className="adm-card adm-card-pad"
          style={{ color: "var(--bad)", fontWeight: 700, fontSize: 13.5 }}
        >
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const count = products.filter((product) => product.category_id === category.id).length;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setCategoryFilter(category.id)}
              className="adm-card adm-card-pad"
              style={{
                textAlign: "left",
                cursor: "pointer",
                borderColor:
                  categoryFilter === category.id ? "var(--clay)" : "var(--line)",
                boxShadow:
                  categoryFilter === category.id ? "0 0 0 3px var(--clay-bg)" : undefined,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="tile shrink-0" style={{ width: 36, height: 36, borderRadius: 10 }}>
                  <Icon name={category.icon as never} className="h-[17px] w-[17px]" />
                </span>
                <span className="badge badge-mute">{count} produk</span>
              </div>
              <p className="mt-3 text-[14px] font-bold">{category.name}</p>
              <p className="text-[11.5px] text-[color:var(--mute)]">/{category.slug}</p>
              <div className="mt-3 flex gap-2">
                <span
                  className={`badge ${category.active ? "badge-ok" : "badge-mute"}`}
                >
                  {category.active ? "Aktif" : "Nonaktif"}
                </span>
                <span
                  className="btn btn-quiet btn-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCategoryDraft({
                      id: category.id,
                      name: category.name,
                      slug: category.slug,
                      icon: category.icon,
                      tile_class: category.tile_class,
                      description: category.description,
                      nominal_title: category.nominal_title,
                      field_label: category.field_label,
                      field_placeholder: category.field_placeholder,
                      field_hint: category.field_hint,
                      admin_fee: category.admin_fee,
                      sort: category.sort,
                      active: category.active,
                    });
                  }}
                >
                  Ubah
                </span>
              </div>
            </button>
          );
        })}
      </section>

      <section className="adm-card">
        <div className="adm-card-head">
          <span className="adm-card-title">
            {categoryFilter === "all"
              ? `Semua produk (${filtered.length})`
              : `${categoryName(categoryFilter)} (${filtered.length})`}
          </span>
          <div className="flex gap-2">
            <select
              className="adm-select"
              style={{ width: "auto", minWidth: 180 }}
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => router.refresh()}>
              <Icon name="chart" className="h-4 w-4" />
              Muat ulang
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="adm-empty">Belum ada produk di kategori ini. Tekan “Tambah produk”.</p>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Grup</th>
                  <th className="text-right">Harga</th>
                  <th>Status</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cldImg(product.image_url, 96)}
                            alt=""
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "1px solid var(--line)",
                            }}
                          />
                        ) : null}
                        <div className="min-w-0">
                          <span className="font-semibold text-[color:var(--ink)]">{product.name}</span>
                          <span className="block truncate text-[12px] text-[color:var(--mute)]">
                            {product.detail || categoryName(product.category_id)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-[12.5px]">{product.group_name || "—"}</td>
                    <td className="adm-num text-right">
                      {product.variable ? "Sesuai tagihan" : rupiah(product.price)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge ${product.active ? "badge-ok" : "badge-mute"}`}
                        onClick={() =>
                          void request(`/api/admin/products/${product.id}`, "PUT", {
                            active: !product.active,
                          })
                        }
                        title="Klik untuk aktif/nonaktifkan"
                      >
                        {product.active ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          className="btn btn-quiet btn-sm"
                          onClick={() =>
                            setProductDraft({
                              id: product.id,
                              category_id: product.category_id,
                              name: product.name,
                              detail: product.detail,
                              price: product.price,
                              variable: product.variable,
                              group_name: product.group_name,
                              image_url: product.image_url ?? "",
                              sort: product.sort,
                              active: product.active,
                            })
                          }
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            if (confirm(`Hapus produk “${product.name}”?`)) {
                              void request(`/api/admin/products/${product.id}`, "DELETE");
                            }
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------- Modal produk ---------- */}
      {productDraft ? (
        <div className="adm-modal-wrap" role="dialog" aria-modal="true">
          <form className="adm-modal" onSubmit={saveProduct}>
            <div className="adm-card-head">
              <span className="adm-card-title">
                {productDraft.id ? "Ubah produk" : "Tambah produk"}
              </span>
              <button
                type="button"
                className="btn btn-quiet btn-sm"
                onClick={() => setProductDraft(null)}
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="adm-label">Kategori</span>
                <select
                  className="adm-select"
                  value={productDraft.category_id}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, category_id: event.target.value })
                  }
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="sm:col-span-2">
                <span className="adm-label">Nama produk</span>
                <input
                  className="adm-input"
                  value={productDraft.name}
                  onChange={(event) => setProductDraft({ ...productDraft, name: event.target.value })}
                  placeholder="mis. Token 50.000"
                  required
                />
              </label>

              <label>
                <span className="adm-label">Grup (opsional)</span>
                <input
                  className="adm-input"
                  value={productDraft.group_name}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, group_name: event.target.value })
                  }
                  placeholder="mis. Token Prabayar"
                />
              </label>

              <label>
                <span className="adm-label">Urutan</span>
                <input
                  className="adm-input"
                  type="number"
                  value={productDraft.sort}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, sort: Number(event.target.value) })
                  }
                />
              </label>

              <label>
                <span className="adm-label">Harga (Rp)</span>
                <input
                  className="adm-input"
                  type="number"
                  min={0}
                  value={productDraft.price}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, price: Number(event.target.value) })
                  }
                  disabled={productDraft.variable}
                />
              </label>

              <div className="flex flex-col justify-center gap-2">
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={productDraft.variable}
                    onChange={(event) =>
                      setProductDraft({ ...productDraft, variable: event.target.checked })
                    }
                  />
                  Harga mengikuti tagihan (Sesuai Tagihan)
                </label>
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={productDraft.active}
                    onChange={(event) =>
                      setProductDraft({ ...productDraft, active: event.target.checked })
                    }
                  />
                  Tampilkan di situs
                </label>
              </div>

              <label className="sm:col-span-2">
                <span className="adm-label">Deskripsi singkat</span>
                <input
                  className="adm-input"
                  value={productDraft.detail}
                  onChange={(event) =>
                    setProductDraft({ ...productDraft, detail: event.target.value })
                  }
                  placeholder="mis. ± 35,8 kWh"
                />
              </label>

              <div className="sm:col-span-2">
                <ImageUpload
                  label="Gambar produk (opsional)"
                  value={productDraft.image_url}
                  onChange={(url) => setProductDraft({ ...productDraft, image_url: url })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: "var(--line)" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setProductDraft(null)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Menyimpan…" : "Simpan produk"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* ---------- Modal kategori ---------- */}
      {categoryDraft ? (
        <div className="adm-modal-wrap" role="dialog" aria-modal="true">
          <form className="adm-modal" onSubmit={saveCategory}>
            <div className="adm-card-head">
              <span className="adm-card-title">
                {categoryDraft.id ? "Ubah kategori" : "Tambah kategori"}
              </span>
              <button
                type="button"
                className="btn btn-quiet btn-sm"
                onClick={() => setCategoryDraft(null)}
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <label>
                <span className="adm-label">Nama kategori</span>
                <input
                  className="adm-input"
                  value={categoryDraft.name}
                  onChange={(event) =>
                    setCategoryDraft({
                      ...categoryDraft,
                      name: event.target.value,
                      slug: categoryDraft.id
                        ? categoryDraft.slug
                        : event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    })
                  }
                  required
                />
              </label>

              <label>
                <span className="adm-label">Slug</span>
                <input
                  className="adm-input"
                  value={categoryDraft.slug}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, slug: event.target.value })
                  }
                  required
                />
              </label>

              <label>
                <span className="adm-label">Ikon</span>
                <select
                  className="adm-select"
                  value={categoryDraft.icon}
                  onChange={(event) => setCategoryDraft({ ...categoryDraft, icon: event.target.value })}
                >
                  {ICON_CHOICES.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="adm-label">Biaya admin (Rp)</span>
                <input
                  className="adm-input"
                  type="number"
                  min={0}
                  value={categoryDraft.admin_fee}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, admin_fee: Number(event.target.value) })
                  }
                />
              </label>

              <label className="sm:col-span-2">
                <span className="adm-label">Deskripsi</span>
                <input
                  className="adm-input"
                  value={categoryDraft.description}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, description: event.target.value })
                  }
                />
              </label>

              <label className="sm:col-span-2">
                <span className="adm-label">Judul pemilihan produk</span>
                <input
                  className="adm-input"
                  value={categoryDraft.nominal_title}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, nominal_title: event.target.value })
                  }
                />
              </label>

              <label>
                <span className="adm-label">Label kolom tujuan</span>
                <input
                  className="adm-input"
                  value={categoryDraft.field_label}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, field_label: event.target.value })
                  }
                />
              </label>

              <label>
                <span className="adm-label">Placeholder tujuan</span>
                <input
                  className="adm-input"
                  value={categoryDraft.field_placeholder}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, field_placeholder: event.target.value })
                  }
                />
              </label>

              <label className="sm:col-span-2">
                <span className="adm-label">Petunjuk tujuan</span>
                <input
                  className="adm-input"
                  value={categoryDraft.field_hint}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, field_hint: event.target.value })
                  }
                />
              </label>

              <label>
                <span className="adm-label">Urutan</span>
                <input
                  className="adm-input"
                  type="number"
                  value={categoryDraft.sort}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, sort: Number(event.target.value) })
                  }
                />
              </label>

              <label className="adm-check self-end pb-2">
                <input
                  type="checkbox"
                  checked={categoryDraft.active}
                  onChange={(event) =>
                    setCategoryDraft({ ...categoryDraft, active: event.target.checked })
                  }
                />
                Kategori aktif
              </label>
            </div>

            <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: "var(--line)" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setCategoryDraft(null)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Menyimpan…" : "Simpan kategori"}
              </button>
              {categoryDraft.id ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={busy}
                  onClick={() => {
                    if (
                      confirm(
                        `Hapus kategori “${categoryDraft.name}”? Produk di dalamnya ikut terhapus.`
                      )
                    ) {
                      void request(`/api/admin/categories/${categoryDraft.id}`, "DELETE").then(
                        (ok) => ok && setCategoryDraft(null)
                      );
                    }
                  }}
                >
                  Hapus
                </button>
              ) : null}
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
