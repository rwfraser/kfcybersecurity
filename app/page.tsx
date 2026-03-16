export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-[family-name:var(--font-oswald)]">
      <header className="w-full bg-gray-900 text-white py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center uppercase tracking-wider">kfcybersecurity.com</h1>
      </header>
      <nav className="w-full bg-gray-800 text-white py-3">
        <ul className="flex justify-center gap-8 md:gap-12 text-sm md:text-base uppercase tracking-wide">
          <li><a href="/" className="hover:text-gray-300 transition-colors">Home</a></li>
          <li><a href="/about" className="hover:text-gray-300 transition-colors">About</a></li>
          <li><a href="/help" className="hover:text-gray-300 transition-colors">Help</a></li>
        </ul>
      </nav>
      <main className="flex flex-1 items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-light uppercase tracking-widest text-gray-700">Coming Soon</h2>
      </main>
      <footer className="w-full bg-gray-900 text-white py-6">
        <div className="flex flex-col items-center gap-2 text-sm">
          <a href="/privacy" className="hover:text-gray-300 transition-colors underline">Privacy Policy</a>
          <p>&copy; {new Date().getFullYear()} kfcybersecurity.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
