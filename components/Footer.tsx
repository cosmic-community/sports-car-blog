import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-carbon-950 border-t border-carbon-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-racing-600 flex items-center justify-center">
                <span className="text-lg">🏎️</span>
              </div>
              <span className="text-white font-bold text-lg">
                Sports Car <span className="text-racing-500">Blog</span>
              </span>
            </Link>
            <p className="text-carbon-400 text-sm leading-relaxed">
              Your source for the latest stories, reviews, and passion for high-performance sports cars.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/posts" className="text-carbon-400 hover:text-racing-400 text-sm transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-carbon-400 hover:text-racing-400 text-sm transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/authors" className="text-carbon-400 hover:text-racing-400 text-sm transition-colors">
                  Authors
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Powered By</h3>
            <p className="text-carbon-400 text-sm leading-relaxed">
              Built with{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-racing-400 hover:text-racing-300 transition-colors"
              >
                Next.js
              </a>{' '}
              and{' '}
              <a
                href="https://www.cosmicjs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-racing-400 hover:text-racing-300 transition-colors"
              >
                Cosmic
              </a>
              .
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-carbon-800/50 text-center">
          <p className="text-carbon-500 text-sm">
            &copy; {new Date().getFullYear()} Sports Car Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}