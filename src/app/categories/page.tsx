import { sanityFetch } from "@/sanity/lib/live";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { Category } from "@/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export default async function CategoriesPage() {
  const { data: categories } = await sanityFetch({ query: CATEGORIES_QUERY }) as { data: Category[] };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter">
          Kategori <span className="text-green-600">Pilihan</span>.
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">
          Temukan berbagai produk unggulan dari merchant-merchant di Banjarnegara berdasarkan kategori favorit Anda.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category._id} className="rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100 border border-slate-100">
            {/* Parent Category Header */}
            <Link
              href={`/products?category=${category.slug}`}
              className="group flex items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-white hover:from-green-50 hover:to-white transition-colors duration-300"
            >
              {category.image ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                  <Image
                    src={urlFor(category.image).width(128).height(128).url()}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📦</span>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{category.description || `${category.productCount || 0} produk`}</p>
              </div>
              <div className="flex items-center gap-3">
                {category.productCount ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {category.productCount} produk
                  </span>
                ) : null}
                <span className="text-slate-400 group-hover:text-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Sub-categories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="px-6 pb-6 pt-2 bg-slate-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/products?category=${sub.slug}`}
                      className="group/sub flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-green-50 border border-slate-100 hover:border-green-200 transition-all duration-200"
                    >
                      {sub.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={urlFor(sub.image).width(64).height(64).url()}
                            alt={sub.name}
                            width={32}
                            height={32}
                            className="object-cover group-hover/sub:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-sm">
                          🏷️
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 truncate">{sub.name}</p>
                        {sub.productCount ? (
                          <p className="text-xs text-slate-400">{sub.productCount} produk</p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
