import MealsClient from "@/app/(components)/MealsClient"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<p className="animate-pulse">Loading meals...</p>}>
      <MealsClient />
    </Suspense>
  )
}
