export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { withAuth } from '@/lib/rbac'
import { createAuditLog } from '@/lib/audit'
const schema=z.object({name:z.string().min(2).max(120),slug:z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),ownerId:z.string().min(1),planId:z.string().optional()})
export async function POST(req:NextRequest){return withAuth(req,async(_req,session)=>{try{const data=schema.parse(await req.json());const owner=await prisma.user.findUnique({where:{id:data.ownerId}});if(!owner)return NextResponse.json({error:'Propietario no encontrado.'},{status:404});const business=await prisma.business.create({data:{...data,planId:data.planId||null,status:'SETUP'}});await prisma.businessMember.create({data:{businessId:business.id,userId:owner.id,role:'OWNER'}});await prisma.menu.create({data:{businessId:business.id,title:'Nuestro menú'}});await createAuditLog({userId:session.user.id,action:'BUSINESS_CREATED',resource:'business',resourceId:business.id,result:'SUCCESS',details:{slug:business.slug}});return NextResponse.json({business},{status:201})}catch(error){return NextResponse.json({error:error instanceof z.ZodError?'Datos inválidos o slug no permitido.':'No fue posible crear el negocio.'},{status:400})}},'ADMIN')}
