import Image from "next/image";
import TweetTransformer from "./components/TweetTransformer";
import ThemeSwitcher from "./components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-16">
      {/* Header */}
      <header className="mb-12 flex flex-col items-center">
        <Image
          src="/icon-logo.png"
          alt="PimpAmTweet"
          width={80}
          height={80}
          className="mb-3"
        />
        <p className="text-xs text-muted">
          polish your tweets with AI
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md">
        <TweetTransformer />
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-16 flex flex-col items-center gap-4">
        <ThemeSwitcher />
        <p className="text-[10px] uppercase tracking-widest text-muted/50">
          powered by ollama
        </p>
      </footer>
    </div>
  );
}
