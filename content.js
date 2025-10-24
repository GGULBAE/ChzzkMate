// ChzzkMate Content Script
// 치지직 페이지에서 볼륨 저장 버튼 추가

class ChzzkMate {
  constructor() {
    this.videoElement = null;
    this.streamerId = this.getStreamerId();
    this.saveButton = null;
    this.init();
  }

  init() {
    console.log('ChzzkMate: 초기화 시작');
    
    // 비디오 엘리먼트 찾기
    this.findVideoElement();
    
    // 볼륨 설정 로드
    this.loadVolumeSetting();
    
    // 저장 버튼 추가
    this.addSaveButton();
    
    // 볼륨 변경 이벤트 리스너
    this.setupVolumeListener();
  }

  // 스트리머 ID 추출
  getStreamerId() {
    const url = window.location.href;
    const match = url.match(/\/live\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  // 비디오 엘리먼트 찾기
  findVideoElement() {
    this.videoElement = document.querySelector('video');
    if (this.videoElement) {
      console.log('ChzzkMate: 비디오 엘리먼트 발견');
    } else {
      console.log('ChzzkMate: 비디오 엘리먼트를 찾을 수 없습니다.');
    }
  }

  // 볼륨 설정 로드
  async loadVolumeSetting() {
    if (!this.streamerId || !this.videoElement) return;

    try {
      const result = await chrome.storage.sync.get([this.streamerId]);
      const savedVolume = result[this.streamerId];
      
      if (savedVolume !== undefined) {
        this.videoElement.volume = savedVolume;
        console.log(`ChzzkMate: 저장된 볼륨 로드됨 - ${savedVolume}`);
      } else {
        // 기본 볼륨 설정
        this.videoElement.volume = 0.5;
        console.log('ChzzkMate: 기본 볼륨 설정됨 - 0.5');
      }
    } catch (error) {
      console.error('ChzzkMate: 볼륨 설정 로드 실패:', error);
    }
  }

  // 볼륨 변경 이벤트 리스너
  setupVolumeListener() {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('volumechange', () => {
      if (this.videoElement.volume !== undefined) {
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

  // 저장 버튼 추가 (pzp-pc__volume-control에 추가)
  addSaveButton() {
    if (this.saveButton) return;

    // pzp-pc__volume-control 찾기
    const volumeControl = document.querySelector('.pzp-pc__volume-control');
    if (!volumeControl) {
      console.log('ChzzkMate: pzp-pc__volume-control을 찾을 수 없습니다.');
      return;
    }

    // 기존 저장 버튼 제거
    const existingSaveButton = document.querySelector('.chzzkmate-save-button');
    if (existingSaveButton) {
      existingSaveButton.remove();
    }

    // 저장 버튼 생성
    this.saveButton = this.createSaveButton();
    
    // volume-control에 저장 버튼 추가
    volumeControl.appendChild(this.saveButton);
    console.log('ChzzkMate: 저장 버튼 추가됨');
  }

  // 저장 버튼 생성
  createSaveButton() {
    const saveButton = document.createElement('button');
    saveButton.className = 'chzzkmate-save-button';
    saveButton.textContent = '💾';
    saveButton.title = '현재 볼륨을 이 스트리머에게 저장';
    saveButton.style.cssText = `
      background: #00FFA3;
      color: black;
      border: none;
      border-radius: 3px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      margin-left: 8px;
      transition: background 0.2s;
    `;

    // 호버 효과
    saveButton.addEventListener('mouseenter', () => {
      saveButton.style.background = '#00e68a';
    });
    
    saveButton.addEventListener('mouseleave', () => {
      saveButton.style.background = '#00FFA3';
    });

    // 클릭 이벤트
    saveButton.addEventListener('click', () => {
      this.saveCurrentVolume();
    });

    return saveButton;
  }

  // 현재 볼륨 저장 (저장 버튼용)
  async saveCurrentVolume() {
    if (!this.streamerId) return;

    try {
      const currentVolume = this.videoElement.volume;
      const result = await chrome.storage.sync.get(['streamerVolumes']);
      const streamerVolumes = result.streamerVolumes || {};
      streamerVolumes[this.streamerId] = currentVolume;
      
      await chrome.storage.sync.set({ streamerVolumes });
      console.log(`ChzzkMate: 볼륨 저장됨 - 스트리머: ${this.streamerId}, 볼륨: ${currentVolume}`);
      
      // 토스트 알림 표시
      this.showToast(`볼륨 ${Math.round(currentVolume * 100)}% 저장됨!`, 'success');
      
    } catch (error) {
      console.error('ChzzkMate: 볼륨 저장 실패:', error);
      this.showToast('저장 실패', 'error');
    }
  }

  // 토스트 알림 표시
  showToast(message, type = 'info') {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.chzzkmate-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'chzzkmate-toast';
    toast.textContent = message;
    
    // 타입별 스타일
    const styles = {
      success: {
        background: '#00FFA3',
        color: '#000',
        border: '1px solid #00e68a'
      },
      error: {
        background: '#ff4444',
        color: '#fff',
        border: '1px solid #ff6666'
      },
      info: {
        background: '#333',
        color: '#fff',
        border: '1px solid #555'
      }
    };

    const style = styles[type] || styles.info;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${style.background};
      color: ${style.color};
      border: ${style.border};
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // 애니메이션
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);

    // 3초 후 자동 제거
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }
}

// 페이지 로드 시 ChzzkMate 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ChzzkMate();
  });
} else {
  new ChzzkMate();
}
