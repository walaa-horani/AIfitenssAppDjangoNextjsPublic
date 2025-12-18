import WorkoutClient from "@/app/(components)/WorkoutClient"
import { Suspense } from "react"

export default function Page() {
    return (
        <Suspense fallback={<p className="animate-pulse">Loading workout...</p>}>
            <WorkoutClient />
        </Suspense>
    )
}
