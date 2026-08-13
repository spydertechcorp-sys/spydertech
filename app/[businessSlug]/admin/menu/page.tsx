import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import CategoryManager from '@/components/tenant/CategoryManager'

export default async function TenantMenuEditorPage({ params }: { params: { businessSlug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.businessSlug },
    include: {
      categories: { orderBy: { sortOrder: 'asc' } },
      menus: {
        include: {
          items: {
            include: { product: true, category: true }
          }
        }
      }
    }
  })

  if (!business) redirect('/not-found')
  const menu = business.menus[0]

  return (
    <div className="p-8 max-w-7xl mx-auto w-full h-full flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Menu Editor</h1>
          <p className="text-gray-400">Organize what your customers see</p>
        </div>
        <a href={`/${business.slug}/menu`} target="_blank" className="button-lime">Ver menú publicado ↗</a>
      </header>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Editor Sidebar */}
        <div className="w-1/3 flex flex-col bg-spyder-surface border border-spyder-border rounded-xl p-4 overflow-y-auto">
          <h2 className="text-lg font-bold text-white mb-4">Categorías</h2>
          {/* Mockup for Categories Drag and Drop */}
          <div className="space-y-2">
            {menu?.items.reduce((acc, item) => {
              const catName = item.category?.name || 'Uncategorized'
              if (!acc.includes(catName)) acc.push(catName)
              return acc
            }, [] as string[]).map((catName) => (
              <div key={catName} className="p-3 bg-white/5 rounded-lg border border-white/5 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-colors">
                <span className="font-medium text-white">{catName}</span>
                <span className="block text-xs text-gray-500 mt-1">
                  {menu.items.filter(i => i.category?.name === catName || (!i.category && catName === 'Uncategorized')).length} items
                </span>
              </div>
            ))}
          </div>
          
          <CategoryManager business={business} />
        </div>

        {/* Live Preview Pane */}
        <div className="flex-1 bg-black border border-spyder-border rounded-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white z-10 border border-white/10">
            Live Preview
          </div>
          <iframe 
            src={`/${business.slug}?preview=true`}
            className="w-full h-full border-0"
            title="Menu Live Preview"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
