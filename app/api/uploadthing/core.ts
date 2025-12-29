import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for PimpAmTweet - handles tweet image uploads
export const ourFileRouter = {
  // Image uploader for tweet attachments
  tweetImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // No auth for now - add authentication here if needed later
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Tweet image uploaded:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

