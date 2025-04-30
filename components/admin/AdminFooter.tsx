import { Sun } from "lucide-react"

export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mb-10 mt-20 flex justify-center">
      <div className="bg-card px-6 py-4 rounded-xl border-2 border-yellow-500/10 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center text-sm">
          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-muted-foreground">Power Solar Admin Console v1.0</span>
          <div className="mx-3 w-px h-4 bg-yellow-200 dark:bg-yellow-800/40"></div>
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                System Online
            </span>
          </div>
      </div>
    </footer>
  )
}