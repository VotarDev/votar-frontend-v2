import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

interface MonitoringCardProps {
  title: string;
  description: string;
  url: string;
  copyRef: any;
  onCopy: () => void;
  copied: boolean;
  icon: React.ElementType;
  gradient?: string;
}

export default function MonitoringCard({
  title,
  description,
  url,
  copyRef,
  onCopy,
  copied,
  icon: Icon,
  gradient,
}: MonitoringCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6 flex-col lg:flex-row">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* URL Container */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Monitoring URL
            </span>
          </div>
          <div
            ref={copyRef}
            className="text-sm text-blue-600 font-mono break-all bg-white rounded p-3 border border-gray-200"
          >
            <Link href={url} target="_blank">
              {url}
            </Link>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={onCopy}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            copied
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 active:scale-98"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Monitoring Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
