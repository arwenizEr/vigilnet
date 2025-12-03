import { Airdrop } from '@/lib/types'

interface AirdropCardProps {
  airdrop: Airdrop
}

export default function AirdropCard({ airdrop }: AirdropCardProps) {
  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-700 text-gray-300'
    const statusLower = status.toLowerCase()
    if (statusLower.includes('ongoing') || statusLower.includes('active')) {
      return 'bg-green-900 text-green-300'
    }
    if (statusLower.includes('new') || statusLower.includes('upcoming')) {
      return 'bg-blue-900 text-blue-300'
    }
    return 'bg-gray-700 text-gray-300'
  }

  return (
    <a
      href={airdrop.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex-1 pr-4">
          {airdrop.title}
        </h3>
        {airdrop.status && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(
              airdrop.status
            )}`}
          >
            {airdrop.status}
          </span>
        )}
      </div>

      {airdrop.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {airdrop.description}
        </p>
      )}

      <div className="flex items-center space-x-4">
        {airdrop.reward && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Reward:</span>
            <span className="text-sm font-medium text-yellow-400">
              {airdrop.reward}
            </span>
          </div>
        )}
        {airdrop.category && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Category:</span>
            <span className="text-sm text-gray-300">{airdrop.category}</span>
          </div>
        )}
      </div>
    </a>
  )
}

