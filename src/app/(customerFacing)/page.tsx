import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

async function getMostPopularProducts() {
    const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { orders: { _count: "desc" }, },
        take: 6,
    })
    return products
}

async function getLatestProducts() {
    const products = await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    })
    return products
}

export default function HomePage() {
    return (
        <main className="space-y-12">
            <ProductGridSection title="Most Popular" productsFetcher={getMostPopularProducts} />
            <ProductGridSection title="Latest" productsFetcher={getLatestProducts} />
        </main>
    )
}

type productGridSectionProps = {
    title: string,
    productsFetcher: () => Promise<Product[]>
}

async function ProductGridSection({ title, productsFetcher }: productGridSectionProps) {
    const products = await productsFetcher()

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text=3xl">{title}</h2>
                <Button variant={"outline"} asChild>
                    <Link href="/products" className="space-x-2"><span>View All</span> <ArrowRight className="size-4" /></Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product =>
                    <ProductCard key={product.id} {...product} />
                )}
            </div>
        </div>
    )
}