import { Product } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
    id: string,
    name: string,
    priceInCents: number,
    description: string,
    imagePath: string,
}

export function ProductCard({ id, name, priceInCents, description, imagePath }: ProductCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden">

            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} fill alt={name} />
            </div>
            
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size={"lg"} className="w-full">
                    <Link href={`/product/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>

    )
}