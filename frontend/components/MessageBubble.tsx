import { Message } from '@/types';
import ConfidenceBadge from './ConfidenceBadge';

interface MessageBubbleProps {
  message: Message;
  onSelectMessage?: (message: Message) => void;
}

export default function MessageBubble({ message, onSelectMessage }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900 border border-gray-200'
        }`}
        onClick={() => !isUser && onSelectMessage?.(message)}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {!isUser && message.confidence && (
          <div className="mt-3 flex items-center gap-2">
            <ConfidenceBadge
              confidence={message.confidence as 'high' | 'medium' | 'low' | 'insufficient'}
            />
            {message.citations && message.citations.length > 0 && (
              <span className="text-xs text-gray-500">
                {message.citations.length} citation{message.citations.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {!isUser && (
          <div className="mt-2 text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
