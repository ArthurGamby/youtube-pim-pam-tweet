import { NextRequest, NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

// GET all saved tweets
export async function GET() {
  try {
    const tweets = await prisma.savedTweet.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(tweets)
  } catch (error) {
    console.error("Error fetching tweets:", error)
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    )
  }
}

// POST save a new tweet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tweet = await prisma.savedTweet.create({
      data: {
        original: body.original,
        transformed: body.transformed,
        context: body.context || null,
        imageUrl: body.imageUrl || null,
        imageAlt: body.imageAlt || null,
      },
    })
    return NextResponse.json(tweet, { status: 201 })
  } catch (error) {
    console.error("Error saving tweet:", error)
    return NextResponse.json(
      { error: "Failed to save tweet" },
      { status: 500 }
    )
  }
}

// DELETE a saved tweet by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json(
        { error: "Tweet ID is required" },
        { status: 400 }
      )
    }

    await prisma.savedTweet.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tweet:", error)
    return NextResponse.json(
      { error: "Failed to delete tweet" },
      { status: 500 }
    )
  }
}

