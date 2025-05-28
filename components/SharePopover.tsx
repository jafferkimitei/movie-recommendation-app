import { FacebookIcon, Copy, Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SharePopoverProps {
  url: string;
  title: string;
  onClose: () => void;
  positionRef: React.RefObject<HTMLButtonElement>;
}

export default function SharePopover({ url, title, onClose, positionRef }: SharePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !positionRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose, positionRef]);

  const shareText = `${title} - ${url}`;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 mt-2 right-0 bg-slate-900 text-slate-100 p-4 rounded-2xl shadow-xl w-60 animate-fade-in"
    >
      <h3 className="text-sm font-semibold mb-3 text-slate-400">Share this Movie</h3>

      <div className="space-y-2">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-green-400 hover:text-green-500"
        >
          <Send className="w-4 h-4" />
          WhatsApp
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-400 hover:text-blue-500"
        >
          <FacebookIcon className="w-4 h-4" />
          Facebook
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
            onClose();
          }}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-500"
        >
          <Copy className="w-4 h-4" />
          Copy Link
        </button>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
