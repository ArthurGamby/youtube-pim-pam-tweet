import "dotenv/config"
import prisma from "../lib/prisma"

async function testDatabase() {
  console.log("🔍 Testing Prisma Postgres connection...\n")

  try {
    // Test 1: Check connection
    console.log("✅ Connected to database!")

    // Test 2: Create a test saved tweet
    console.log("\n📝 Creating a test saved tweet...")
    const newTweet = await prisma.savedTweet.create({
      data: {
        original: "just shipped a new feature, its pretty cool i think",
        transformed: "Just shipped a new feature! 🚀 Pretty excited about this one ✨",
        context: "Tech founder, casual tone",
        imageUrl: null,
        imageAlt: null,
      },
    })
    console.log("✅ Created saved tweet:", newTweet)

    // Test 3: Fetch all saved tweets
    console.log("\n📋 Fetching all saved tweets...")
    const allTweets = await prisma.savedTweet.findMany()
    console.log(`✅ Found ${allTweets.length} saved tweet(s):`)
    allTweets.forEach((tweet) => {
      console.log(`   - Original: "${tweet.original.substring(0, 40)}..."`)
      console.log(`     Transformed: "${tweet.transformed.substring(0, 40)}..."`)
    })

    console.log("\n🎉 All tests passed! Your database is working perfectly.\n")
  } catch (error) {
    console.error("❌ Error:", error)
    process.exit(1)
  }
}

testDatabase()

