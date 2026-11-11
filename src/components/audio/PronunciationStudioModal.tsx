/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundService, VoiceOption } from '../../services/audioService';
import {
  Volume2,
  X,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';

interface PronunciationStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PronunciationStudioModal: React.FC<PronunciationStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [enVoices, setEnVoices] = useState<VoiceOption[]>([]);
  const [viVoices, setViVoices] = useState<VoiceOption[]>([]);
  const [selectedEnURI, setSelectedEnURI] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(0.88);
  const [speechPitch, setSpeechPitch] = useState<number>(1.05);
  const [activeTab, setActiveTab] = useState<'voices' | 'numbers' | 'pairs' | 'math' | 'praises'>('voices');

  useEffect(() => {
    const updateVoiceList = () => {
      const en = soundService.getAvailableEnglishVoices();
      const vi = soundService.getAvailableVietnameseVoices();
      setEnVoices(en);
      setViVoices(vi);

      const settings = soundService.getSettings();
      if (settings.selectedEnVoiceURI) {
        setSelectedEnURI(settings.selectedEnVoiceURI);
      } else if (en.length > 0) {
        setSelectedEnURI(en[0].voiceURI);
      }
      if (settings.speechRate) setSpeechRate(settings.speechRate);
      if (settings.speechPitch) setSpeechPitch(settings.speechPitch);
    };

    updateVoiceList();
    const unsub = soundService.subscribeVoices(updateVoiceList);
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleSelectEnVoice = (uri: string) => {
    setSelectedEnURI(uri);
    soundService.updateSettings({ selectedEnVoiceURI: uri });
    soundService.speak('Hello! I am your Math Robot friend!', 'en');
  };

  const handleRateChange = (r: number) => {
    setSpeechRate(r);
    soundService.updateSettings({ speechRate: r });
  };

  const handlePitchChange = (p: number) => {
    setSpeechPitch(p);
    soundService.updateSettings({ speechPitch: p });
  };

  const hasEn = enVoices.length > 0;

  // Test categories data
  const NUMBER_TESTS = [
    { word: 'Zero', ipa: '/ˈzɪroʊ/', vi: 'Số 0' },
    { word: 'One', ipa: '/wʌn/', vi: 'Số 1' },
    { word: 'Two', ipa: '/tuː/', vi: 'Số 2' },
    { word: 'Three', ipa: '/θriː/', vi: 'Số 3 (lưỡi kẹp giữa 2 răng th)' },
    { word: 'Four', ipa: '/fɔːr/', vi: 'Số 4' },
    { word: 'Five', ipa: '/faɪv/', vi: 'Số 5 (rõ âm cuối v)' },
    { word: 'Six', ipa: '/sɪks/', vi: 'Số 6 (rõ âm cuối ks)' },
    { word: 'Seven', ipa: '/ˈsɛvn/', vi: 'Số 7' },
    { word: 'Eight', ipa: '/eɪt/', vi: 'Số 8 (rõ âm cuối t)' },
    { word: 'Nine', ipa: '/naɪn/', vi: 'Số 9' },
    { word: 'Ten', ipa: '/tɛn/', vi: 'Số 10' },
    { word: 'Eleven', ipa: '/ɪˈlɛvn/', vi: 'Số 11' },
    { word: 'Twelve', ipa: '/twɛlv/', vi: 'Số 12 (rõ âm cuối lv)' },
    { word: 'Twenty', ipa: '/ˈtwɛnti/', vi: 'Số 20' },
    { word: 'Fifty', ipa: '/ˈfɪfti/', vi: 'Số 50' },
    { word: 'One Hundred', ipa: '/wʌn ˈhʌndrəd/', vi: 'Số 100' },
  ];

  const TRICKY_PAIRS = [
    {
      wordA: 'Three',
      ipaA: '/θriː/',
      descA: 'Số ba (đặt đầu lưỡi giữa hai răng thổi hơi th)',
      wordB: 'Tree',
      ipaB: '/triː/',
      descB: 'Cây cối (âm tr bật hơi dứt khoát)',
    },
    {
      wordA: 'Thirteen',
      ipaA: '/ˌθɜːrˈtiːn/',
      descA: 'Số 13 (nhấn mạnh trọng âm đuôi -TEEN kéo dài)',
      wordB: 'Thirty',
      ipaB: '/ˈθɜːrti/',
      descB: 'Số 30 (nhấn trọng âm đầu THIR-, đuôi -ty ngắn)',
    },
    {
      wordA: 'Fourteen',
      ipaA: '/ˌfɔːrˈtiːn/',
      descA: 'Số 14 (nhấn mạnh đuôi -TEEN)',
      wordB: 'Forty',
      ipaB: '/ˈfɔːrti/',
      descB: 'Số 40 (nhấn trọng âm đầu FOR-)',
    },
    {
      wordA: 'Fifteen',
      ipaA: '/ˌfɪfˈtiːn/',
      descA: 'Số 15 (nhấn mạnh đuôi -TEEN)',
      wordB: 'Fifty',
      ipaB: '/ˈfɪfti/',
      descB: 'Số 50 (nhấn trọng âm đầu FIF-)',
    },
    {
      wordA: 'Eighteen',
      ipaA: '/ˌeɪˈtiːn/',
      descA: 'Số 18 (nhấn mạnh đuôi -TEEN)',
      wordB: 'Eighty',
      ipaB: '/ˈeɪti/',
      descB: 'Số 80 (nhấn trọng âm đầu EIGH-)',
    },
  ];

  const MATH_FORMULAS = [
    { expr: '3 + 2 = 5', readEn: 'Three plus two equals five.', readVi: 'Ba cộng hai bằng năm' },
    { expr: '7 - 4 = 3', readEn: 'Seven minus four equals three.', readVi: 'Bảy trừ bốn bằng ba' },
    { expr: '10 + 20 = 30', readEn: 'Ten plus twenty equals thirty.', readVi: 'Mười cộng hai mươi bằng ba mươi' },
    { expr: '16 < 19', readEn: 'Sixteen is less than nineteen.', readVi: 'Mười sáu bé hơn mười chín' },
    { expr: '42 > 25', readEn: 'Forty-two is greater than twenty-five.', readVi: 'Bốn mươi hai lớn hơn hai mươi lăm' },
  ];

  const PRAISE_LIST = [
    { text: 'Great job!', vi: 'Làm tốt lắm!', type: 'correct' },
    { text: 'Excellent!', vi: 'Xuất sắc!', type: 'correct' },
    { text: 'Well done!', vi: 'Giỏi lắm!', type: 'correct' },
    { text: 'Amazing!', vi: 'Kỳ diệu quá!', type: 'correct' },
    { text: 'You got it!', vi: 'Em đã tìm ra rồi!', type: 'correct' },
    { text: 'Try again!', vi: 'Hãy thử lại nhé!', type: 'wrong' },
    { text: 'You can do it!', vi: 'Em sẽ làm được mà!', type: 'wrong' },
    { text: 'Keep trying!', vi: 'Tiếp tục cố gắng nào!', type: 'wrong' },
    { text: 'Congratulations! You did it!', vi: 'Chúc mừng em đã hoàn thành!', type: 'victory' },
    { text: "You're a Math Star!", vi: 'Em là Ngôi sao Toán học!', type: 'victory' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎙️</span>
            <div>
              <h2 className="text-lg md:text-xl font-black font-heading">
                PHÒNG THỰC HÀNH & KIỂM TRA PHÁT ÂM TIẾNG ANH CHUẨN
              </h2>
              <div className="text-xs text-indigo-100 font-semibold">
                English Pronunciation Studio · en-US Voice Configuration
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.cancelSpeech();
              onClose();
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning if no English Voice is found on device */}
        {!hasEn && (
          <div className="m-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Thông báo giọng đọc tiếng Anh:</strong> Thiết bị hiện tại chưa có gói giọng en-US sẵn trong bộ nhớ trình duyệt. Hệ thống sẽ phát âm qua bộ tổng hợp Web Speech mặc định hoặc nguồn dự phòng. (Trên Windows: Vào <em>Settings &gt; Time &amp; Language &gt; Speech &gt; Add voices &gt; English (United States)</em> để tải giọng nữ tự nhiên chất lượng cao).
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('voices')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'voices' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            🎙️ Chọn giọng &amp; Tốc độ
          </button>
          <button
            onClick={() => setActiveTab('numbers')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'numbers' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            🔢 Số đếm (0 - 100)
          </button>
          <button
            onClick={() => setActiveTab('pairs')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'pairs' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            ⚖️ Phân biệt từ dễ nhầm
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'math' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            ➕ Phép tính tiếng Anh
          </button>
          <button
            onClick={() => setActiveTab('praises')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'praises' ? 'bg-white text-indigo-900 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            🎉 Lời khen &amp; Phản hồi
          </button>
        </div>

        {/* Tab 1: Voice & Speed Settings */}
        {activeTab === 'voices' && (
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Speed & Pitch Controls */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Điều chỉnh tốc độ đọc &amp; Cao độ cho học sinh lớp 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Tốc độ đọc tiếng Anh (Speech Rate):</span>
                    <strong className="text-indigo-700">{speechRate}x</strong>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.1"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.7x (Chậm phân biệt âm)</span>
                    <span className="font-bold text-indigo-600">0.88x (Chuẩn lớp 1)</span>
                    <span>1.1x (Nhanh)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Cao độ giọng đọc (Pitch):</span>
                    <strong className="text-indigo-700">{speechPitch}</strong>
                  </div>
                  <input
                    type="range"
                    min="0.9"
                    max="1.3"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0.9 (Trầm ấm)</span>
                    <span className="font-bold text-indigo-600">1.05 (Vui tươi, trong trẻo)</span>
                    <span>1.3 (Cao)</span>
                  </div>
                </div>
              </div>

              {/* Sample test button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 font-medium">
                  Nghe thử với cấu hình hiện tại:
                </span>
                <button
                  onClick={() => soundService.speak('Hello! Welcome to the Bilingual Math Kingdom! Great job!', 'en')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe thử câu chào</span>
                </button>
              </div>
            </div>

            {/* List of Detected English Voices */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Danh sách giọng tiếng Anh phát hiện trên thiết bị ({enVoices.length} giọng):
                </span>
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {enVoices.filter((v) => v.lang.toLowerCase() === 'en-us').length} giọng en-US
                </span>
              </div>

              {enVoices.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-2xl border border-slate-200">
                  Đang quét danh sách giọng trình duyệt... Nếu không hiện, trình duyệt sẽ dùng giọng tổng hợp hệ thống.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {enVoices.map((v) => {
                    const isSelected = selectedEnURI === v.voiceURI;
                    const isUs = v.lang.toLowerCase() === 'en-us';

                    return (
                      <div
                        key={v.voiceURI}
                        onClick={() => handleSelectEnVoice(v.voiceURI)}
                        className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isUs ? 'US' : 'EN'}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <span>{v.name}</span>
                              {v.isNatural && (
                                <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-black">
                                  Natural
                                </span>
                              )}
                              {v.genderHint === 'female' && (
                                <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.2 rounded font-black">
                                  Nữ (Khuyên dùng)
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Mã ngôn ngữ: {v.lang}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectEnVoice(v.voiceURI);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                            title="Nghe thử giọng này"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Numbers 0 to 100 */}
        {activeTab === 'numbers' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500">
              Chạm vào bất kỳ số nào để nghe phát âm tiếng Anh chuẩn. Nhấn biểu tượng 🐢 để nghe đọc chậm phân biệt âm cuối:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {NUMBER_TESTS.map((item) => (
                <div
                  key={item.word}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-sky-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-black text-slate-900">{item.word}</div>
                    <div className="text-[11px] font-mono text-indigo-600">{item.ipa}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{item.vi}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => soundService.speak(item.word, 'en')}
                      className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer"
                      title="Nghe chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => soundService.speakSlow(item.word, 'en')}
                      className="p-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs shadow-xs cursor-pointer"
                      title="Nghe đọc chậm (0.7x)"
                    >
                      🐢
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Tricky Pairs Distinction */}
        {activeTab === 'pairs' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900">
              💡 <strong>Bí quyết phân biệt:</strong> Nhấn nút nghe để so sánh trực tiếp hai từ cạnh nhau. Học sinh lớp 1 cần chú ý phát âm âm thổi <em>/θ/</em> trong <em>Three</em> và nhấn mạnh trọng âm <em>-teen</em> (kéo dài) so với <em>-ty</em> (ngắn gọn)!
            </div>

            <div className="space-y-3">
              {TRICKY_PAIRS.map((pair, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xs"
                >
                  {/* Word A */}
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-sky-950">{pair.wordA}</div>
                      <div className="text-xs font-mono text-indigo-700 font-bold">{pair.ipaA}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{pair.descA}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => soundService.speak(pair.wordA, 'en')}
                        className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-xs cursor-pointer"
                        title="Nghe chuẩn"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => soundService.speakSlow(pair.wordA, 'en')}
                        className="p-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs cursor-pointer"
                        title="Nghe chậm"
                      >
                        🐢
                      </button>
                    </div>
                  </div>

                  {/* Word B */}
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-rose-950">{pair.wordB}</div>
                      <div className="text-xs font-mono text-indigo-700 font-bold">{pair.ipaB}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{pair.descB}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => soundService.speak(pair.wordB, 'en')}
                        className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer"
                        title="Nghe chuẩn"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => soundService.speakSlow(pair.wordB, 'en')}
                        className="p-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs cursor-pointer"
                        title="Nghe chậm"
                      >
                        🐢
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Math Formulas In English */}
        {activeTab === 'math' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500">
              Kiểm tra cách hệ thống tự động chuyển đổi ký hiệu toán học (+, -, =, &gt;, &lt;) thành câu tiếng Anh chuẩn:
            </p>

            <div className="space-y-3">
              {MATH_FORMULAS.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-indigo-50/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-lg font-black text-slate-900 font-mono tracking-wider">
                      {item.expr}
                    </div>
                    <div className="text-xs font-bold text-indigo-800">
                      🔊 “{item.readEn}”
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      Nghĩa tiếng Việt: {item.readVi}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => soundService.speakMathExpression(item.expr, 'en')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 Đọc tiếng Anh (en-US)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Praises & Game Responses */}
        {activeTab === 'praises' && (
          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <p className="text-xs font-semibold text-slate-500">
              Kiểm tra ngữ điệu vui tươi, tự nhiên của các câu khen thưởng trong trò chơi (không bị ngắt câu hay chồng tiếng):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRAISE_LIST.map((item, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${
                    item.type === 'correct'
                      ? 'bg-emerald-50 border-emerald-200'
                      : item.type === 'wrong'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div>
                    <div className="text-sm font-black text-slate-900">{item.text}</div>
                    <div className="text-[11px] text-slate-500 font-semibold">{item.vi}</div>
                  </div>

                  <button
                    onClick={() => {
                      if (item.type === 'correct') {
                        soundService.praiseCorrect('en');
                      } else if (item.type === 'wrong') {
                        soundService.encourageWrong('en');
                      } else {
                        soundService.praiseVictory('en');
                      }
                    }}
                    className={`p-2 rounded-xl text-white shadow-xs cursor-pointer ${
                      item.type === 'correct'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : item.type === 'wrong'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                    title="Nghe kết hợp hiệu ứng âm thanh"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Test Stress Button */}
            <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between text-xs text-slate-700">
              <span>Kiểm tra chống chồng tiếng khi nhấn liên tục:</span>
              <button
                onClick={() => {
                  soundService.speak('One', 'en');
                  setTimeout(() => soundService.speak('Two', 'en'), 150);
                  setTimeout(() => soundService.speak('Three plus two equals five', 'en'), 300);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold cursor-pointer hover:bg-slate-900"
              >
                Thử nghiệm nhấn liên tục
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Giọng chuẩn: <strong>en-US (Female / Natural)</strong></span>
          <button
            onClick={() => {
              soundService.cancelSpeech();
              onClose();
            }}
            className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xs cursor-pointer"
          >
            Đóng &amp; Áp dụng
          </button>
        </div>
      </div>
    </div>
  );
};
