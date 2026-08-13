import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import SettingsEditor from '@/components/tenant/SettingsEditor'
export default async function TenantSettingsPage({params}:{params:{businessSlug:string}}){const business=await prisma.business.findUnique({where:{slug:params.businessSlug}});if(!business)redirect('/not-found');return <div className="owner-page"><p>IDENTIDAD / PUBLICACIÓN</p><h1>Tu presencia<br/>bajo control.</h1><SettingsEditor business={business}/></div>}
