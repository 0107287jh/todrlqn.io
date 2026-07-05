# 📝 나이스(NEIS) 연계 과세특 초안 생성기

> **선생님 개인 구글 Gemini API 연동을 통한 학교생활기록부 과목별 세부능력 및 특기사항(과세특) 초안 작성기**  
> 본 프로젝트는 교육 현장에서 교사의 업무를 획기적으로 경감하고, 학생의 행동 관찰 데이터를 바탕으로 풍부하고 세련된 성취수준 기반의 과세특 초안을 조립해 주는 독립형 웹 어플리케이션입니다.

---

## ✨ 핵심 특장점 및 아키텍처

1. **🔒 100% 개인정보 보안 (서버 저장 Zero)**
   - 선생님께서 직접 발급받으신 무료 구글 Gemini API Key 또는 세션 방식을 사용하여 브라우저 로컬 환경(`localStorage`) 내에서만 안전하게 키와 임시 데이터를 저장 및 연산합니다. 
   - 개발자나 어떠한 삼자 서버로도 학생 정보 및 API 키가 유출되지 않는 극도로 안전한 보안 설계를 자랑합니다.

2. **🔢 나이스(NEIS) 호환 실시간 바이트 계산기**
   - 일반 메모장이나 한글 파일의 글자 수 계산법과 완전히 다른 **나이스 표준 바이트(한글 3Byte, 영어/공백 1Byte, 줄바꿈 2Byte)** 변환 계산기를 탑재하여 작성 도중 분량 초과 오류를 완벽 예방합니다.

3. **📊 교육부 기재요령 가이드라인 및 정책 고지 탑재**
   - 구글 애드센스(Google AdSense) 승인 조건을 완벽 충족하도록 체계적이고 깊이 있는 학술 교육 가이드라인(정보성 아티클)과 필수 법적 문서(개인정보처리방침, 이용약관, 면책고지)를 내장하고 있어, 개인 사이트로 즉시 애드센스 광고를 달아 운영하실 수 있습니다.

---

## 🛠️ 기술 스택

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Motion (애니메이션)
- **Backend (선택형):** Node.js, Express (개발 시 정적 파일 서빙 및 기본 API 구조 탑재)
- **AI Engine:** @google/genai (Google Gemini API 공식 최신 SDK)
- **Build & Bundle:** Esbuild (Express 서버 빌드), Vite (리액트 빌드)

---

## 🚀 1. 깃허브(GitHub)에 내 저장소로 업로드하기

본 프로젝트를 선생님의 개인 깃허브 계정에 올리는 방법입니다.

### 1단계: Git 설치 확인 및 로컬 폴더 초기화
컴퓨터에 Git이 설치되어 있는지 확인하고, 프로젝트 루트 폴더에서 아래 명령을 차례로 입력합니다.

```bash
# 1. 터미널 또는 Git Bash를 열고 프로젝트 폴더로 이동 후 Git 초기화
git init

# 2. .gitignore 파일이 있는지 확인하고 모든 파일 추가
git add .

# 3. 최초 커밋 생성
git commit -m "feat: 나이스 연계 과세특 초안 생성기 고도화 및 배포 준비 완료"
```

### 2단계: GitHub에 새 저장소(Repository) 만들기
1. [GitHub 공식 사이트](https://github.com)에 로그인합니다.
2. 우측 상단의 **`+`** 버튼을 누르고 **`New repository`**를 선택합니다.
3. **Repository name**에 `neis-draft-generator` (원하는 이름)을 입력합니다.
4. **Public**(공개) 또는 **Private**(비공개) 중 원하는 설정을 선택합니다. (애드센스 승인을 원하고 많은 선생님들께 공유하려면 **Public**을 권장합니다.)
5. *Initialize repository with:* 영역의 모든 체크박스(README, .gitignore 등)를 **체크 해제**한 채로 맨 아래 **`Create repository`** 버튼을 누릅니다.

### 3단계: GitHub에 소스 코드 푸시하기
저장소가 만들어지면 화면에 표시되는 명령어 중 아래 명령어를 복사하여 터미널에 실행합니다. (주소 부분에 본인의 깃허브 주소를 넣으세요)

```bash
# 브랜치 명을 main으로 설정
git branch -M main

# 내 깃허브 저장소 주소를 로컬에 원격 등록 (아래 URL을 본인 저장소 주소로 변경하세요)
git remote add origin https://github.com/본인계정명/neis-draft-generator.git

# 원격 저장소로 코드 푸시
git push -u origin main
```

---

## 🌐 2. 클라우드 서비스에 무료로 배포하기 (Web Hosting)

본 애플리케이션은 **사용자의 브라우저 내에서 직접 AI와 통신하는 정적 SPA(Single Page App) 구조**로 설계되어 있어, 별도의 유료 데이터베이스나 Node.js 서버 배포 없이 **무료 정적 웹호스팅 서비스**만으로도 100% 완벽하게 구동됩니다.

가장 빠르고 대중적인 세 가지 무료 배포 환경을 안내해 드립니다.

---

### 옵션 A: Vercel (버셀) - 🌟 초간단 추천
지연 시간이 짧고 Github과 연동이 가장 부드러운 호스팅 플랫폼입니다.

1. [Vercel](https://vercel.com) 사이트에 접속하여 GitHub 계정으로 가입/로그인합니다.
2. 대시보드 우측 상단의 **`Add New...`** -> **`Project`**를 클릭합니다.
3. 방금 올린 `neis-draft-generator` 저장소를 찾아서 **`Import`** 버튼을 누릅니다.
4. **Configure Project** 화면이 나오면 기본값을 그대로 둔 채 **`Deploy`** 버튼을 클릭합니다.
   - *Framework Preset:* **Vite**가 자동으로 감지됩니다.
   - *Build Command:* `npm run build`
   - *Output Directory:* `dist`
5. 약 30초~1분 후 배포가 완료되며, Vercel이 무료로 제공하는 고유의 도메인(예: `https://neis-draft-generator.vercel.app`) 주소로 즉시 접속할 수 있습니다!

---

### 옵션 B: Cloudflare Pages (클라우드플레어 페이지스)
한국 내 접속 속도가 매우 빠르고 전송량(대역폭) 제한이 사실상 무제한인 배포 플랫폼입니다.

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에 로그인(또는 가입)합니다.
2. 왼쪽 메뉴에서 **`Workers & Pages`** -> **`Create`** -> **`Pages`** 탭을 클릭합니다.
3. **`Connect to Git`** 버튼을 누르고 GitHub 계정을 연결합니다.
4. 배포할 레포지토리 `neis-draft-generator`를 선택한 후 **`Begin setup`**을 누릅니다.
5. 설정창에서 다음과 같이 빌드 환경을 설정합니다:
   - **Framework preset:** `Vite` 선택
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. 맨 아래 **`Save and Deploy`**를 누르면 빌드가 실행되고 전 세계로 즉시 서빙됩니다.

---

### 옵션 C: GitHub Pages (깃허브 페이지스)
깃허브 자체 기능만으로 별도의 외부 서비스 연동 없이 무료 사이트를 가동하는 방법입니다.

1. 올리신 GitHub 저장소 화면 상단의 **`Settings`** 탭으로 이동합니다.
2. 왼쪽 메뉴에서 **`Pages`**를 선택합니다.
3. **Build and deployment** 하위의 **Source**를 `Deploy from a branch`로 선택합니다.
4. **Branch** 설정을 `main` 브랜치, 폴더는 `/ (root)`로 선택한 후 **`Save`**를 누릅니다.
   - *주의:* Vite로 빌드한 결과물(`dist`)을 GitHub Pages로 간편하게 자동 배포하기 위해, 소스 코드 내에 간단한 워크플로우 액션을 추가하거나 `gh-pages` 패키지를 활용하는 것이 권장됩니다.

---

### 옵션 D: 자체 서버 / Docker Container 배포 (Full-Stack 방식)
프로젝트 내부에 내장된 Node.js Express 기반의 컨테이너 환경으로 배포하고 싶은 경우, 함께 제공되는 `Dockerfile`을 이용해 배포합니다. (Fly.io, Railway, Render, 구글 Cloud Run 등 지원)

```bash
# Docker 이미지 빌드
docker build -t neis-draft-generator .

# Docker 컨테이너 실행 (3000번 포트로 구동됩니다)
docker run -p 3000:3000 neis-draft-generator
```

---

## 💰 3. 구글 애드센스(Google AdSense) 통과 및 광고 게재 꿀팁

본 프로그램은 구글 애드센스의 엄격한 심사 기준인 **"독창적이고 가치 있는 고품질 콘텐츠 제공 의무(Value Content Policy)"** 및 **"명확한 사이트 이용 약관 보유 의무"**를 완전히 충족하도록 기획되었습니다.

애드센스 승인을 받고 광고를 띄우기 위해 다음 단계를 진행해 주세요.

1. **내 웹사이트 도메인 준비:** 배포 완료된 나만의 도메인 주소(예: `https://my-neis-assistant.vercel.app`)를 획득합니다.
2. **AdSense 신청:** [구글 애드센스 홈페이지](https://adsense.google.com)에 로그인 후 **`사이트 추가`**를 진행합니다.
3. **인증 코드 삽입:** 
   - 애드센스에서 부여한 `ca-pub-xxxxxxxxxxxxxxxx` 형태의 계정 고유 ID를 확인합니다.
   - 프로젝트의 `index.html` 파일 26번 라인 근처에 있는 다음 태그의 속성값을 본인 정보로 교체합니다:
     ```html
     <meta name="google-adsense-account" content="ca-pub-본인의코드" />
     ```
   - 필요 시 애드센스 자동광고용 `<script>` 코드를 `index.html` 내의 `<head>` 태그 끝자락에 붙여 넣습니다.
4. **콘텐츠성 아티클 활용:** 하단 푸터 위에 기본 배치된 **[나이스 과세특 & 생기부 기재 교육 정보실]** 탭을 적극 어필하세요. 봇(Crawler)이 방문했을 때 실제 교직 정보를 제공하는 유용한 학술 지향 사이트로 분류되어 승인 확률이 급격히 상승합니다.
5. **법적 보호 문서 활용:** 사이트 최하단에 배치된 **[개인정보처리방침 / 서비스 이용약관 / 책임 및 면책고지]** 모달 링크를 유지해 주세요. 구글 정책 준수 모니터링 심사역(Reviewer)이 이 페이지들의 작동을 확인함으로써 신뢰성 높은 정식 웹앱으로 인증을 받게 됩니다.

---

## 👨‍💻 개발 및 실행 명령 (로컬용)

로컬 컴퓨터에서 본 프로그램을 구동하고 테스트하는 방법입니다.

```bash
# 의존성 패키지 설치
npm install

# 로컬 개발 서버 기동 (Express + Vite 하이브리드)
npm run dev

# 프로덕션 빌드 (빌드 완료된 정적 파일은 dist 폴더에 생성됩니다)
npm run build

# 프로덕션 서버 미리보기 실행
npm start
```

---

## 📄 라이선스 및 준수사항

- 본 프로그램은 자유로운 활용 및 배포가 가능합니다. 
- 단, 학생생활기록부를 가공하는 교육 행정용 보조 유틸리티의 특성상 생성된 초안의 최종 검토 및 책임은 작성자(교사 본인)에게 있으며, 실무 적용 시 반드시 '학교생활기록부 기재 요령'을 성실하게 감수하시어 교육 현장의 올바른 평가 문화를 실천해 주세요.
