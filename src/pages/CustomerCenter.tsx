import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, HelpCircle, MessageSquare } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export function CustomerCenter() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: '이용 안내',
      question: 'GOURMATE 가이드는 누구나 될 수 있나요?',
      answer: '네, GOURMATE는 자신만의 맛집 취향을 가진 누구나 가이드가 되어 포스팅을 남길 수 있습니다. 정성스러운 포스팅을 꾸준히 작성하시면 더 많은 팔로워와 신뢰 지수(Trust Score)를 얻으실 수 있습니다.'
    },
    {
      id: 2,
      category: '계정/인증',
      question: '비밀번호를 잊어버렸어요.',
      answer: '로그인 화면 하단의 "비밀번호를 잊으셨나요?" 링크를 통해 가입하신 이메일로 임시 비밀번호를 발급받으실 수 있습니다. 로그온 후 설정 페이지에서 비밀번호를 꼭 변경해 주세요.'
    },
    {
      id: 3,
      category: '콘텐츠',
      question: '작성한 포스팅을 수정하거나 삭제하고 싶어요.',
      answer: '마이페이지 > 콘텐츠 관리 > 나의 포스팅 관리 메뉴에서 작성하신 모든 포스팅을 확인하고 수정하거나 삭제할 수 있습니다.'
    },
    {
      id: 4,
      category: '테마 관리',
      question: '테마는 최대 몇 개까지 만들 수 있나요?',
      answer: '현재 베타 서비스 기간 동안 테마 생성 개수에는 제한이 없습니다. 다양한 컨셉의 나만의 맛집 지도를 마음껏 만들어 보세요!'
    },
    {
      id: 5,
      category: '기타',
      question: '부적절한 리뷰나 사용자를 신고하고 싶어요.',
      answer: '해당 포스팅의 더보기 메뉴에서 "신고하기" 버튼을 눌러주시거나, 고객센터 이메일(goodduck2@naver.com)로 증빙 자료와 함께 문의해 주시면 신속히 조치하겠습니다.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white flex-1">고객센터</h1>
      </header>

      <main className="flex-1">
        {/* Support Hero */}
        <section className="px-5 py-10 bg-gradient-to-b from-[#111] to-black border-b border-white/5">
          <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-4">
            <HelpCircle className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="text-2xl font-black text-white leading-tight mb-2">
            무엇을 도와드릴까요?
          </h2>
          <p className="text-sm text-gray-500">궁금하신 점을 FAQ에서 먼저 확인해보세요.</p>
        </section>

        {/* FAQ Section */}
        <section className="py-6">
          <h3 className="px-5 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">자주 묻는 질문</h3>
          <div className="flex flex-col">
            {faqs.map((faq) => (
              <div key={faq.id} className="border-b border-white/5">
                <button 
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-5 py-5 text-left flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-primary-500">{faq.category}</span>
                    <span className="text-[14px] font-bold text-gray-200">{faq.question}</span>
                  </div>
                  {openId === faq.id ? <ChevronUp className="w-4 h-4 text-gray-600 shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-gray-600 shrink-0 mt-1" />}
                </button>
                {openId === faq.id && (
                  <div className="px-5 pb-6 bg-[#0a0a0a]">
                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 text-[13px] text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-5 py-10">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail className="w-32 h-32 text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-bold text-white">1:1 문의하기</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                FAQ로 해결되지 않는 문제는 이메일로 보내주시면<br />
                확인 후 신속하게 답변 드리겠습니다.
              </p>
              
              <div className="bg-black/50 rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Contact Email</span>
                  <span className="text-sm font-bold text-white tracking-wide">goodduck2@naver.com</span>
                </div>
                <a 
                  href="mailto:goodduck2@naver.com"
                  className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className="text-[11px] text-gray-600 text-center mt-4">
                평일 10:00 - 18:00 (주말 및 공휴일 제외)
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
