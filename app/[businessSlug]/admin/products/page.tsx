import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import CatalogManager, { CatalogActions } from '@/components/tenant/CatalogManager'

export default async function TenantProductsPage({ params }: { params: { businessSlug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      categories: true,
      products: {
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!business) redirect('/not-found')

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Products</h1>
          <p className="text-gray-400">Manage your catalog for {business.name}</p>
        </div>
        <CatalogManager business={business} />
      </header>

      <div className="bg-spyder-surface border border-spyder-border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-spyder-border">
            {business.products.map((product) => (
              <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white">{product.name}</div>
                  <div className="text-xs text-gray-500 line-clamp-1">{product.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-white/10 rounded-md text-xs">{product.category?.name || 'Uncategorized'}</span>
                </td>
                <td className="px-6 py-4 font-mono">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {product.isAvailable ? (
                    <span className="flex items-center gap-2 text-green-400"><div className="w-2 h-2 rounded-full bg-green-400"></div> Available</span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400"><div className="w-2 h-2 rounded-full bg-red-400"></div> Hidden</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <CatalogActions businessId={business.id} product={product} />
                </td>
              </tr>
            ))}
            
            {business.products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  You haven't added any products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
