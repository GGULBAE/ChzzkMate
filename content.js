// ChzzkMate Content Script
// 치지직 페이지에서 비디오 플레이어 감지 및 볼륨 자동 조절

class ChzzkMateVolumeController {
  constructor() {
    this.videoElement = null;
    this.streamerId = null;
    this.volumeUI = null;
    this.observer = null;
    this.isInitialized = false;
    
    this.init();
  }

  // 초기화
  init() {
    console.log('ChzzkMate: Content script 초기화');
    
    // 스트리머 ID 추출
    this.extractStreamerId();
    
    // 비디오 엘리먼트 감지
    this.setupVideoObserver();
    
    // 페이지 로드 완료 후 한 번 더 확인
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkForVideo());
    } else {
      this.checkForVideo();
    }
  }

  // URL에서 스트리머 ID 추출
  extractStreamerId() {
    const url = window.location.href;
    const match = url.match(/\/channel\/([^\/\?]+)/);
    if (match) {
      this.streamerId = match[1];
      console.log('ChzzkMate: 스트리머 ID 추출됨:', this.streamerId);
    } else {
      console.log('ChzzkMate: 스트리머 ID를 찾을 수 없음');
    }
  }

  // 비디오 엘리먼트 감지를 위한 Observer 설정
  setupVideoObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 비디오 엘리먼트 직접 추가 확인
              if (node.tagName === 'VIDEO') {
                this.handleVideoElement(node);
              }
              // 하위 노드에서 비디오 엘리먼트 찾기
              const videos = node.querySelectorAll ? node.querySelectorAll('video') : [];
              videos.forEach(video => this.handleVideoElement(video));
            }
          });
        }
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 비디오 엘리먼트 처리
  handleVideoElement(video) {
    if (this.videoElement === video) return;
    
    console.log('ChzzkMate: 비디오 엘리먼트 감지됨');
    this.videoElement = video;
    
    // 볼륨 설정 적용
    this.applyVolumeSettings();
    
    // 볼륨 변경 이벤트 리스너 추가
    this.setupVolumeListeners();
    
    // UI 추가
    this.addVolumeUI();
  }

  // 저장된 볼륨 설정 적용
  async applyVolumeSettings() {
    if (!this.videoElement || !this.streamerId) return;

    try {
      const result = await chrome.storage.sync.get(['defaultVolume', 'streamerVolumes']);
      const defaultVolume = result.defaultVolume || 0.5;
      const streamerVolumes = result.streamerVolumes || {};
      
      const targetVolume = streamerVolumes[this.streamerId] || defaultVolume;
      
      console.log(`ChzzkMate: 볼륨 적용 - 스트리머: ${this.streamerId}, 볼륨: ${targetVolume}`);
      
      this.videoElement.volume = targetVolume;
      
      // UI 업데이트
      this.updateVolumeUI(targetVolume);
      
    } catch (error) {
      console.error('ChzzkMate: 볼륨 설정 적용 실패:', error);
    }
  }

  // 볼륨 변경 이벤트 리스너 설정
  setupVolumeListeners() {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('volumechange', () => {
      if (this.streamerId) {
        this.saveVolumeSetting(this.videoElement.volume);
      }
    });
  }

  // 볼륨 설정 저장
  async saveVolumeSetting(volume) {
    if (!this.streamerId) return;

    try {
      const result = await chrome.storage.sync.get(['streamerVolumes']);
      const streamerVolumes = result.streamerVolumes || {};
      streamerVolumes[this.streamerId] = volume;
      
      await chrome.storage.sync.set({ streamerVolumes });
      console.log(`ChzzkMate: 볼륨 저장됨 - 스트리머: ${this.streamerId}, 볼륨: ${volume}`);
      
    } catch (error) {
      console.error('ChzzkMate: 볼륨 저장 실패:', error);
    }
  }

  // 볼륨 UI 추가
  addVolumeUI() {
    if (!this.videoElement || this.volumeUI) return;

    // 기존 볼륨 UI 제거
    const existingUI = document.querySelector('.chzzkmate-volume-ui');
    if (existingUI) {
      existingUI.remove();
    }

    // 볼륨 UI 생성
    this.volumeUI = this.createVolumeUI();
    
    // 플레이어 컨트롤 바에 추가
    const playerControls = this.findPlayerControls();
    if (playerControls) {
      playerControls.appendChild(this.volumeUI);
      console.log('ChzzkMate: 볼륨 UI 추가됨');
    }
  }

  // 플레이어 컨트롤 바 찾기
  findPlayerControls() {
    // 치지직 플레이어 컨트롤 바 선택자들 (여러 가능성 시도)
    const selectors = [
      '.video-player-controls',
      '.player-controls',
      '.video-controls',
      '[class*="control"][class*="bar"]',
      '[class*="player"][class*="control"]'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }

    // 비디오 엘리먼트의 부모 컨테이너에서 찾기
    let parent = this.videoElement.parentElement;
    while (parent && parent !== document.body) {
      const controls = parent.querySelector('[class*="control"]');
      if (controls) {
        return controls;
      }
      parent = parent.parentElement;
    }

    // 비디오 엘리먼트 바로 옆에 추가
    return this.videoElement.parentElement;
  }

  // 볼륨 UI 생성
  createVolumeUI() {
    const container = document.createElement('div');
    container.className = 'chzzkmate-volume-ui';
    container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 4px;
      color: white;
      font-size: 12px;
      margin: 4px;
    `;

    // 볼륨 아이콘
    const volumeIcon = document.createElement('span');
    volumeIcon.textContent = '🔊';
    volumeIcon.style.fontSize = '14px';

    // 볼륨 슬라이더
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '1';
    slider.step = '0.01';
    slider.style.width = '80px';
    slider.style.height = '4px';

    // 볼륨 퍼센트 표시
    const volumeText = document.createElement('span');
    volumeText.className = 'chzzkmate-volume-text';
    volumeText.style.minWidth = '35px';
    volumeText.style.textAlign = 'right';

    // 리셋 버튼
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '↺';
    resetBtn.title = '기본 볼륨으로 리셋';
    resetBtn.style.cssText = `
      background: #00FFA3;
      color: black;
      border: none;
      border-radius: 3px;
      padding: 2px 6px;
      font-size: 10px;
      cursor: pointer;
    `;

    // 이벤트 리스너
    slider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.videoElement.volume = volume;
      this.updateVolumeText(volume);
    });

    resetBtn.addEventListener('click', () => {
      this.resetToDefaultVolume();
    });

    container.appendChild(volumeIcon);
    container.appendChild(slider);
    container.appendChild(volumeText);
    container.appendChild(resetBtn);

    this.volumeSlider = slider;
    this.volumeText = volumeText;

    return container;
  }

  // 볼륨 UI 업데이트
  updateVolumeUI(volume) {
    if (this.volumeSlider && this.volumeText) {
      this.volumeSlider.value = volume;
      this.updateVolumeText(volume);
    }
  }

  // 볼륨 텍스트 업데이트
  updateVolumeText(volume) {
    if (this.volumeText) {
      this.volumeText.textContent = `${Math.round(volume * 100)}%`;
    }
  }

  // 기본 볼륨으로 리셋
  async resetToDefaultVolume() {
    if (!this.streamerId) return;

    try {
      const result = await chrome.storage.sync.get(['defaultVolume', 'streamerVolumes']);
      const defaultVolume = result.defaultVolume || 0.5;
      const streamerVolumes = result.streamerVolumes || {};
      
      // 개별 설정 제거
      delete streamerVolumes[this.streamerId];
      await chrome.storage.sync.set({ streamerVolumes });
      
      // 기본 볼륨 적용
      this.videoElement.volume = defaultVolume;
      this.updateVolumeUI(defaultVolume);
      
      console.log(`ChzzkMate: 기본 볼륨으로 리셋됨: ${defaultVolume}`);
      
    } catch (error) {
      console.error('ChzzkMate: 리셋 실패:', error);
    }
  }

  // 비디오 엘리먼트 재확인
  checkForVideo() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (video !== this.videoElement) {
        this.handleVideoElement(video);
      }
    });
  }

  // 정리
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.volumeUI) {
      this.volumeUI.remove();
    }
  }
}

// ChzzkMate 초기화
let chzzkMateController = null;

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    chzzkMateController = new ChzzkMateVolumeController();
  });
} else {
  chzzkMateController = new ChzzkMateVolumeController();
}

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
  if (chzzkMateController) {
    chzzkMateController.destroy();
  }
});

console.log('ChzzkMate: Content script 로드됨');
