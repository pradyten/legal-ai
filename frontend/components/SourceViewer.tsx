import { RetrievedChunk } from '@/types';

interface SourceViewerProps {
  chunks: RetrievedChunk[];
}

export default function SourceViewer({ chunks }: SourceViewerProps) {
  if (chunks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        <p>Ask a question to see retrieved sources</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 sticky top-0 bg-white pb-2 border-b">
        Retrieved Sources ({chunks.length})
      </h3>
      <div className="space-y-4">
        {chunks.map((chunk, idx) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">
                  {idx + 1}. {chunk.metadata.case_name || 'Unknown Case'}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {chunk.metadata.citation || 'No citation'}
                </p>
              </div>
              {chunk.metadata.score && (
                <span className="text-xs text-gray-500 ml-2">
                  {(chunk.metadata.score * 100).toFixed(0)}% match
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 space-y-1 mb-2">
              <p>{chunk.metadata.court || 'Unknown court'}</p>
              <p>{chunk.metadata.date || 'Unknown date'}</p>
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
              {chunk.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
