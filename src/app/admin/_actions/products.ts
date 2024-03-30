'use server'

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { redirect } from "next/navigation"

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))

const addSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required"),
})

export async function addProduct(formData: FormData) {

    const res = addSchema.safeParse(Object.fromEntries(formData.entries()))
    if (res.success === false) {
        return res.error.formErrors.fieldErrors
    }
    const data = res.data

    await fs.mkdir("products", { recursive: true })
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

    await fs.mkdir("pubilc/products", { recursive: true })
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(`pubilc${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

    await db.product.create({
        data: {
            name: data.name,
            description: data.description,
            priceInCents: data.priceInCents,
            filePath,
            imagePath
        }
    })
    console.log(formData)
    redirect("/admin/products")
}