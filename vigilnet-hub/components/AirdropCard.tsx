import { Airdrop } from '@/lib/types'

interface AirdropCardProps {
  airdrop: Airdrop
}

export default function AirdropCard({ airdrop }: AirdropCardProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-600'
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('active') || lowerStatus.includes('ongoing')) {
      return 'bg-green-600'
    }
    if (lowerStatus.includes('ended') || lowerStatus.includes('closed')) {
      return 'bg-red-600'
    }
    if (lowerStatus.includes('upcoming') || lowerStatus.includes('soon')) {
      return 'bg-blue-600'
    }
    return 'bg-gray-600'
  }

  return (
    <a
      href={airdrop.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
          {airdrop.title}
        </h3>
        {airdrop.status && (
          <span
            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(
              airdrop.status
            )}`}
          >
            {airdrop.status}
          </span>
        )}
      </div>

      {airdrop.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {airdrop.description}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        {airdrop.reward && (
          <div className="flex items-center text-sm text-gray-300">
            <span className="text-gray-500 mr-1">Reward:</span>
            <span className="font-medium text-green-400">{airdrop.reward}</span>
          </div>
        )}

        {airdrop.category && (
          <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
            {airdrop.category}
          </span>
        )}
      </div>
    </a>
  )
}

