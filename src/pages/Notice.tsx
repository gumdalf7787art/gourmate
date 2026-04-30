import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Bell, Calendar } from 'lucide-react';

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  content: string;
  isNew?: boolean;
}

export function Notice() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);

  const notices: NoticeItem[] = [
    {
      id: 1,
      title: 'GOURMATE 베타 서비스 런칭 안내',
      date: '2026.04.30',
      isNew: true,
      content: `안녕하세요, GOURMATE 팀입니다.
      
오직 가이드님의 취향과 진정성에 집중하는 맛집 큐레이션 서비스, GOURMATE가 오늘 정식 베타 서비스를 시작했습니다!

가이드님들께서 직접 발굴한 숨은 맛집들이 세상을 더 맛있게 만들 수 있도록 최선을 다하겠습니다. 
사용 중 불편한 점이나 제안하고 싶은 기능이 있다면 언제든 고객센터를 통해 말씀해 주세요.

감사합니다.`
    },
    {
      id: 2,
      title: '[업데이트] 테마 관리 기능 고도화 안내',
      date: '2026.04.28',
      content: `가이드님들의 소중한 피드백을 반영하여 테마 관리 기능이 더욱 편리하게 업데이트되었습니다.

[주요 업데이트 내용]
- 테마 생성 시 포스팅 다중 선택 기능 추가
- 테마별 썸네일 이미지 업로드 최적화
- 테마 키워드(해시태그) 관리 UI 개선

지금 바로 '마이페이지 > 나의 테마 관리'에서 가이드님만의 맛집 지도를 완성해 보세요!`
    },
    {
      id: 3,
      title: '개인정보처리방침 개정 안내 (2026년 5월 1일 시행)',
      date: '2026.04.25',
      content: `안녕하세요, GOURMATE입니다.
      
서비스 제공 범위 확대에 따라 개인정보처리방침이 개정될 예정입니다.

주요 개정 사항:
- 통계 서비스 제공에 따른 데이터 활용 항목 추가
- 제3자 제공 업체 정보 최신화

자세한 내용은 전문 보기 버튼을 통해 확인하실 수 있습니다.`
    },
    {
      id: 4,
      title: '가이드 활동 혜택 및 신뢰 지수(Trust Score) 안내',
      date: '2026.04.20',
      content: `GOURMATE는 건강한 리뷰 생태계를 위해 가이드님의 신뢰 지수(Trust Score) 제도를 운영합니다.

정성스러운 포스팅과 활발한 소통을 통해 신뢰 지수를 높여보세요!
신뢰 지수가 높은 가이드님께는 향후 '공식 가이드' 인증 및 다양한 오프라인 미식 이벤트 초대권이 제공될 예정입니다.`
    }
  ];

  const toggleNotice = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">공지사항</h1>
      </header>

      <main className="flex-1">
        <div className="bg-[#0a0a0a] px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-primary-500" />
            <h2 className="text-xl font-black text-white">GOURMATE 소식</h2>
          </div>
          <p className="text-sm text-gray-500">새로운 기능과 공지사항을 확인해보세요.</p>
        </div>

        <div className="flex flex-col">
          {notices.map((notice) => (
            <div 
              key={notice.id} 
              className={`border-b border-white/5 transition-colors ${openId === notice.id ? 'bg-[#111]' : 'bg-black hover:bg-white/[0.02]'}`}
            >
              <button 
                onClick={() => toggleNotice(notice.id)}
                className="w-full px-5 py-5 text-left flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notice.isNew && (
                      <span className="bg-primary-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">NEW</span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold">
                      <Calendar className="w-3 h-3" />
                      {notice.date}
                    </span>
                  </div>
                  {openId === notice.id ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                </div>
                <h3 className={`text-[15px] font-bold leading-snug transition-colors ${openId === notice.id ? 'text-primary-500' : 'text-gray-200'}`}>
                  {notice.title}
                </h3>
              </button>

              {openId === notice.id && (
                <div className="px-5 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-white/5 shadow-inner">
                    <p className="text-[13px] text-gray-400 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
