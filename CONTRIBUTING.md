# 기여 가이드 (Contributing Guide)

ChzzkMate 프로젝트에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 🚀 시작하기

### 개발 환경 설정

1. **저장소 포크 및 클론**
```bash
git clone https://github.com/YOUR_USERNAME/ChzzkMate.git
cd ChzzkMate
```

2. **의존성 설치**
```bash
npm install
```

3. **확장프로그램 로드**
   - Chrome에서 `chrome://extensions/` 접속
   - "개발자 모드" 활성화
   - "압축해제된 확장 프로그램을 로드합니다" 클릭
   - ChzzkMate 폴더 선택

## 📋 기여 방법

### 1. 이슈 확인 및 할당
- [Issues](https://github.com/GGULBAE/ChzzkMate/issues)에서 작업할 이슈 확인
- 댓글로 작업 의사 표시
- Assignee로 자신을 지정

### 2. 브랜치 생성
```bash
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/your-bug-fix
```

### 3. 개발 및 테스트
- 코드 작성
- 기능 테스트
- 치지직에서 실제 동작 확인

### 4. 커밋 및 푸시
```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/your-feature-name
```

### 5. Pull Request 생성
- GitHub에서 Pull Request 생성
- 제목과 설명 작성
- 관련 이슈 링크

## 🎯 기여 가능한 영역

### 🐛 버그 수정
- 치지직 페이지 구조 변경 대응
- 볼륨 설정 저장/로드 오류
- UI 렌더링 문제
- 브라우저 호환성 문제

### ✨ 새로운 기능
- 추가 볼륨 프리셋 기능
- 키보드 단축키 지원
- 볼륨 히스토리 기능
- 다크모드 지원
- 다국어 지원

### 🔧 개선사항
- 코드 최적화
- UI/UX 개선
- 성능 향상
- 접근성 개선

### 📚 문서화
- README 개선
- 코드 주석 추가
- 사용법 가이드 작성
- API 문서 작성

## 📝 코딩 스타일 가이드

### JavaScript
```javascript
// 좋은 예
class ChzzkMateController {
  constructor() {
    this.videoElement = null;
    this.streamerId = null;
  }

  async applyVolumeSettings() {
    try {
      const result = await chrome.storage.sync.get(['defaultVolume']);
      // ...
    } catch (error) {
      console.error('ChzzkMate: 볼륨 설정 적용 실패:', error);
    }
  }
}

// 나쁜 예
function applyVolume() {
  chrome.storage.sync.get(['defaultVolume'], function(result) {
    // ...
  });
}
```

### CSS
```css
/* 좋은 예 */
.chzzkmate-volume-ui {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  color: white;
  font-size: 12px;
}

/* 나쁜 예 */
.volume-ui {
  display:flex;gap:8px;padding:4px;background:rgba(0,0,0,0.7);
}
```

### HTML
```html
<!-- 좋은 예 -->
<div class="volume-control">
  <label for="volumeSlider">볼륨:</label>
  <input type="range" id="volumeSlider" min="0" max="1" step="0.01">
  <span class="volume-value">50%</span>
</div>

<!-- 나쁜 예 -->
<div><label>볼륨:</label><input type="range"><span>50%</span></div>
```

## 🧪 테스트 가이드

### 수동 테스트 체크리스트
- [ ] 치지직 방송 페이지에서 확장프로그램 로드 확인
- [ ] 비디오 플레이어 감지 및 볼륨 UI 추가 확인
- [ ] 볼륨 슬라이더 동작 확인
- [ ] 볼륨 설정 저장/로드 확인
- [ ] 확장프로그램 팝업 UI 동작 확인
- [ ] 스트리머별 볼륨 설정 저장/삭제 확인
- [ ] 기본 볼륨 설정 동작 확인

### 테스트 시나리오
1. **기본 동작 테스트**
   - 치지직 방송 시청
   - 볼륨 조절
   - 페이지 새로고침 후 볼륨 유지 확인

2. **스트리머별 설정 테스트**
   - 여러 스트리머 방송 시청
   - 각각 다른 볼륨 설정
   - 스트리머별 볼륨 자동 적용 확인

3. **UI 테스트**
   - 팝업 UI 모든 기능 테스트
   - 플레이어 컨트롤 바 UI 테스트
   - 반응형 디자인 확인

## 📋 Pull Request 가이드

### PR 제목 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 설정 변경
```

### PR 설명 템플릿
```markdown
## 변경사항
- 변경된 내용 설명

## 테스트
- [ ] 수동 테스트 완료
- [ ] 치지직에서 동작 확인
- [ ] 기존 기능 영향 없음 확인

## 관련 이슈
- Closes #이슈번호

## 스크린샷 (필요시)
- 변경 전/후 스크린샷
```

### PR 체크리스트
- [ ] 코드가 기존 스타일과 일치
- [ ] 새로운 기능에 대한 테스트 완료
- [ ] 문서 업데이트 (필요시)
- [ ] 기존 기능에 영향 없음
- [ ] 코드 리뷰 준비 완료

## 🐛 버그 리포트 가이드

### 버그 리포트 템플릿
```markdown
## 버그 설명
간단한 버그 설명

## 재현 단계
1. 치지직 방송 페이지 접속
2. 볼륨 조절 시도
3. 오류 발생

## 예상 동작
정상적으로 동작해야 할 내용

## 실제 동작
실제로 발생하는 문제

## 환경 정보
- OS: macOS/Windows/Linux
- Chrome 버전: XX.XX.XX
- 확장프로그램 버전: 1.0.0
- 치지직 URL: https://chzzk.naver.com/...

## 추가 정보
- 스크린샷
- 콘솔 로그
- 기타 관련 정보
```

## 💡 기능 제안 가이드

### 기능 제안 템플릿
```markdown
## 기능 설명
제안하는 기능의 상세 설명

## 사용 사례
- 언제 사용하는지
- 왜 필요한지
- 어떤 문제를 해결하는지

## 구현 방법 (선택사항)
가능한 경우 구현 방법 제안

## 우선순위
- High: 필수 기능
- Medium: 유용한 기능
- Low: Nice to have

## 추가 정보
- 참고할 만한 다른 확장프로그램
- 관련 기술 정보
```

## 📞 연락처

- **GitHub Issues**: [ChzzkMate Issues](https://github.com/GGULBAE/ChzzkMate/issues)
- **GitHub Discussions**: [ChzzkMate Discussions](https://github.com/GGULBAE/ChzzkMate/discussions)

## 🙏 감사

모든 기여자분들께 감사드립니다! 작은 기여도 큰 도움이 됩니다.

---

<div align="center">
  <p>함께 더 나은 ChzzkMate를 만들어가요! 🚀</p>
</div>
