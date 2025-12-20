import TweetTransformer from "./components/TweetTransformer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-xl font-medium tracking-tight text-foreground">
          pimpamtweet
        </h1>
        <p className="mt-1 text-xs text-muted">
          polish your tweets with AI
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md">
        <TweetTransformer />
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-16">
        <p className="text-[10px] uppercase tracking-widest text-muted/50">
          powered by ollama
        </p>
      </footer>
    </div>
  );
}
