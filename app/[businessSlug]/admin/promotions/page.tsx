import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import PromotionManager from '@/components/tenant/PromotionManager'
export default async function Promotions({params}:{params:{businessSlug:string}}){const business=await prisma.business.findUnique({where:{slug:params.businessSlug},include:{products:true,promotions:{include:{product:true},orderBy:{createdAt:'desc'}}}});if(!business)redirect('/not-found');return <div className="owner-page"><p>CAMPAÑAS / PROMOCIONES</p><h1>Haz visible<br/>una buena razón para volver.</h1><PromotionManager business={business}/></div>}
