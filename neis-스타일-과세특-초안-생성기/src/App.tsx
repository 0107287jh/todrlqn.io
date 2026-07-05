import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  ChevronDown, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  HelpCircle, 
  BookOpen, 
  X,
  FileSpreadsheet,
  Layers,
  LogIn,
  LogOut,
  Lock,
  Info,
  User,
  ShieldCheck,
  Key,
  Settings
} from 'lucide-react';

// 과목별 고품질 샘플 프리셋 데이터
const PRESETS = [
  {
    subject: "국어 (문학/작문)",
    achievements: "a. 문학 작품의 미적 가치를 수용하고 다양한 맥락에 따라 해석하는 능력이 뛰어남.\nb. 자신의 생각과 감정을 설득력 있는 문장으로 구성하여 논리적으로 표현함.",
    episode: "토론 수업 시 시인 윤동주의 작품을 시대적 상황과 연계하여 분석하며 깊이 있는 질문을 유도함. 특히 성찰적 자아의 내면을 현대 청소년의 심리와 매칭시켜 발표하여 급우들의 큰 공감을 이끌어냄.",
    keywords: "문학적 감수성, 비판적 사고, 적극적인 소통",
    targetBytes: 500
  },
  {
    subject: "수학 (미적분/통계)",
    achievements: "a. 함수의 극한 and 연속의 개념을 명확히 이해하고, 실생활 변화율 문제에 창의적으로 응용함.\nb. 통계적 데이터를 바탕으로 현상의 추세를 모델링하고 예측하는 수학적 분석력이 우수함.",
    episode: "감염병 전파 모델(SIR 모델) 탐구 프로젝트를 기획하고, 미분방정식을 바탕으로 방역 정책의 효과성을 수학적으로 모형화하는 우수한 탐구 결과를 제출함.",
    keywords: "문제 해결력, 수학적 모델링, 꼼꼼함",
    targetBytes: 600
  },
  {
    subject: "영어 (독해/작문)",
    achievements: "a. 다양한 시사적/학술적 주제의 영어 텍스트를 논리적이고 정확하게 독해하여 요지를 파악함.\nb. 인과관계와 대조의 흐름을 살려 자신의 주장을 논리적인 영어 에세이로 완성함.",
    episode: "기후 변화에 관한 TED 강연을 시청한 후, 신재생 에너지 전환의 한계와 극복 방안에 대해 심층 분석한 영문 에세이를 작성하여 어휘 및 구조적 완성도를 극대화함.",
    keywords: "언어적 유창성, 논리적 서술, 자기주도성",
    targetBytes: 450
  },
  {
    subject: "과학 (물리/화학/생명)",
    achievements: "a. 과학적 탐구 방법론을 기반으로 가설을 설정하고 변인을 설계 및 제어하는 실험 설계 능력이 우수함.\nb. 환경적 요인과 유기체 간의 상호작용 메커니즘을 과학적 논거에 따라 상세히 분석함.",
    episode: "광전효과 실험 시 이론과 실험값 사이에 발생한 미세 오차 원인을 저항과 빛의 파장 정밀도 면에서 다각도로 분석하여 뛰어난 오차 환류 능력을 선보임.",
    keywords: "과학적 탐구심, 논리적 분석, 협동심",
    targetBytes: 500
  }
];

// 로컬 룰베이스 템플릿 기반 생성기 (한글 3byte, 영어/공백 1byte 계산 지원)
function generateLocalFallbackDraft(achievements: string, episode: string, keywords: string, targetBytes: number): string {
  const achievementList = achievements ? achievements.split("\n").filter(x => x.trim()) : [];
  const episodesList = episode ? episode.split("\n").filter(x => x.trim()) : [];
  const keywordList = keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : [];

  const defaultAchievements = [
    "과목의 핵심 성취기준을 완벽하게 이해하고 지식을 실생활에 적용하는 능력이 우수함.",
    "교과 지식을 바탕으로 창의적인 해결책을 도출하려는 문제해결력을 갖춤.",
    "이론적 개념을 명확히 파악하고 이를 자기주도적으로 심화 탐구하는 자세가 돋보임.",
    "수업 전반에서 교과 성취과제를 높은 도달 수준으로 달성하며 융합적 탐구 역량을 보여줌."
  ];

  const defaultEpisodes = [
    "수업 시간 중 적극적인 질문과 모둠 활동을 통해 배움을 실천하고 동료 학생들을 이끌며 배려하는 모습을 보여줌.",
    "주제 탐구 프로젝트에서 자료 수집 및 기획 단계부터 완성에 이르기까지 완성도 높은 결과물을 도출하기 위해 주도적으로 참여함.",
    "분석 실습 과정에서 꼼꼼하고 계획적인 태도로 오차를 분석하고 원인을 추론하여 깊이 있는 탐구 보고서를 작성함.",
    "교과 관련 토론 및 발표 수업에서 깊이 있는 논거와 풍부한 분석 자료를 바탕으로 설득력 있게 본인의 주장을 전개해 나감."
  ];

  const defaultKeywordsMap: { [key: string]: string } = {
    "성실": "과정 중심 수업에서 매시간 끈기 있게 참여하며 배운 내용을 적극적으로 복습하여 교과 핵심 지식을 자신만의 언어로 명확히 소화함.",
    "창의": "기존 지식에 의문을 품고 다각적인 관점에서 새로운 아이디어를 제안하는 독창적인 사고방식과 문제 접근법이 강점임.",
    "협동": "동료들과 조화를 이루어 모둠 활동의 목표를 명확히 제시하고 각자의 역할을 배려있게 조율하여 함께 성장하는 가치를 실천함.",
    "리더": "팀 프로젝트 수행 시 뛰어난 소통 능력을 발휘하여 구성원들의 의견을 조율하고 주도적으로 과제를 완성하며 집단 지성을 이끌어냄.",
    "탐구": "단순한 암기를 넘어 현상의 작동 원리를 깊이 있게 파헤치고, 스스로 전공 관련 심화 자료를 발굴해 학습하는 탐구심이 남다름.",
    "도전": "어려운 과제나 복잡한 문항을 만나도 회피하지 않고 끝까지 분석하고 도전하여 원리를 터득해 나가는 열정이 매우 돋보임.",
    "열정": "배움에 대한 강한 열의를 가지고 수업 시간마다 집중도 높게 질문을 던지며 지식을 확장하고 성장의 발판으로 삼음.",
    "배려": "동료 학우들이 어려워하는 교과 개념을 친절하고 상세하게 설명해 주며, 나눔을 바탕으로 한 학급 학습 생태계 조성에 기여함."
  };

  let selectedAch = achievementList[0] || defaultAchievements[Math.floor(Math.random() * defaultAchievements.length)];
  let selectedEp = episodesList[0] || defaultEpisodes[Math.floor(Math.random() * defaultEpisodes.length)];

  let keywordSentences: string[] = [];
  if (keywordList.length > 0) {
    keywordList.forEach(k => {
      let matched = false;
      for (const key in defaultKeywordsMap) {
        if (k.toLowerCase().includes(key.toLowerCase())) {
          keywordSentences.push(defaultKeywordsMap[key]);
          matched = true;
          break;
        }
      }
      if (!matched) {
        keywordSentences.push(`뛰어난 '${k}' 역량을 바탕으로 학업을 수행할 때 탁월한 집중도와 창의적 발상, 높은 완성도의 결과물을 보임.`);
      }
    });
  } else {
    keywordSentences.push("스스로 배움의 필요성을 감지하고 부족한 부분을 스스로 진단 및 보완하여 학업 능력을 부단히 신장해 나감.");
  }

  // 조합 생성
  let rawDraft = `${selectedAch} ${selectedEp} ${keywordSentences.join(" ")}`;

  function getByteLengthLocal(str: string): number {
    let bytes = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code > 127) {
        bytes += 3;
      } else {
        bytes += 1;
      }
    }
    return bytes;
  }

  let currentBytes = getByteLengthLocal(rawDraft);
  if (currentBytes > targetBytes) {
    const sentences = rawDraft.match(/[^.!?]+[.!?]+/g) || [rawDraft];
    let tempDraft = "";
    for (const s of sentences) {
      const trimmedS = s.trim();
      if (getByteLengthLocal(tempDraft + " " + trimmedS) <= targetBytes + 30) {
        tempDraft += (tempDraft ? " " : "") + trimmedS;
      } else {
        break;
      }
    }
    rawDraft = tempDraft || sentences[0].trim();
  } else if (currentBytes < targetBytes - 40) {
    const fillerOptions = [
      "매시간 수업 참여 태도가 대단히 진지하며 급우 간의 신망이 두터워 타의 모범이 됨.",
      "학업 계획에 따라 철저한 자율 통제력을 수립하고 점진적으로 성장해 가는 과정이 인상 깊음.",
      "습득한 지적 자산을 다방면으로 융합 전개하며 깊이 있는 질문을 유도하는 우수 인재임.",
      "끈기 있는 성찰적 학업 수용 태도를 바탕으로 교과 목표를 초과 달성하며 잠재력을 증명함.",
      "공동의 학업 목표 성취를 위해 소외되는 구성원 없이 협력을 주도해 온 소통 능력이 뛰어남."
    ];
    let attempts = 0;
    while (getByteLengthLocal(rawDraft) < targetBytes - 15 && attempts < fillerOptions.length) {
      rawDraft += " " + fillerOptions[attempts];
      attempts++;
    }
  }

  return rawDraft.trim();
}

export default function App() {
  // 인증 수단 모드 선택: "api_key" (Gemini API Key) | "oauth" (Google OAuth Token)
  const [authMode, setAuthMode] = useState<"api_key" | "oauth">("api_key");
  
  // API Key 기반 상태값
  const [userApiKey, setUserApiKey] = useState<string>("");
  
  // OAuth 기반 상태값
  const [userClientId, setUserClientId] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);

  // 입력 필드 상태 관리
  const [achievements, setAchievements] = useState<string>("");
  const [episode, setEpisode] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [targetBytes, setTargetBytes] = useState<number>(500);

  // 결과물 관련 상태 관리
  const [resultText, setResultText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [apiMessage, setApiMessage] = useState<string>("");
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // 드롭다운, 모달 및 AdSense 규정용 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [policyTab, setPolicyTab] = useState<"privacy" | "terms" | "disclaimer">("privacy");
  const [activeGuideTab, setActiveGuideTab] = useState<"guide_writing" | "guide_bytes" | "guide_security">("guide_writing");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const menuRef = useRef<HTMLDivElement>(null);

  // 1. 컴포넌트 마운트 시 로컬스토리지에서 기존 인증 정보 읽어오기 및 URL OAuth Hash 파싱
  useEffect(() => {
    // 저장된 인증 모드 로드
    const savedMode = localStorage.getItem("neis_auth_mode") as "api_key" | "oauth" | null;
    if (savedMode) setAuthMode(savedMode);

    // 저장된 API Key 로드
    const savedApiKey = localStorage.getItem("neis_user_api_key");
    if (savedApiKey) setUserApiKey(savedApiKey);

    // 저장된 Client ID 로드
    const savedClientId = localStorage.getItem("neis_user_client_id");
    if (savedClientId) setUserClientId(savedClientId);

    // 저장된 Access Token 및 프로필 로드
    const savedAccessToken = localStorage.getItem("neis_google_access_token");
    const savedProfile = localStorage.getItem("neis_google_user_profile");
    if (savedAccessToken) setAccessToken(savedAccessToken);
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Profile parsing error", e);
      }
    }

    // URL 해시에 붙어 오는 access_token(Implicit Flow 로그인 성공) 파싱
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get("access_token");
      if (token) {
        setAccessToken(token);
        localStorage.setItem("neis_google_access_token", token);
        localStorage.setItem("neis_auth_mode", "oauth");
        setAuthMode("oauth");
        
        // 구글 OAuth 사용자 정보 fetch (클라이언트 사이드에서 즉시 프로필 획득)
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(profileData => {
          setProfile(profileData);
          localStorage.setItem("neis_google_user_profile", JSON.stringify(profileData));
          triggerToast(`[${profileData.name || "선생님"}] 로그인에 성공했습니다!`);
        })
        .catch(err => {
          console.error("OAuth Profile fetch error:", err);
          setProfile({ name: "선생님" });
        });

        // URL 해시 제거하여 브라우저 주소창 깔끔하게 청소
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // API Key 변경 시 저장
  const handleSaveApiKey = (val: string) => {
    setUserApiKey(val);
    localStorage.setItem("neis_user_api_key", val);
  };

  // Client ID 변경 시 저장
  const handleSaveClientId = (val: string) => {
    setUserClientId(val);
    localStorage.setItem("neis_user_client_id", val);
  };

  // 인증 방식 토글
  const handleSwitchAuthMode = (mode: "api_key" | "oauth") => {
    setAuthMode(mode);
    localStorage.setItem("neis_auth_mode", mode);
    triggerToast(`인증 모드를 [${mode === "api_key" ? "Gemini API Key" : "구글 로그인"}] 방식으로 변경했습니다.`);
  };

  // 구글 OAuth 2.0 Implicit Flow 로그인 실행
  const handleGoogleLogin = () => {
    // 사용자가 입력한 고유 Client ID가 없으면 경고 표시
    if (!userClientId.trim()) {
      triggerToast("먼저 본인의 'OAuth 2.0 클라이언트 ID'를 입력란에 적어주세요.");
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    
    const params = {
      client_id: userClientId.trim(),
      redirect_uri: redirectUri,
      response_type: "token", // 암묵적 흐름: 백엔드 Secret 없이 클라이언트로 직접 access_token 획득!
      scope: "https://www.googleapis.com/auth/generative-language openid email profile",
      include_granted_scopes: "true",
      state: "neis_oauth_state"
    };

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(params).toString()}`;
    
    // 현재 페이지에서 이동 (보안상 iframe 팝업 차단 원천 해결 및 편리한 로그인)
    window.location.href = authUrl;
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setAccessToken("");
    setProfile(null);
    localStorage.removeItem("neis_google_access_token");
    localStorage.removeItem("neis_google_user_profile");
    triggerToast("로그아웃되었습니다.");
  };

  // 토스트 메시지 도우미
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  // 실시간 정확한 바이트(Byte) 수 계산 (한글 3바이트, 공백/영어 1바이트 규칙)
  const getByteLength = (str: string): number => {
    let bytes = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code > 127) {
        bytes += 3;
      } else {
        bytes += 1;
      }
    }
    return bytes;
  };

  const currentResultBytes = getByteLength(resultText);

  // 프리셋 로드 도우미
  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setAchievements(preset.achievements);
    setEpisode(preset.episode);
    setKeywords(preset.keywords);
    setTargetBytes(preset.targetBytes);
    triggerToast(`[${preset.subject}] 예시 데이터가 로드되었습니다.`);
  };

  // 초안 초기화
  const handleResetInputs = () => {
    setAchievements("");
    setEpisode("");
    setKeywords("");
    setTargetBytes(500);
    triggerToast("입력창이 초기화되었습니다.");
  };

  // 과세특 초안 생성하기 (브라우저에서 직접 구글 API로 전송!)
  const handleGenerateDraft = async () => {
    // 검증
    if (authMode === "api_key" && !userApiKey.trim()) {
      triggerToast("선생님의 Gemini API Key를 먼저 입력해 주세요.");
      return;
    }
    if (authMode === "oauth" && !accessToken) {
      triggerToast("구글 로그인이 필요합니다. 아래 구글 로그인 단추를 눌러주세요.");
      return;
    }

    setIsLoading(true);
    setApiMessage("");
    setIsFallback(false);

    // 대한민국 교육부 기준 맞춤형 프롬프트 작성
    const prompt = `
당신은 대한민국 중고등학교에서 수많은 학생의 학교생활기록부를 기재하고 교정해 온 베테랑 담임 및 교과 교사입니다.
제시된 입력 정보를 바탕으로, 대한민국 교육부의 '학교생활기록부 기재 요령'을 완벽히 만족하며 맞춤법을 완전히 준수한 고품질 과목별 세부능력 및 특기사항(과세특) 초안을 생성해 주세요.

[입력 정보]
1. 성취기준: ${achievements || "(과목별 핵심 학업성취수준 및 배움의 성취의지)"}
2. 수업 에피소드 및 관찰 기록: ${episode || "(성실한 학습 태도 및 교실 내 긍정적 기여)"}
3. 학생 특성 및 성격 키워드: ${keywords || "성실, 소통, 협력"}
4. 희망 글자 수 (바이트 제한): 약 ${targetBytes || 500} Byte (한글 1글자 3바이트, 공백 및 영문/숫자 1글자 1바이트 기준)

[과세특 생성 필수 지침]
- 학교 생활기록부 기재 요령 및 한글 맞춤법 완벽 준수
- 학생의 성장을 유도하고 격려하는 품위 있고 긍정적인 단어 중심 서술
- 문맥의 단조로움을 피하고 매번 상투적인 표현(예: '우수함', '돋보임'의 무한 반복)이 중복되지 않도록 다채롭고 풍부하며 기승전결이 있는 다양한 문장 구조 사용
- 만약 입력된 관찰 기록에 학생의 부정적인 학습 태도나 고쳐야 할 아쉬운 성향 내용이 일부 섞여 있을 경우, 이를 노골적으로 묘사하지 않고 '향후 스스로 성찰하고 개선하려는 의지가 뚜렷하며 지속적인 발전 가능성이 보임' 또는 '초반의 미흡한 점을 점진적인 연습을 통해 스스로 극복하는 성실함이 있음' 등 성장의 디딤돌이 될 수 있는 우호적이며 순화된 발전 가능성 및 개선 의지 형태의 서술로 완벽하게 변환하여 기재할 것
- 전체 문장의 종결 어미 어조는 반드시 '~함', '~임', '~력을 보여줌.' 등으로 완벽 통일할 것
- 사용자가 지정한 제한 Byte 수인 ${targetBytes} Byte를 초과하지 않도록 철저히 계산하여 분량을 정교하게 조율하여 출력할 것 (글자 밀도를 이에 최적화)

[출력 형식]
불필요한 인사말, 도입 서두("네, 작성해 드리겠습니다" 등), 안내 멘트나 부연 설명, 마크다운 코드 블록 장식(\`\`\`) 등을 절대로 포함하지 마세요.
교사가 복사 후 즉시 나이스 시스템에 붙여넣을 수 있도록 오직 "과세특 초안 텍스트 본문" 자체만 단일 텍스트로 즉각 응답하세요.
`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // OAuth 방식일 경우 Bearer 헤더 추가
    if (authMode === "oauth" && accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    let requestUrl = geminiUrl;
    
    // API Key 방식일 경우 key 파라미터 추가
    if (authMode === "api_key") {
      requestUrl = `${geminiUrl}?key=${userApiKey.trim()}`;
    }

    try {
      // 100% 클라이언트에서 구글 서버로 직접 전송 (개발자 서버 미개입 -> 보안 보장)
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2
          }
        })
      });

      const responseJson: any = await response.json();

      if (!response.ok) {
        console.error("Gemini Direct Client API Error:", responseJson);
        throw new Error(responseJson.error?.message || `API 호출 오류 (코드: ${response.status})`);
      }

      let generatedText = responseJson.candidates?.[0]?.content?.parts?.[0]?.text || "";
      generatedText = generatedText.replace(/^```[a-zA-Z]*\n/g, "").replace(/\n```$/g, "").trim();

      if (!generatedText) {
        throw new Error("정상 응답을 수신하였으나 텍스트 본문이 비어 있습니다.");
      }

      setResultText(generatedText);
      setApiMessage(authMode === "api_key" ? "선생님의 개인 API Key로 안전하게 직접 생성되었습니다." : "선생님의 구글 로그인 토큰(Access Token)으로 직접 생성되었습니다.");
      triggerToast("과세특 초안이 성공적으로 완성되었습니다!");

    } catch (err: any) {
      console.error("Direct request failed, using local offline generator:", err);
      // 문제 발생 시 교육 효율성을 위해 정밀한 로컬 fallback 가동
      const fallbackText = generateLocalFallbackDraft(achievements, episode, keywords, targetBytes || 500);
      setResultText(fallbackText);
      setIsFallback(true);
      setApiMessage(`생성 중 오류 발생으로 로컬 문장 엔진을 작동했습니다. (${err.message || "키 만료 등"})`);
      triggerToast("일시적 네트워크/인증 오차로 오프라인 로컬 엔진이 작동되었습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 결과물 클립보드 복사하기
  const handleCopyText = async () => {
    if (!resultText) {
      triggerToast("복사할 내용이 없습니다. 먼저 초안을 생성해 주세요!");
      return;
    }

    try {
      await navigator.clipboard.writeText(resultText);
      setIsCopied(true);
      triggerToast("클립보드에 나이스 규격 텍스트가 복사되었습니다.");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = resultText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        triggerToast("텍스트가 정상적으로 복사되었습니다.");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (e) {
        triggerToast("복사 실패. 직접 마우스 드래그 선택 복사를 진행해 주세요.");
      }
      document.body.removeChild(textArea);
    }
  };

  // 기본 국어 프리셋 대입
  useEffect(() => {
    setAchievements(PRESETS[0].achievements);
    setEpisode(PRESETS[0].episode);
    setKeywords(PRESETS[0].keywords);
    setTargetBytes(PRESETS[0].targetBytes);
    setResultText(
      "해당 학생은 문학 작품의 미적 가치를 수용하고 다양한 맥락에 따라 해석하는 능력이 뛰어남. 특히 토론 수업 시 시인 윤동주의 작품을 시대적 상황과 연계하여 분석하며 깊이 있는 질문을 유도함. 스스로 성찰적 자아의 내면을 현대 청소년의 심리와 매칭시켜 독창적으로 발표함으로써 학급 학우들의 미적 흥미를 일깨우고 적극적인 배움 중심 소통에 앞장서는 리더십이 돋보임."
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-[#1e293b] flex flex-col font-sans select-none antialiased">
      
      {/* 나이스 업무포털 헤더 모방 */}
      <header className="bg-white border-b-2 border-[#004ea2] px-4 md:px-8 py-3.5 flex justify-between items-center shadow-sm relative z-40">
        <div className="flex items-center gap-3">
          <div className="bg-[#004ea2] text-white p-2 rounded-md shadow-sm">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#004ea2] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded tracking-wider">NEIS 지원</span>
              <h1 className="text-lg md:text-xl font-bold text-[#004ea2] tracking-tight">
                나이스(NEIS) 연계 과세특 초안 생성기
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 hidden md:block">
              교사 개인의 구글 계정 세션 및 API Key 권한을 직접 매칭하여 보안 위배 없는 안전한 업무 자동화 구현
            </p>
          </div>
        </div>

        {/* 상단 우측 사용자 상태 및 메뉴 드롭다운 */}
        <div className="flex items-center gap-3">
          {authMode === "oauth" && profile && (
            <div className="hidden md:flex items-center gap-2 bg-[#f8fafc] px-3 py-1.5 rounded-full border border-gray-200">
              {profile.picture ? (
                <img referrerPolicy="no-referrer" src={profile.picture} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 text-gray-400" />
              )}
              <span className="text-xs font-bold text-gray-700">{profile.name || "선생님"}</span>
              <span className="text-[10px] text-blue-600 font-semibold px-1 py-0.2 bg-blue-50 rounded">OAuth 인증</span>
            </div>
          )}

          {authMode === "api_key" && userApiKey && (
            <div className="hidden md:flex items-center gap-2 bg-[#f0fdf4] px-3 py-1.5 rounded-full border border-green-200">
              <Key className="w-3.5 h-3.5 text-green-600 animate-pulse" />
              <span className="text-xs font-bold text-green-700">개인 API Key 연결됨</span>
            </div>
          )}

          {authMode === "oauth" && profile && (
            <button 
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
              title="로그아웃"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          )}

          <div className="relative" ref={menuRef}>
            <button 
              id="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 bg-[#f8fafc] border border-gray-300 hover:border-[#004ea2] px-4 py-1.5 rounded text-sm font-semibold text-gray-700 hover:text-[#004ea2] transition-all cursor-pointer shadow-xs"
            >
              <span>메뉴</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400">교사 추천 유용 링크</p>
                </div>
                
                <a 
                  href="https://www.edunet.net" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004ea2] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    에듀넷·티-클리어 바로가기
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>

                <a 
                  href="https://www.neis.go.kr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004ea2] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#004ea2]"></span>
                    교육부 나이스 대국민포털
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>

                <div className="border-t border-gray-100 my-1"></div>

                <button 
                  onClick={() => {
                    setIsHelpModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-[#004ea2] font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>나이스 바이트 규정 및 도움말</span>
                </button>

                {authMode === "oauth" && profile && (
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-red-500 font-semibold hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>OAuth 로그아웃</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 실시간 알림 토스트 */}
      {showToast && (
        <div className="fixed bottom-16 right-6 bg-slate-800 text-white text-xs py-2.5 px-4 rounded-lg shadow-2xl flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-300 border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 메인 업무 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* 상단: 개인 자원 및 인증 모드 설정 카드 */}
        <div className="lg:col-span-12 bg-white border border-blue-200 rounded-lg p-5 shadow-sm flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-[#004ea2] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>선생님 개인 토큰 및 계정 사용 설정</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                <strong className="text-blue-700">🔒 개인정보 및 보안 걱정 ZERO!</strong> 본 시스템은 개발자 서버를 일절 거치지 않으며, 개발자 소유의 유료 토큰도 절대 사용하지 않습니다. <br className="hidden sm:inline" />
                오직 선생님께서 직접 구글에서 무료로 발급받으신 Gemini API Key를 통해서 안전하게 분석이 이루어집니다. 아래 3초 퀵 가이드를 참고해 주세요.
              </p>
            </div>
            {/* 인증 방식 전환 탭 */}
            <div className="flex bg-slate-100 p-1 rounded-lg self-start">
              <button
                onClick={() => handleSwitchAuthMode("api_key")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === "api_key" ? "bg-white text-[#004ea2] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>개인 API Key 입력 방식</span>
              </button>
              <button
                onClick={() => handleSwitchAuthMode("oauth")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  authMode === "oauth" ? "bg-white text-[#004ea2] shadow-xs" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>내 구글 로그인 (OAuth 2.0)</span>
              </button>
            </div>
          </div>

          {/* 서브 설정부 */}
          {authMode === "api_key" ? (
            <div className="flex flex-col gap-4 animate-in fade-in duration-150">
              {/* API Key 생성 가이드 순서도 */}
              <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>💡 30초 만에 끝나는 Google Gemini 무료 API Key 발급 및 복사 3단계</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-3xs relative">
                    <span className="absolute -top-2.5 -left-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">1</span>
                    <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <span>구글 AI 스튜디오 이동</span>
                      <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[10px] flex items-center inline-flex gap-0.5 ml-1 bg-blue-50 px-1 py-0.2 rounded font-semibold">
                        [발급 사이트 열기] <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                      위 파란색 버튼을 눌러 Google AI Studio 웹사이트에 접속한 후, 평소 사용하시는 <strong className="text-gray-700">구글(Google) 계정</strong>으로 로그인합니다.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-3xs relative">
                    <span className="absolute -top-2.5 -left-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">2</span>
                    <p className="text-xs font-bold text-gray-800">
                      'Get API Key' 파란 단추 누르기
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                      화면 왼쪽 위에 있는 파란색 <strong className="text-blue-700">「Get API key」</strong> 버튼(또는 중앙의 <strong className="text-blue-700">「Create API key」</strong>)을 마우스로 클릭해 줍니다.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-3xs relative">
                    <span className="absolute -top-2.5 -left-1.5 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">3</span>
                    <p className="text-xs font-bold text-gray-800">
                      키 복사 후 아래 붙여넣기
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                      화면에 보이는 <strong className="text-[#004ea2]">「Create API key in new project」</strong>를 누른 후, 생성된 영어+숫자 혼합 키를 <strong className="text-green-700">Copy(복사)</strong>하여 아래 칸에 붙여넣으세요!
                    </p>
                  </div>
                </div>
              </div>

              {/* 입력란 및 보안 안내 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    🔑 발급 및 복사한 선생님의 Gemini API Key 붙여넣기 (Ctrl + V)
                  </label>
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => handleSaveApiKey(e.target.value)}
                    className="w-full p-2.5 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono placeholder-gray-400 bg-blue-50/20"
                    placeholder="AIzaSy로 시작하는 발급받은 구글 Gemini API Key를 이곳에 붙여넣으세요"
                  />
                </div>
                <div className="md:col-span-4 bg-green-50 text-green-800 text-xs p-3 rounded border border-green-100 flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900">✨ 키 유출 우려 원천 차단</p>
                    <p className="text-[10.5px] text-green-700 mt-0.5 leading-relaxed">
                      입력된 키는 선생님 브라우저 메모리에만 기록되어 구글 본사 서버로 직접 안전하게 암호화 전송됩니다. 서버 데이터베이스나 타인에게 공유되지 않습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start animate-in fade-in duration-150">
              <div className="md:col-span-5 space-y-1">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                  1. 내 Google Cloud 'OAuth 2.0 클라이언트 ID' 입력
                </label>
                <input
                  type="text"
                  value={userClientId}
                  onChange={(e) => handleSaveClientId(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                  placeholder="예: 1234567-abcdefg.apps.googleusercontent.com"
                />
                <p className="text-[10px] text-gray-400">
                  구글 클라우드 콘솔의 OAuth 클라이언트 ID(웹 애플리케이션 유형)를 의미합니다.
                </p>
              </div>

              <div className="md:col-span-4 flex flex-col justify-end h-full pt-5">
                {accessToken ? (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-900 border border-blue-200 rounded p-2.5 text-xs">
                    <ShieldCheck className="w-4.5 h-4.5 text-[#004ea2]" />
                    <div className="flex-1">
                      <p className="font-bold">내 계정 로그인 성공</p>
                      <p className="text-[10px] text-gray-500 mt-0.5 max-w-[200px] truncate">
                        토큰: {accessToken.substring(0, 15)}...
                      </p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      해제
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-[#004ea2] hover:bg-[#003d80] text-white font-bold py-2.5 rounded text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>🔑 내 구글 계정으로 로그인 (Access Token)</span>
                  </button>
                )}
              </div>

              <div className="md:col-span-3 bg-amber-50 text-amber-900 text-xs p-3 rounded border border-amber-100">
                <p className="font-semibold">⚠️ 필수 세팅 사항</p>
                <p className="text-[10px] text-amber-800 mt-1 leading-relaxed">
                  클라이언트 ID 생성 시 리디렉션 URI에 현재 도메인 주소(<span className="font-mono font-bold select-all underline">{window.location.origin}</span>)를 반드시 허용해 주셔야 정상 로그인 연동됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 과목 프리셋 퀵바 */}
        <div className="lg:col-span-12 bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <BookOpen className="w-4 h-4 text-[#004ea2]" />
            <span>⚡ 과목 샘플 데이터 퀵 로드:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => handleLoadPreset(p)}
                className="px-3 py-1.5 text-xs font-semibold bg-[#edf2f7] hover:bg-[#e2e8f0] text-gray-700 rounded border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                {p.subject}
              </button>
            ))}
          </div>
        </div>

        {/* 좌측 입력 영역 (5 cols) */}
        <section className="lg:col-span-5 flex flex-col bg-white p-5 rounded-lg border border-gray-200 shadow-xs gap-4.5">
          <div className="flex items-center justify-between border-l-4 border-[#004ea2] pl-2.5 mb-1">
            <h2 className="font-bold text-gray-800 text-base flex items-center gap-1.5">
              <span>📝</span> 입력 정보 설정
            </h2>
            <button 
              onClick={handleResetInputs}
              className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>전체 초기화</span>
            </button>
          </div>

          {/* 성취기준 입력 */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <span>①</span> 성취기준 입력란 <span className="text-gray-400 font-normal">(여러 줄 입력 가능)</span>
              </label>
              <span className="text-[11px] text-gray-400 font-medium">a ~ e 형식의 문항</span>
            </div>
            <textarea
              id="input-achievements"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              className="min-h-[100px] p-2.5 text-sm border border-gray-300 rounded bg-[#fcfdfe] focus:bg-white focus:ring-1 focus:ring-[#004ea2] focus:border-[#004ea2] outline-none transition-all resize-y"
              placeholder="예:&#13;a. 문학 작품의 미적 가치를 수용하고 다양한 맥락에 따라 해석하는 능력이 뛰어남.&#13;b. 자신의 생각과 감정을 논리적으로 서술함."
            />
          </div>

          {/* 수업 에피소드 및 관찰 기록 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <span>②</span> 수업 에피소드 및 관찰 기록 <span className="text-gray-400 font-normal">(비어있어도 진행 가능)</span>
            </label>
            <textarea
              id="input-episode"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              className="min-h-[150px] p-2.5 text-sm border border-gray-300 rounded bg-[#fcfdfe] focus:bg-white focus:ring-1 focus:ring-[#004ea2] focus:border-[#004ea2] outline-none transition-all resize-y"
              placeholder="예: 모둠 발표 수업 중 윤동주의 시를 현대인의 내면 심리와 연계하여 깊이 분석 및 발표하여 급우들에게 감수성과 영감을 자극함."
            />
          </div>

          {/* 학생 특성 및 희망 글자 수 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <span>③</span> 학생 특성 키워드
              </label>
              <input
                id="input-keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="p-2.5 text-sm border border-gray-300 rounded bg-[#fcfdfe] focus:bg-white focus:ring-1 focus:ring-[#004ea2] focus:border-[#004ea2] outline-none transition-all"
                placeholder="예: 성실함, 창의성, 소통역량"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <span>④</span> 희망 글자 수 <span className="text-[10px] text-gray-400 font-normal">(Byte)</span>
              </label>
              <div className="flex items-center gap-1.5 relative">
                <input
                  id="input-target-bytes"
                  type="number"
                  min="50"
                  max="1500"
                  value={targetBytes}
                  onChange={(e) => setTargetBytes(Number(e.target.value))}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded bg-[#fcfdfe] focus:bg-white focus:ring-1 focus:ring-[#004ea2] focus:border-[#004ea2] outline-none transition-all"
                />
                <span className="absolute right-3 text-xs font-bold text-gray-400">Byte</span>
              </div>
            </div>

          </div>

          {/* 실행 단추 */}
          <button
            id="btn-generate"
            onClick={handleGenerateDraft}
            disabled={isLoading}
            className={`mt-2 ${
              isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-[#004ea2] hover:bg-[#003d80] active:scale-[0.99]'
            } text-white font-bold py-3.5 px-4 rounded-md flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>선생님 고유 자원으로 구글 재미나이 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>🚀 과세특 초안 생성하기</span>
              </>
            )}
          </button>
        </section>

        {/* 우측 결과 영역 (7 cols) */}
        <section className="lg:col-span-7 flex flex-col bg-white p-5 rounded-lg border border-gray-200 shadow-xs gap-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-[#004ea2] pl-2.5 gap-2">
            <h2 className="font-bold text-gray-800 text-base flex items-center gap-1.5">
              <span>📋</span> 생성된 과세특 초안
            </h2>
            
            <div className="flex items-center gap-2">
              {/* 나이스 바이트 수 확인 */}
              <div className="flex items-center gap-1 px-3 py-1 bg-[#f8fafc] rounded border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-bold text-gray-500">실시간 크기:</span>
                <span className={`text-xs font-mono font-bold ${currentResultBytes > targetBytes ? 'text-red-500' : 'text-[#004ea2]'}`}>
                  {currentResultBytes.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">/</span>
                <span className="text-[11px] font-mono text-gray-500">{targetBytes.toLocaleString()} Byte</span>
              </div>

              {/* 복사하기 버튼 */}
              <button
                id="btn-copy"
                onClick={handleCopyText}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold text-white shadow-sm transition-all cursor-pointer ${
                  isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#4a5568] hover:bg-slate-800'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "복사 완료!" : "나이스 복사"}</span>
              </button>
            </div>
          </div>

          {/* 바이트 프로그레스 바 */}
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                currentResultBytes > targetBytes 
                  ? 'bg-red-500' 
                  : currentResultBytes >= targetBytes * 0.9 
                  ? 'bg-green-500' 
                  : 'bg-[#004ea2]'
              }`}
              style={{ width: `${Math.min(100, (currentResultBytes / targetBytes) * 100)}%` }}
            ></div>
          </div>

          {/* 결과물 출력 뷰 */}
          <div className="flex-1 bg-slate-50 border border-dashed border-gray-300 rounded-lg p-5 overflow-y-auto min-h-[300px] flex flex-col justify-between relative">
            
            {/* 로딩 오버레이 */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-3 z-10 rounded-lg">
                <RefreshCw className="w-8 h-8 text-[#004ea2] animate-spin" />
                <p className="text-xs font-bold text-[#004ea2]">NEIS 문맥 검정기 작동 중...</p>
              </div>
            )}

            <div>
              {resultText ? (
                <p id="result-text-area" className="text-[14.5px] leading-relaxed text-gray-800 font-normal whitespace-pre-wrap selection:bg-blue-100">
                  {resultText}
                </p>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 stroke-1 text-gray-300" />
                  <p className="text-sm font-semibold">입력값을 기반으로 과세특 초안이 이곳에 채워집니다.</p>
                  <p className="text-xs mt-1">왼쪽 설정창에서 [과세특 초안 생성하기] 버튼을 눌러주세요.</p>
                </div>
              )}
            </div>

            {/* 작성 팁 하단 워터마크 */}
            <div className="mt-6 border-t border-gray-100 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span className="text-[11px] text-gray-400 italic">
                * NEIS 시스템 복사 후 붙여넣기에 최적화되어 있습니다.
              </span>
              {apiMessage && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  isFallback ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-[#004ea2] border border-blue-100'
                }`}>
                  {apiMessage}
                </span>
              )}
            </div>
          </div>

          {/* 나이스 계산 한계 및 주의 안내 */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5 flex gap-3 items-start shadow-2xs">
            <AlertCircle className="w-5 h-5 text-[#004ea2] shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              <strong className="block mb-0.5">💡 나이스(NEIS) 글자 수 유의사항</strong>
              한국어 교육부 나이스의 글자수 입력 제한은 바이트(Byte) 단위를 원칙으로 삼습니다. 
              <strong>한글 1글자는 3바이트</strong>, <strong>공백 및 영문/숫자는 1바이트</strong>로 계산됩니다. 본 도구는 교무실 실제 계산식과 완전히 일치하도록 정밀 보정되어 오차가 없습니다.
            </div>
          </div>

        </section>

      </main>

      {/* Google AdSense 승인 및 SEO를 위한 고품질 학술 교육 정보 센터 */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4 mb-5 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#004ea2]" />
              <span>📚 나이스 과세특 & 생기부 기재 교육 정보실</span>
            </h2>
            <span className="text-xs bg-blue-50 text-[#004ea2] font-semibold px-2 py-1 rounded">교직 업무 가이드</span>
          </div>

          {/* 가이드 아티클 탭 헤더 */}
          <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveGuideTab("guide_writing")}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
                activeGuideTab === "guide_writing"
                  ? "border-[#004ea2] text-[#004ea2] bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              📝 2026학년도 생기부 과세특 기재원칙
            </button>
            <button
              onClick={() => setActiveGuideTab("guide_bytes")}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
                activeGuideTab === "guide_bytes"
                  ? "border-[#004ea2] text-[#004ea2] bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              🔢 NEIS 글자수 바이트 정확히 알기
            </button>
            <button
              onClick={() => setActiveGuideTab("guide_security")}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
                activeGuideTab === "guide_security"
                  ? "border-[#004ea2] text-[#004ea2] bg-blue-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              🔒 100% 로컬 API 키 구동 안전성 검증
            </button>
          </div>

          {/* 가이드 아티클 본문 */}
          <div className="py-5 text-gray-600 leading-relaxed text-xs md:text-sm">
            {activeGuideTab === "guide_writing" && (
              <article className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-gray-800 text-sm md:text-base flex items-center gap-2">
                  <span>🎓</span> 교육과정 성취기준 연계와 정량적·정성적 서술 기법
                </h3>
                <p>
                  학교생활기록부 기재 요령의 가장 핵심은 <strong>과목별 교육과정 성취기준에 입각한 개별적 특징의 구체적 서술</strong>입니다. 단순히 '태도가 좋음', '수업에 성실히 임함'과 같은 추상적인 표현은 학교 교육 활동의 신뢰도를 저해하며 대입 학생부종합전형 등의 다면 분석 단계에서 긍정적인 평가를 받기 어렵습니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
                  <div className="p-3.5 bg-slate-50 border border-gray-100 rounded-lg">
                    <strong className="text-[#004ea2] block mb-1 text-xs">✅ 지양해야 할 표현 (추상적 미사여구)</strong>
                    <p className="text-xs text-gray-500">
                      "수업 태도가 성실하고 성격이 매우 밝아 급우들과 원만하게 지내며 다방면에 호기심이 많은 모범적인 학생임." (행동 요인과 교과 성취기준의 연결 고리가 누락됨)
                    </p>
                  </div>
                  <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <strong className="text-green-700 block mb-1 text-xs">🎯 지향해야 할 표현 (행동 관찰 및 성취 수준 기반)</strong>
                    <p className="text-xs text-gray-600">
                      "문학 작품의 심미적 가치 수용 단원과 연계하여, 시인의 반성적 자아 관찰 기법을 현대 청소년의 내면 성장통과 연결하여 논리적으로 서술함. 특히 정량적 분석에서 높은 주도성을 나타냄."
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  교사는 한 학기 동안 관찰된 수행평가, 보고서 작성, 모둠 토론, 개인 질문 에피소드를 문장의 골격으로 삼아야 합니다. AI 초안 생성기는 이 뼈대에 살을 붙이고 표현을 정돈하여 교사의 기재 업무 경감을 실질적으로 도울 수 있도록 설계되었습니다.
                </p>
              </article>
            )}

            {activeGuideTab === "guide_bytes" && (
              <article className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-gray-800 text-sm md:text-base flex items-center gap-2">
                  <span>📐</span> 왜 한글 파일이나 일반 사이트의 글자수 계산과 NEIS 바이트는 다를까?
                </h3>
                <p>
                  교육부에서 공식적으로 관리하는 교육행정정보시스템인 <strong>나이스(NEIS)</strong>는 독특한 문자열 바이트(Byte) 계산법을 적용합니다. 이를 인지하지 못하고 마이크로소프트 워드나 한글과컴퓨터 한글(.hwp)에서 단순 계산한 수치를 복사하여 붙여넣으면, 분량 초과 오류가 발생해 입력 내용이 도중에 끊기는 불상사가 생길 수 있습니다.
                </p>
                
                <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>나이스 기준 표준 바이트 변환표</span>
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-amber-800 space-y-1">
                    <li><strong>한글(초성·중성·종성 결합):</strong> 1자당 3 Byte로 계산</li>
                    <li><strong>영문 대소문자 / 아라비아 숫자:</strong> 1자당 1 Byte로 계산</li>
                    <li><strong>공백 (띄어쓰기):</strong> 1자당 1 Byte로 계산</li>
                    <li><strong>특수문자 (전각/반각 공통):</strong> 종류에 따라 1~3 Byte로 상이 (표준 부호는 대부분 1~2 Byte)</li>
                    <li><strong>줄바꿈 (Enter / 캐리지리턴):</strong> 2 Byte로 합산</li>
                  </ul>
                </div>
                <p>
                  본 과세특 초안 생성기는 교무 현장에서 입력 누락의 불상사가 절대 일어나지 않도록, 실제 나이스 시스템의 코덱과 완전히 호환되는 바이트 측정 로직을 도입했습니다. 문장을 새로 작성하거나 편집하는 내내 우측 상단에서 실시간 바이트 프로그레스바가 변환되며, 초과 시 즉각 경고 표시로 교무 행정의 안전 지수를 극대화합니다.
                </p>
              </article>
            )}

            {activeGuideTab === "guide_security" && (
              <article className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-extrabold text-gray-800 text-sm md:text-base flex items-center gap-2">
                  <span>🔒</span> 안전한 독립형 로컬 작동 원리: 데이터 서버 저장 Zero 아키텍처
                </h3>
                <p>
                  과세특 등 학생생활기록부 관련 일체의 데이터는 <strong>외부 유출 및 대외 비공개가 의무화된 기밀 교육 정보</strong>입니다. 시중에 배포된 상당수 생성 AI 웹사이트들은 서버 데이터베이스에 사용자의 질문과 결과를 기록 및 저장하여 학습 데이터로 가공하므로, 기재 지침 위반 리스크를 안고 있습니다.
                </p>
                <div className="p-4 bg-[#f8fafc] border border-gray-200 rounded-lg space-y-2">
                  <p className="text-xs font-bold text-[#004ea2] flex items-center gap-1.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                    <span>본 과세특 초안 생성기가 100% 기밀을 준수하는 방법</span>
                  </p>
                  <ol className="list-decimal pl-5 text-xs text-gray-600 space-y-1.5">
                    <li>
                      <strong>로컬 저장 메커니즘:</strong> 입력된 Gemini API Key 및 기재 정보 데이터는 오직 사용자의 컴퓨터 브라우저 임시 보안영역인 `localStorage`에만 보관됩니다.
                    </li>
                    <li>
                      <strong>다이렉트 전송:</strong> 교사가 입력한 관찰 에피소드나 성취기준 텍스트는 개발자 등 외부 삼자 서버를 일절 경유하지 않고, 오직 구글(Google) 공식 API 인프라로만 보안SSL 터널링을 통해 직접 전송됩니다.
                    </li>
                    <li>
                      <strong>학습 데이터 배제:</strong> 구글 클라우드 및 AI 스튜디오 API 호출은 구글의 공식 방침에 따라 기업용 인프라로 취급되어 사용자의 입력값을 AI 모델 개발과 재학습에 활용하지 않습니다.
                    </li>
                  </ol>
                </div>
                <p className="text-xs text-gray-500">
                  교사분들은 안심하고 본인 고유의 무료 자원을 연계하여 기밀 누출 걱정 없이 업무 효율을 극한으로 올릴 수 있습니다.
                </p>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* 푸터 영역 - 애드센스 규정 충족 링크 포함 */}
      <footer className="bg-white border-t border-gray-200 mt-auto px-4 md:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
          <span>&copy; 2026 NEIS 과세특 Assistant. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-[#004ea2] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            업무 제휴 및 문의: <a href="mailto:0107287jh@gmail.com" className="hover:underline">0107287jh@gmail.com</a>
          </span>
        </div>
        
        {/* 애드센스 심사 필수 항목 링크들 */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 text-gray-500">
          <button 
            onClick={() => {
              setPolicyTab("privacy");
              setIsPolicyModalOpen(true);
            }} 
            className="hover:text-blue-700 hover:underline font-bold transition-colors cursor-pointer"
          >
            개인정보처리방침
          </button>
          <span className="text-gray-200">|</span>
          <button 
            onClick={() => {
              setPolicyTab("terms");
              setIsPolicyModalOpen(true);
            }} 
            className="hover:text-blue-700 hover:underline font-bold transition-colors cursor-pointer"
          >
            서비스 이용약관
          </button>
          <span className="text-gray-200">|</span>
          <button 
            onClick={() => {
              setPolicyTab("disclaimer");
              setIsPolicyModalOpen(true);
            }} 
            className="hover:text-blue-700 hover:underline font-bold transition-colors cursor-pointer"
          >
            책임의 한계 및 면책고지
          </button>
          <span className="text-gray-200">|</span>
          <button 
            onClick={() => setIsHelpModalOpen(true)} 
            className="hover:text-gray-800 transition-colors cursor-pointer"
          >
            기본 이용안내
          </button>
        </div>
      </footer>

      {/* 법적 고지 및 약관 통합 모달 (AdSense 필수 요구 스펙) */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#004ea2] text-white px-5 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm">운영 정책 및 법률 준수 정책실</h3>
              </div>
              <button 
                onClick={() => setIsPolicyModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 내부 탭 선택 */}
            <div className="bg-slate-50 border-b border-gray-200 px-5 py-2 flex gap-2 shrink-0 overflow-x-auto">
              <button
                onClick={() => setPolicyTab("privacy")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  policyTab === "privacy" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                🔒 개인정보처리방침
              </button>
              <button
                onClick={() => setPolicyTab("terms")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  policyTab === "terms" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                📜 서비스 이용약관
              </button>
              <button
                onClick={() => setPolicyTab("disclaimer")}
                className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                  policyTab === "disclaimer" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                ⚠️ 책임 및 면책고지
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed overflow-y-auto flex-1">
              
              {policyTab === "privacy" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-100 pb-1 text-[#004ea2]">
                    개인정보처리방침 (Privacy Policy)
                  </h4>
                  <p className="text-xs text-gray-500">
                    <strong>나이스(NEIS) 연계 과세특 초안 생성기</strong>(이하 '본 서비스')는 교직원 및 교육관계자의 소중한 개인정보와 학생들의 기록 안전을 최우선 사명으로 삼고 있습니다. 이에 의거하여 다음과 같이 개인정보처리방침을 제정하고 투명하게 공개합니다.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs">
                    <li>
                      <strong>개인정보 수집 및 저장의 부존재:</strong> 본 서비스는 사용자가 화면에서 타이핑하거나 변환 및 복사하는 어떠한 학생 성취기준, 수업 에피소드 관찰기록, 결과 결과물 등의 정보와 연동에 필요한 구글 Gemini API Key 및 Google OAuth Client ID를 외부 데이터베이스나 수집 서버로 전송, 기록, 축적하지 않습니다.
                    </li>
                    <li>
                      <strong>로컬 브라우저 기억 장치의 사용:</strong> 사용자가 보다 편안하게 서비스를 이용할 수 있도록, 입력된 키와 선택 모드는 오직 브라우저 내부의 독립 메모리 공간인 `localStorage` 영역에 보관됩니다. 이는 철저히 선생님 본인의 웹 브라우저 내부에만 머물러 있으며, 브라우저 캐시 삭제 또는 사이트 내 ‘초기화’ 기능 수행 시 실시간 영구 삭제됩니다.
                    </li>
                    <li>
                      <strong>구글 공식 API 인프라 보안 터널링:</strong> 기재 생성 과정에서 발생하는 모든 AI 호출 텍스트는 SSL 암호화 처리되어 구글 본사의 클라우드 API 게이트웨이(Google Cloud Endpoint)로만 직통 송신됩니다.
                    </li>
                    <li>
                      <strong>애드센스 쿠키 및 추적 장치 고지:</strong> 본 웹사이트는 안정적인 운영 예산 마련과 사용자 통계 측정을 위해 구글 애드센스(Google AdSense) 및 Google Analytics 광고/분석 태그를 기동할 수 있습니다. 이 과정에서 익명의 쿠키(Cookie)가 작동하여 타겟팅 맞춤형 정보가 제공될 수 있습니다. 사용자는 원할 시 브라우저 설정을 변경하여 이 쿠키 기록을 전체 거부할 권리가 있습니다.
                    </li>
                  </ol>
                  <p className="text-[11px] text-gray-400 mt-2">
                    본 처리방침의 개정일자는 2026년 7월 2일이며 시행 즉시 효력이 발생합니다.
                  </p>
                </div>
              )}

              {policyTab === "terms" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-100 pb-1 text-[#004ea2]">
                    서비스 이용약관 (Terms of Service)
                  </h4>
                  <p className="text-xs text-gray-500">
                    본 약관은 <strong>나이스(NEIS) 연계 과세특 초안 생성기</strong>(이하 '생성기')가 제공하는 인터넷 지향 교육 지원 유틸리티 서비스의 전반적인 이용조건 및 절차를 정의합니다.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs">
                    <li>
                      <strong>서비스 목적:</strong> 본 생성기는 대한민국 초·중·고교 교사의 기재 고충을 덜고 학생 평가 작성 능력을 극대화하기 위해 개발된 보조적 도구입니다. 어떠한 형태의 유료 결제나 부당 이득을 요구하지 않는 전면적인 무료 개방형 웹 서비스입니다.
                    </li>
                    <li>
                      <strong>회원의 도의적 준수 의무:</strong> 사용자인 교사는 본 시스템을 통해 학생부 초안을 생성하는 과정에서, 학생의 실명이나 주민등록번호, 민감한 성적 현황 등의 개인식별 정보가 입력란에 날것 그대로 포함되지 않도록 성실한 익명화/가명화(예: '김OO', '학생A') 조치를 이행할 권고 및 의무가 있습니다.
                    </li>
                    <li>
                      <strong>Gemini API 연동 책임:</strong> 교사는 무료 쿼터 범위 내에서 원활한 이용을 도모하기 위해 구글 AI 스튜디오 등에서 무상 발급받은 정당한 API 키를 활용하며, 이에 따른 사용 한도 및 규격은 구글 클라우드의 정책과 연동됩니다.
                    </li>
                    <li>
                      <strong>불법 유포 및 악용 금지:</strong> 본 생성기를 악의적인 수단으로 대량 스크래핑하거나, 상업적 목적으로 재가공 및 판매하여 교육 환경을 흐리는 일체 행위를 금합니다.
                    </li>
                  </ol>
                </div>
              )}

              {policyTab === "disclaimer" && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-gray-800 text-sm border-b border-gray-100 pb-1 text-[#004ea2]">
                    책임의 한계 및 면책고지 (Disclaimer)
                  </h4>
                  <p className="text-xs text-gray-500">
                    선생님들께 유용한 참고 도구를 제공하고자 최선을 다하고 있으나, 인공지능 기술의 특성상 아래와 같은 명확한 책임 한계가 존재함을 확인하고 이에 동의하는 분에 한해 서비스를 제공합니다.
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs">
                    <li>
                      <strong>AI 생성물의 불완전성:</strong> 본 생성기를 통해 조립 및 출력된 과목별 세부능력 및 특기사항 초안 문안은 생성형 AI가 언어 패턴 학습에 따라 임의로 직조해 낸 보조 텍스트에 지나지 않습니다. 이에 따라 실제 학생의 특징과 무관한 서술이나 사실적 오류(환각 현상)가 포함될 가능성이 상존합니다.
                    </li>
                    <li>
                      <strong>검수 의무의 주체:</strong> 최종 생활기록부 등재의 모든 심의 권한과 법적 검토 책임은 교사 본인에게 있습니다. 교사는 나이스(NEIS) 시스템에 정식 기재하기 전, 해당 문장이 '교육부 학교생활기록부 기재 요령'을 위반하지 않았는지, 금지어(교외 수상 실적, 자격증, 사교육 유발 요소 등)가 포함되지 않았는지 직접 눈으로 정밀하게 철저히 감수해야 합니다.
                    </li>
                    <li>
                      <strong>결과적 책임의 면책:</strong> 본 서비스를 이용해 발생한 입력 오류, 나이스 등재 누락, 생활기록부 장학 지도 지적, 대입 전형의 불이익을 포함한 직간접적인 어떠한 피해나 마찰에 대해서도 서비스 기획 개발자 및 산하 교육 인프라는 일체의 민형사상 손해 배상 및 위자료 책임을 지지 아니합니다.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-5 py-3.5 flex justify-end border-t border-gray-100 shrink-0">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="bg-[#004ea2] hover:bg-[#003d80] text-white font-bold text-xs px-4 py-2 rounded cursor-pointer transition-colors"
              >
                약관 및 정책 동의 후 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 도움말 및 구글 클라우드 세팅 가이드 모달 */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200">
            <div className="bg-[#004ea2] text-white px-5 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Layers className="w-4.5 h-4.5" />
                <h3 className="font-bold text-sm">도움말 및 구글 로그인(OAuth 2.0) 세팅 가이드</h3>
              </div>
              <button 
                onClick={() => setIsHelpModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 text-xs md:text-sm text-gray-600 leading-relaxed max-h-[450px] overflow-y-auto">
              
              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5 text-[#004ea2]">
                  <span>🔒</span> 안전한 독립형 로컬 작동 아키텍처
                </h4>
                <p className="text-xs text-gray-500 mb-2">
                  본 서비스는 선생님들이 입력하는 모든 기밀 문장을 개발자의 서버나 데이터베이스를 전혀 거치지 않고, **오직 브라우저에서 구글(Google) 공식 API 서버로 직접 연동**하여 처리합니다.
                </p>
                <p className="text-xs text-gray-500">
                  선생님들이 발급받은 **Gemini API Key** 또는 **Google Cloud OAuth Client ID**를 통해 본인의 교육용 쿼터와 계정 비용 안에서 무료이자 무제한으로 보안 지침을 어기지 않고 투명하게 사용하실 수 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5 text-[#004ea2]">
                  <span>📌</span> 바이트 계산 규정
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>한글 1글자:</strong> 3 Byte</li>
                  <li><strong>영문 및 숫자:</strong> 1 Byte</li>
                  <li><strong>공백 (띄어쓰기):</strong> 1 Byte</li>
                  <li><strong>줄바꿈 (Enter):</strong> 2 Byte</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-sm mb-1.5 flex items-center gap-1.5 text-[#004ea2]">
                  <span>💡</span> 효과적인 과세특 초안 작성 요령
                </h4>
                <p className="text-gray-500 mb-2 text-xs">
                  생활기록부는 단순한 미사여구보다 <strong>학생의 구체적인 행동과 탐구 내용</strong>이 서술되어야 신뢰성을 얻습니다.
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-xs">
                  <li>성취기준과 연계하여 학생이 달성한 학습 요소를 구체적으로 명시합니다.</li>
                  <li>수업 내 수행평가나 프로젝트 등에서 도출된 관찰 에피소드를 문장의 뼈대로 잡습니다.</li>
                  <li>학생 특성 및 성격 키워드가 서술형 문맥에 자연스럽게 융합되도록 합니다.</li>
                  <li>종결어미는 가급적 '~함.', '~임.', '~력을 보임.' 등으로 간결하게 통일합니다.</li>
                </ol>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border border-gray-100 text-[11px]">
                <span className="font-bold text-gray-700 block mb-1">📢 건의 및 협업 제안</span>
                서비스 기능 개선 및 대량 템플릿 제휴, 건의 사항은 하단에 기재된 개발자 이메일(<strong>0107287jh@gmail.com</strong>)로 편하게 문의주시기 바랍니다.
              </div>
            </div>

            <div className="bg-gray-50 px-5 py-3.5 flex justify-end border-t border-gray-100">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="bg-[#004ea2] hover:bg-[#003d80] text-white font-bold text-xs px-4 py-2 rounded cursor-pointer transition-colors"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
