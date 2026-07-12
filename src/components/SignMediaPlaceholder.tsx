import { Hand, EyeOff } from 'lucide-react';

interface SignMediaPlaceholderProps {
  label: string;
  category: 'alphabet' | 'number';
}

export default function SignMediaPlaceholder({ label, category }: SignMediaPlaceholderProps) {
  return (
    <div className="relative flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-6 text-center select-none">
      <div className="absolute top-3 left-3 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-brand-600">
        Placeholder
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        <Hand className="h-7 w-7 stroke-[1.5]" />
      </div>

      <div className="mt-4">
        <h3 className="font-serif text-lg font-semibold text-brand-800">
          Sign Reference Pending
        </h3>
        <p className="mt-1 max-w-xs text-xs text-[#86827a]">
          Visual reference for &ldquo;{label}&rdquo; ({category === 'alphabet' ? 'Letter' : 'Digit'}) is currently in preparation.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1.5 rounded-md bg-white border border-brand-100 px-3 py-1 text-xs text-[#5d5a55]">
        <EyeOff className="h-3.5 w-3.5" />
        <span>ISLRTC Reference Needed</span>
      </div>

      <div className="absolute bottom-4 right-4 font-serif text-4xl font-extrabold text-brand-200">
        {label}
      </div>
    </div>
  );
}
