import { Testnet } from '@/lib/types'

interface TestnetCardProps {
  testnet: Testnet
}

export default function TestnetCard({ testnet }: TestnetCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {testnet.name}
          </h3>
          <p className="text-sm text-gray-400">Chain ID: {testnet.chainId}</p>
        </div>
        <span className="text-xs font-medium bg-purple-900 text-purple-300 px-2 py-1 rounded">
          Testnet
        </span>
      </div>

      {testnet.nativeCurrency && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-1">Native Currency</p>
          <p className="text-sm text-white">
            {testnet.nativeCurrency.name} ({testnet.nativeCurrency.symbol})
          </p>
        </div>
      )}

      {testnet.rpc && testnet.rpc.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">RPC Endpoints</p>
          <div className="space-y-1">
            {testnet.rpc.slice(0, 3).map((rpc, index) => (
              <a
                key={index}
                href={rpc}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:text-blue-300 truncate"
              >
                {rpc}
              </a>
            ))}
            {testnet.rpc.length > 3 && (
              <p className="text-xs text-gray-500">
                +{testnet.rpc.length - 3} more
              </p>
            )}
          </div>
        </div>
      )}

      {testnet.explorers && testnet.explorers.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Explorers</p>
          <div className="space-y-1">
            {testnet.explorers.slice(0, 2).map((explorer, index) => (
              <a
                key={index}
                href={explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:text-blue-300 truncate"
              >
                {explorer}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

