# ChzzkMate 🎵

> 치지직 스트리밍 방송별 볼륨을 자동으로 기억하고 적용하는 Chrome 확장프로그램

[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com/GGULBAE/ChzzkMate)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-brightgreen.svg)](https://chrome.google.com/webstore)

## 📖 소개

ChzzkMate는 치지직 스트리밍을 시청할 때 각 방송별로 스트리머의 기본 사운드 설정이 달라서 매번 볼륨을 조절해야 하는 불편함을 해결해주는 Chrome 확장프로그램입니다.

### ✨ 주요 기능

- **🎯 스트리머별 볼륨 자동 기억**: 각 스트리머의 볼륨 설정을 자동으로 저장하고 방송 접속 시 자동 적용
- **🔧 전체 기본 볼륨 설정**: 개별 설정이 없는 스트리머에게 적용되는 기본 볼륨 설정
- **🎮 이중 UI 제공**: 
  - 치지직 플레이어 컨트롤 바에 통합된 볼륨 조절 슬라이더
  - 확장프로그램 팝업에서 전체 관리 가능
- **📊 저장된 스트리머 관리**: 저장된 스트리머 목록 확인, 편집, 삭제 기능
- **🔄 실시간 동기화**: 볼륨 변경 시 즉시 저장 및 적용

## 🚀 설치 방법

### Chrome Web Store (추천)
1. [Chrome Web Store](https://chrome.google.com/webstore)에서 "ChzzkMate" 검색
2. "Chrome에 추가" 버튼 클릭
3. 설치 완료 후 치지직 방송 시청

### 수동 설치 (개발자용)
1. 이 저장소를 클론하거나 ZIP 파일 다운로드
```bash
git clone https://github.com/GGULBAE/ChzzkMate.git
cd ChzzkMate
```

2. Chrome 브라우저에서 `chrome://extensions/` 접속
3. 우측 상단의 "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. ChzzkMate 폴더 선택

## 📱 사용 방법

### 기본 사용법
1. **치지직 방송 시청**: 일반적으로 치지직 방송을 시청하세요
2. **볼륨 조절**: 플레이어 컨트롤 바에 추가된 볼륨 슬라이더로 조절
3. **자동 저장**: 볼륨 변경 시 자동으로 해당 스트리머의 설정이 저장됩니다
4. **자동 적용**: 다음에 같은 스트리머 방송을 시청할 때 자동으로 저장된 볼륨이 적용됩니다

### 확장프로그램 팝업 사용법
1. **확장프로그램 아이콘 클릭**: 브라우저 툴바의 ChzzkMate 아이콘 클릭
2. **현재 스트리머 관리**: 현재 시청 중인 스트리머의 볼륨 조절 및 개별 설정 삭제
3. **전체 기본 볼륨 설정**: 새로운 스트리머에게 적용될 기본 볼륨 설정
4. **저장된 스트리머 관리**: 저장된 모든 스트리머 목록 확인 및 관리

### UI 구성 요소

#### 플레이어 컨트롤 바 UI
- 🔊 **볼륨 아이콘**: 현재 볼륨 상태 표시
- 🎚️ **볼륨 슬라이더**: 실시간 볼륨 조절
- 📊 **퍼센트 표시**: 현재 볼륨 퍼센트 표시
- ↺ **리셋 버튼**: 개별 설정 삭제 후 기본 볼륨으로 리셋

#### 확장프로그램 팝업 UI
- **현재 스트리머 섹션**: 현재 시청 중인 스트리머 정보 및 볼륨 조절
- **전체 기본 볼륨 섹션**: 새로운 스트리머 기본 볼륨 설정
- **저장된 스트리머 목록**: 저장된 모든 스트리머 목록 및 관리
- **통계 정보**: 저장된 스트리머 수, 기본 볼륨 등

## 🛠️ 개발자 정보

### 기술 스택
- **Frontend**: Vanilla JavaScript (ES6+)
- **Extension**: Chrome Extension Manifest V3
- **Storage**: Chrome Storage API
- **UI**: HTML5, CSS3
- **Build**: Node.js, Canvas API

### 프로젝트 구조
```
ChzzkMate/
├── manifest.json          # 확장프로그램 설정
├── background.js          # 백그라운드 서비스
├── content.js            # 치지직 페이지 스크립트
├── popup/                 # 팝업 UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── icons/                 # 아이콘 파일들
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── package.json          # Node.js 의존성
├── generate_icons.js     # 아이콘 생성 스크립트
└── README.md
```

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 아이콘 재생성 (필요시)
node generate_icons.js

# 확장프로그램 로드
# Chrome에서 chrome://extensions/ → 개발자 모드 → 압축해제된 확장 프로그램 로드
```

## 🤝 기여하기

ChzzkMate 프로젝트에 기여해주셔서 감사합니다! 

### 기여 방법
1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **Commit** 변경사항 (`git commit -m 'Add some AmazingFeature'`)
4. **Push** 브랜치에 (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

### 기여 가이드라인
- [CONTRIBUTING.md](CONTRIBUTING.md) 파일을 참고해주세요
- 버그 리포트나 기능 제안은 [Issues](https://github.com/GGULBAE/ChzzkMate/issues)에서 해주세요
- 코드 스타일은 기존 코드와 일관성을 유지해주세요

## 🐛 버그 리포트

버그를 발견하셨나요? [Issues](https://github.com/GGULBAE/ChzzkMate/issues)에서 리포트해주세요!

### 버그 리포트 시 포함할 정보
- **브라우저 버전**: Chrome 버전
- **확장프로그램 버전**: ChzzkMate 버전
- **재현 단계**: 버그가 발생하는 단계별 설명
- **예상 동작**: 정상적으로 동작해야 할 내용
- **실제 동작**: 실제로 발생하는 문제
- **스크린샷**: 가능한 경우 스크린샷 첨부

## 💡 기능 제안

새로운 기능을 제안하고 싶으시나요? [Issues](https://github.com/GGULBAE/ChzzkMate/issues)에서 제안해주세요!

### 제안 시 포함할 정보
- **기능 설명**: 제안하는 기능의 상세 설명
- **사용 사례**: 언제, 왜 필요한지
- **구현 방법**: 가능한 경우 구현 방법 제안
- **우선순위**: 얼마나 중요한 기능인지

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

## 🙏 감사의 말

- [치지직](https://chzzk.naver.com) - 훌륬한 스트리밍 플랫폼 제공
- Chrome Extension 개발자 커뮤니티
- 이 프로젝트에 기여해주신 모든 분들

## 📞 연락처

- **GitHub**: [@GGULBAE](https://github.com/GGULBAE)
- **Issues**: [ChzzkMate Issues](https://github.com/GGULBAE/ChzzkMate/issues)

---

<div align="center">
  <p>Made with ❤️ for 치지직 시청자들</p>
  <p>⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!</p>
</div>
