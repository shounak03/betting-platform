import { PrismaClient } from "generated/prisma";
import { NextRequest,NextResponse } from "next/server"
import { bettingSchema } from "types";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { creatorId,title, description, resolverId, endTime, amount } = bettingSchema.parse(body);
        // Here you would typically process the betting data, e.g., save it to a database
        console.log("Betting data received:", {
            title,
            description,
            resolverId,
            endTime,
            amount
        });
        const bet = await prisma.bet.create({
            data: {
                title,
                creatorId,
                description,
                resolverId,
                endTime,
                amount
            }
        })
        const betId = bet.id;

        return NextResponse.json(betId, { status: 200 });
    } catch (error) {
        console.error("Error processing betting data:", error);
        return NextResponse.json({ error: "Failed to process betting data" }, { status: 500 });
    }
}