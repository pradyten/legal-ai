interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
}

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const styles = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-orange-100 text-orange-800 border-orange-300',
    insufficient: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[confidence]}`}
    >
      {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
    </span>
  );
}
