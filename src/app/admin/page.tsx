import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useState } from "react";

/**
 * Aggregate order data to get total sales and count of orders.
 *
 * This function uses the Prisma aggregate query to get the total sum
 * and count of all orders in the database.
 *
 * @returns {Promise<{ sum: number, count: number }>}
 *      Object with sum of order prices and count of orders.
 */
async function getSalesData() {
    // O(1) time complexity (assuming a linear time aggregate query)
    // Use the Prisma client's aggregate query to get an array of
    // objects with a single key (the aggregation name) and a single
    // value (the aggregation result).
    const data = await db.order.aggregate({
        // Calculate the sum of all order prices in cents.
        _sum: {
            pricePaidInCents: true
        },
        // Count the number of orders.
        _count: true
    })
    // Destructure the array to get the values.
    return {
        // The sum of order prices in dollars (divide by 100 to get dollars).
        amount: (data._sum.pricePaidInCents || 0) / 100,
        // The number of orders.
        numberOfSales: data._count
    }
}

/**
 * Aggregate user data to get total number of users and their average
 * order value.
 *
 * This function uses Prisma's aggregate query to get the total count of
 * users and the sum of all orders' prices in cents. It then calculates
 * the average order value per user by dividing the sum by the count.
 *
 * @returns {Promise<{ userCount: number, averageValuePerUser: number }>}
 *      Object with total number of users and average order value per user.
 */
async function getUserData() {
    // Aggregate the number of users and the sum of all orders' prices
    // in cents.
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInCents: true },
        }),
    ])
    // Calculate the average order value per user by dividing the sum
    // by the count.
    return {
        userCount,
        averageValuePerUser:
            userCount === 0
                ? 0
                : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
    }
}

async function getProductData() {
    const [activeCount, inactiveCount] = await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true } }),
        db.product.count({ where: { isAvailableForPurchase: false } }),
    ])

    return {
        activeCount,
        inactiveCount
    }
}

export default async function AdminDashboard() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData(),
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard
                title={"Sales"}
                subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
                body={formatCurrency(salesData.amount)}
            />

            <DashboardCard
                title={"Customers"}
                subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
                body={formatNumber(userData.userCount)}
            />

            <DashboardCard
                title={"Active Products"}
                subtitle={`${formatNumber(userData.averageValuePerUser)} InActive`}
                body={`${formatNumber(userData.averageValuePerUser)} Active`}
            />
        </div>
    )
}

type DashboardCardProps = {
    title: string
    subtitle: string
    body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
    return (
        <Card>
            <CardHeader>{title}</CardHeader>
            <CardDescription>{subtitle}</CardDescription>

            <CardContent>
                <p>{body}</p>
            </CardContent>
        </Card>
    )
}