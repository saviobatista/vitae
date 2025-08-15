import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-[120px] w-[120px] text-slate-50 dark:text-slate-600">
              <svg
                width="120"
                height="120"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="512" height="512" fill="transparent" />
                <g transform="translate(156,80)">
                  <rect
                    x="0"
                    y="0"
                    rx="16"
                    ry="16"
                    width="200"
                    height="240"
                    fill="white"
                  />
                  <polygon points="144,0 200,56 200,0" fill="currentColor" />
                  <circle cx="100" cy="60" r="30" fill="currentColor" />
                  <line
                    x1="40"
                    y1="120"
                    x2="160"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1="40"
                    y1="150"
                    x2="160"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <line
                    x1="40"
                    y1="180"
                    x2="160"
                    y2="180"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
          </div>
          <p className="mb-2 text-xl text-slate-600 md:text-2xl dark:text-slate-300">
            Transform your résumé. Tailor your future.
          </p>
          <p className="mx-auto max-w-3xl text-lg text-slate-500 dark:text-slate-400">
            An open source, AI-powered résumé tailoring tool. Upload your CV,
            paste a job description, and let the system reshape your
            professional story to match the role.
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-800 dark:text-slate-200">
          ✨ Features
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">📄</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              Upload & Parse
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Upload your résumé in PDF format and automatically extract
              structured experience data using AI.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">🧠</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              AI-Powered Tailoring
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Paste any job description to receive a customized résumé tailored
              for the specific role.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">📚</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              LaTeX Export
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Generates LaTeX source and a downloadable PDF with professional
              formatting.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">🌐</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              Browser-Based
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Runs entirely in the browser with Next.js, deployable to Vercel or
              GitHub Pages.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">⚙️</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              Plugin-Ready
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Bring your own AI API - ChatGPT, Claude, or any other provider you
              prefer.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:bg-slate-800">
            <div className="mb-4 text-3xl">🚀</div>
            <h3 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
              Open Source
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Free to use, modify, and contribute to. Licensed under CC BY-NC
              4.0.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-800 dark:text-slate-200">
          🧠 How It Works
        </h2>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Upload
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                your résumé (PDF)
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Extract
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                work experiences and skills
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Paste
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                a job description
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                4
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Generate
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                a custom résumé
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                5
              </div>
              <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-200">
                Export
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                as LaTeX-based PDF
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-800 dark:text-slate-200">
          🛠 Tech Stack
        </h2>
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Frontend & Hosting
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Next.js (App Router)</li>
                  <li>• Vercel / GitHub Pages</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-slate-800 dark:text-slate-200">
                  AI & Processing
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• OpenAI GPT (via API)</li>
                  <li>• pdf-lib, pdf-parse</li>
                  <li>• LaTeX → PDF rendering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-800 dark:text-slate-200">
            Ready to transform your résumé?
          </h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/saviobatista/vitae"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
            <Link
              href="/app/upload"
              className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 px-8 py-4 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto border-t border-slate-200 px-6 py-8 dark:border-slate-700">
        <div className="text-center text-slate-500 dark:text-slate-400">
          <p className="mb-2">
            <strong>Vitae</strong> is Latin for &ldquo;life&rdquo; — and the
            heart of <em>curriculum vitae</em>.
          </p>
          <p className="text-sm">
            This project brings your résumé to life: adaptive, tailored, and
            crafted for your next opportunity.
          </p>
        </div>
      </footer>
    </div>
  );
}
