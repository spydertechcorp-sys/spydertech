import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default function TableRedirectPage({ params }: { params: { businessSlug: string, tableId: string } }) {
  // En la vida real, aquí podríamos validar si la mesa existe en la BD
  // Para el flujo UX, seteamos la cookie y redirigimos al menú
  
  cookies().set(`spyder_table_${params.businessSlug}`, params.tableId, { path: '/', maxAge: 60 * 60 * 24 })
  
  redirect(`/${params.businessSlug}/menu`)
}
