import { Citation } from '@/types';

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-gray-900">
            {index + 1}. {citation.case_name}
          </h4>
          <p className="text-xs text-gray-600 mt-1">{citation.citation}</p>
        </div>
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>{citation.court}</p>
        <p>{citation.date}</p>
      </div>
      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700 italic">
        "{citation.excerpt}"
      </div>
      {citation.url && (
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
        >
          View on CourtListener →
        </a>
      )}
    </div>
  );
}
