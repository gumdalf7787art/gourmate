import { AdminLayout } from '@/components/AdminLayout';
import { Send, Users, Shield, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export function AdminCampaigns() {
  const [target, setTarget] = useState<'all' | 'verified' | 'specific'>('all');

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">CAMPAIGNS & NOTIFICATIONS</h1>
            <p className="text-gray-500 text-sm font-medium">서비스 공지사항 및 푸시 알림 캠페인을 생성하고 발송합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Composer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary-500" />
                새 알림 작성
              </h2>

              <div className="space-y-6">
                {/* Target Selection */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">발송 대상</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setTarget('all')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                        target === 'all' ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-[#111] border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <Users className="w-6 h-6" />
                      <span className="text-[11px] font-black uppercase tracking-wider">전체 회원</span>
                    </button>
                    <button 
                      onClick={() => setTarget('verified')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                        target === 'verified' ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-[#111] border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <Shield className="w-6 h-6" />
                      <span className="text-[11px] font-black uppercase tracking-wider">인증 가이드</span>
                    </button>
                    <button 
                      onClick={() => setTarget('specific')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                        target === 'specific' ? 'bg-primary-500/10 border-primary-500 text-primary-500' : 'bg-[#111] border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <FileText className="w-6 h-6" />
                      <span className="text-[11px] font-black uppercase tracking-wider">조건부 발송</span>
                    </button>
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">메시지 내용</label>
                  <input 
                    type="text" 
                    placeholder="알림 제목을 입력하세요"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <textarea 
                    rows={4}
                    placeholder="알림 상세 내용을 입력하세요 (최대 150자)"
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  ></textarea>
                </div>

                {/* Attachments & Options */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-[11px] font-bold text-gray-400 hover:text-white transition-colors">
                    <ImageIcon className="w-4 h-4" /> 이미지 첨부
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-[11px] font-bold text-gray-400 hover:text-white transition-colors">
                    <Clock className="w-4 h-4" /> 예약 발송
                  </button>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button className="px-6 py-3 bg-[#111] text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-colors">
                    임시저장
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('알림을 발송하시겠습니까?')) {
                        alert('알림 발송이 예약/진행됩니다.');
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-600 transition-colors shadow-[0_0_20px_rgba(255,107,0,0.3)]"
                  >
                    <Send className="w-4 h-4" /> 즉시 발송
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview & History */}
          <div className="space-y-6">
            <div className="bg-black border border-white/10 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500/0 via-primary-500 to-primary-500/0"></div>
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Mobile Preview</h3>
              
              <div className="w-[280px] h-[150px] mx-auto bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border border-white/5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-primary-500 rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">G</span>
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase">GOURMATE</span>
                  <span className="text-[10px] text-gray-500 ml-auto">Now</span>
                </div>
                <p className="text-sm font-bold text-white leading-tight mb-1">여름맞이 부산 맛집 테마 오픈! 🏖️</p>
                <p className="text-xs text-gray-400 line-clamp-2">지금 바로 부산 토박이 가이드들이 선정한 최고의 돼지국밥과 밀면 맛집을 확인해보세요.</p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">최근 발송 내역</h3>
              <div className="space-y-4">
                {[
                  { title: '앱 업데이트 안내 (v1.2)', target: '전체 회원', success: '98%', time: '2026.04.28' },
                  { title: '우수 가이드 선정 축하', target: '특정 회원 (120명)', success: '100%', time: '2026.04.25' }
                ].map((log, i) => (
                  <div key={i} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <span className="text-[13px] font-bold text-gray-300">{log.title}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500 font-bold">{log.target}</span>
                      <span className="text-[10px] text-primary-500 font-black">도달률 {log.success}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                View All History
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
