export default function TokenDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-8 w-48 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 w-32 bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="h-10 w-40 bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Price Section Skeleton */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 w-20 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 w-32 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="h-10 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="h-96 bg-gray-700 rounded"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4">
              <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 w-32 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

