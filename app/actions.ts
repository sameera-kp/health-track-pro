'use server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// 1. Patient- add
export async function addPatient(formData: FormData) {
  const name = formData.get('name') as string
  const age = parseInt(formData.get('age') as string)
  const bloodGroup = formData.get('bloodGroup') as string
  const condition = formData.get('condition') as string

  await prisma.patient.create({
    data: {
      name,
      age,
      blood_group: bloodGroup,
      condition,
    },
  })

  revalidatePath('/')
}

// 2. Patient- delete 
export async function deletePatient(id: number) {
  await prisma.patient.delete({
    where: { id },
  })
  
  revalidatePath('/')
}