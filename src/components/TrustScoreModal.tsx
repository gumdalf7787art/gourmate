import { X, Info, ShieldCheck, Wallet, FileText, Users, Activity } from 'lucide-react';
import { Guide } from '@/data/mock';

interface TrustScoreModalProps {
  guide: Guide;
  onClose: () => void;
}

export function TrustScoreModal({ guide, onClose }: TrustScoreModalProps) {
  const metrics = guide.trustMetrics || {
    paidRatio: 85,
    contentQuality: 80,
    communityScore: 75,
    activityIndex: 85
  };

  const getGrade = (score: number) => {
    if (score >= 95) return { name: 'Grand Master', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    if (score >= 90) return { name: 'Verified Expert', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' };
    if (score >= 80) return { name: 'Trusted Guide', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    return { name: 'Rising Gourmet', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  };

  const grade = getGrade(guide.trustScore);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              <h3 className="text-sm font-black text-white tracking-widest uppercase opacity-80">Gourmate Trust Index</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center relative mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-white/5 flex items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">{guide.trustScore}</span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary-500 rounded-full shadow-lg">
                <span className="text-[10px] font-black text-white whitespace-nowrap">TOP 1%</span>
              </div>
            </div>
            <div className={`inline-flex px-3 py-1 rounded-full border ${grade.bg} ${grade.border} ${grade.color} text-[10px] font-black uppercase tracking-widest mb-2`}>
              {grade.name}
            </div>
            <p className="text-gray-500 text-xs font-medium">실제 방문 기록과 커뮤니티 반응을 종합한 점수입니다.</p>
          </div>

          <div className="space-y-6">
            {/* Metric 1: Paid Ratio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-300">내돈내산 인증 비율 (40%)</span>
                </div>
                <span className="text-xs font-black text-white">{metrics.paidRatio}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${metrics.paidRatio}%` }} />
              </div>
            </div>

            {/* Metric 2: Content Quality */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-300">콘텐츠 질 및 정보성 (30%)</span>
                </div>
                <span className="text-xs font-black text-white">{metrics.contentQuality}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metrics.contentQuality}%` }} />
              </div>
            </div>

            {/* Metric 3: Community Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-300">커뮤니티 검증 (20%)</span>
                </div>
                <span className="text-xs font-black text-white">{metrics.communityScore}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metrics.communityScore}%` }} />
              </div>
            </div>

            {/* Metric 4: Activity Index */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-300">활동 꾸준함 (10%)</span>
                </div>
                <span className="text-xs font-black text-white">{metrics.activityIndex}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${metrics.activityIndex}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3">
            <Info className="w-4 h-4 text-primary-500 shrink-0" />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              구르메이트는 투명한 미식 문화를 지향합니다. 인위적인 활동이나 어뷰징이 감지될 경우 신뢰지수가 즉시 조정될 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
