// ChzzkMate Popup Script
// 확장프로그램 팝업의 모든 기능을 관리

class ChzzkMatePopup {
  constructor() {
    this.currentStreamerId = null;
    this.savedStreamers = {};
    this.defaultVolume = 0.5;

    this.init();
  }

  // 초기화
  async init() {
    console.log('ChzzkMate Popup: 초기화 시작');

    // 현재 탭에서 스트리머 ID 추출
    await this.extractCurrentStreamerId();

    // 저장된 데이터 로드
    await this.loadStoredData();

    // UI 초기화
    this.initializeUI();

    // 이벤트 리스너 설정
    this.setupEventListeners();

    console.log('ChzzkMate Popup: 초기화 완료');
  }

  // 현재 탭에서 스트리머 ID 추출
  async extractCurrentStreamerId() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('chzzk.naver.com')) {
        const url = new URL(tab.url);
        const match = url.pathname.match(/\/channel\/([^\/\?]+)/);
        if (match) {
          this.currentStreamerId = match[1];
          console.log('ChzzkMate Popup: 현재 스트리머 ID:', this.currentStreamerId);
        }
      }
    } catch (error) {
      console.error('ChzzkMate Popup: 스트리머 ID 추출 실패:', error);
    }
  }

  // 저장된 데이터 로드
  async loadStoredData() {
    try {
      const result = await chrome.storage.sync.get(['defaultVolume', 'savedStreamers']);
      this.defaultVolume = result.defaultVolume;
      this.savedStreamers = result.savedStreamers || {};

      console.log('ChzzkMate Popup: 데이터 로드됨', { defaultVolume: this.defaultVolume, savedStreamers: this.savedStreamers });
    } catch (error) {
      console.error('ChzzkMate Popup: 데이터 로드 실패:', error);
    }
  }

  // UI 초기화
  initializeUI() {
    // 현재 스트리머 섹션 표시/숨김
    const currentStreamerSection = document.getElementById('currentStreamerSection');
    if (this.currentStreamerId) {
      currentStreamerSection.style.display = 'block';
      this.updateCurrentStreamerUI();
    } else {
      currentStreamerSection.style.display = 'none';
    }

    // 기본 볼륨 슬라이더 설정
    const defaultVolumeSlider = document.getElementById('defaultVolumeSlider');
    const defaultVolumeValue = document.getElementById('defaultVolumeValue');
    defaultVolumeSlider.value = this.defaultVolume;
    defaultVolumeValue.textContent = `${Math.round(this.defaultVolume * 100)}%`;

    // 저장된 스트리머 목록 업데이트
    this.updateStreamerList();

  }

  // 현재 스트리머 UI 업데이트
  updateCurrentStreamerUI() {
    const streamerIdElement = document.getElementById('currentStreamerId');
    const volumeSlider = document.getElementById('currentVolumeSlider');
    const volumeValue = document.getElementById('currentVolumeValue');
    const volumeType = document.getElementById('volumeType');

    // 스트리머 ID 표시
    streamerIdElement.textContent = this.currentStreamerId;

    // 볼륨 설정 확인
    const hasIndividualVolume = this.savedStreamers.hasOwnProperty(this.currentStreamerId);
    const currentVolume = hasIndividualVolume ? this.savedStreamers[this.currentStreamerId].volume : this.defaultVolume;

    // 슬라이더 설정
    volumeSlider.value = currentVolume;
    volumeValue.textContent = `${Math.round(currentVolume * 100)}%`;

    // 볼륨 타입 표시
    if (hasIndividualVolume) {
      volumeType.textContent = '개별 설정 사용 중';
      volumeType.style.color = '#00FFA3';
    } else {
      volumeType.textContent = '기본 볼륨 사용 중';
      volumeType.style.color = '#888';
    }
  }

  // 저장된 스트리머 목록 업데이트
  updateStreamerList() {
    const streamerList = document.getElementById('streamerList');
    const streamerEntries = Object.entries(this.savedStreamers);

    if (streamerEntries.length === 0) {
      streamerList.innerHTML = '<div class="no-streamers">저장된 스트리머가 없습니다</div>';
      return;
    }
    const sortedStreamerEntries = streamerEntries.sort((a, b) => b[1].date - a[1].date);
    streamerList.innerHTML = sortedStreamerEntries.map(([streamerId, streamerInfo]) => {
      console.log("Map:", streamerId, streamerInfo)
      return `
        <div class="streamer-item">
          <div class="streamer-avatar">
            <img src="${streamerInfo.streamerAvatar}" alt="${streamerInfo.name}"/>
          </div>
          <div class="streamer-item-info">
            <div class="streamer-item-id">${streamerInfo.name}</div>
            <div class="streamer-item-volume">${Math.round(streamerInfo.volume * 100)}%</div>
          </div>
          <div class="streamer-item-actions">
            <button class="streamer-item-btn delete" data-streamer-id="${streamerId}">삭제</button>
          </div>
        </div>
      `}
    ).join('');

    streamerList.querySelectorAll('.streamer-item-btn.delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const streamerId = btn.getAttribute('data-streamer-id');
        this.deleteStreamerVolume(streamerId);
    })});
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 현재 스트리머 볼륨 슬라이더
    const currentVolumeSlider = document.getElementById('currentVolumeSlider');
    currentVolumeSlider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.updateCurrentStreamerVolume(volume);
    });

    // 기본 볼륨 슬라이더
    const defaultVolumeSlider = document.getElementById('defaultVolumeSlider');
    defaultVolumeSlider.addEventListener('input', (e) => {
      const volume = parseFloat(e.target.value);
      this.updateDefaultVolume(volume);
    });

    // 리셋 버튼
    const resetCurrentBtn = document.getElementById('resetCurrentBtn');
    resetCurrentBtn.addEventListener('click', () => {
      this.resetCurrentStreamerVolume();
    });

    // 액션 버튼들
    const clearAllBtn = document.getElementById('clearAllBtn');
    clearAllBtn.addEventListener('click', () => {
      this.clearAllVolumes();
    });

    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', () => {
      this.refreshData();
    });

    // 링크들
    const githubLink = document.getElementById('githubLink');
    githubLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/GGULBAE/ChzzkMate' });
    });

    const issueLink = document.getElementById('issueLink');
    issueLink.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/GGULBAE/ChzzkMate/issues' });
    });
  }

  // 현재 스트리머 볼륨 업데이트
  async updateCurrentStreamerVolume(volume) {
    if (!this.currentStreamerId) return;

    try {
      // 스토리지 업데이트
      this.savedStreamers[this.currentStreamerId] = volume;
      await chrome.storage.sync.set({ savedStreamers: this.savedStreamers });

      // UI 업데이트
      const volumeValue = document.getElementById('currentVolumeValue');
      const volumeType = document.getElementById('volumeType');

      volumeValue.textContent = `${Math.round(volume * 100)}%`;
      volumeType.textContent = '개별 설정 사용 중';
      volumeType.style.color = '#00FFA3';

      // 현재 탭의 비디오 볼륨도 즉시 변경
      await this.updateCurrentTabVolume(volume);

      console.log(`ChzzkMate Popup: 현재 스트리머 볼륨 업데이트됨: ${volume}`);
    } catch (error) {
      console.error('ChzzkMate Popup: 현재 스트리머 볼륨 업데이트 실패:', error);
    }
  }

  // 기본 볼륨 업데이트
  async updateDefaultVolume(volume) {
    try {
      this.defaultVolume = volume;
      await chrome.storage.sync.set({ defaultVolume: volume });

      const volumeValue = document.getElementById('defaultVolumeValue');
      volumeValue.textContent = `${Math.round(volume * 100)}%`;

      console.log(`ChzzkMate Popup: 기본 볼륨 업데이트됨: ${volume}`);
    } catch (error) {
      console.error('ChzzkMate Popup: 기본 볼륨 업데이트 실패:', error);
    }
  }

  // 현재 탭의 비디오 볼륨 업데이트
  async updateCurrentTabVolume(volume) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('chzzk.naver.com')) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (volume) => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
              videoElement.volume = volume;
            }
          },
          args: [volume]
        });
      }
    } catch (error) {
      console.error('ChzzkMate Popup: 현재 탭 볼륨 업데이트 실패:', error);
    }
  }

  // 현재 스트리머 볼륨 리셋
  async resetCurrentStreamerVolume() {
    if (!this.currentStreamerId) return;

    try {
      // 개별 설정 삭제
      delete this.savedStreamers[this.currentStreamerId];
      await chrome.storage.sync.set({ savedStreamers: this.savedStreamers });

      // UI 업데이트
      this.updateCurrentStreamerUI();
      this.updateStreamerList();

      // 현재 탭의 비디오 볼륨도 기본값으로 변경
      await this.updateCurrentTabVolume(this.defaultVolume);

      console.log('ChzzkMate Popup: 현재 스트리머 볼륨 리셋됨');
    } catch (error) {
      console.error('ChzzkMate Popup: 현재 스트리머 볼륨 리셋 실패:', error);
    }
  }

  // 스트리머 볼륨 편집
  async editStreamerVolume(streamerId) {
    const newVolume = prompt(`${streamerId}의 볼륨을 입력하세요 (0-100):`);
    if (newVolume !== null && !isNaN(newVolume)) {
      const volume = Math.max(0, Math.min(1, parseFloat(newVolume) / 100));
      this.savedStreamers[streamerId] = volume;
      await chrome.storage.sync.set({ savedStreamers: this.savedStreamers });
      this.updateStreamerList();
    }
  }

  // 스트리머 볼륨 삭제
  async deleteStreamerVolume(streamerId) {
    if (confirm(`${streamerId}의 볼륨 설정을 삭제하시겠습니까?`)) {
      delete this.savedStreamers[streamerId];
      await chrome.storage.sync.set({ savedStreamers: this.savedStreamers });
      this.updateStreamerList();
    }
  }

  // 모든 볼륨 설정 삭제
  async clearAllVolumes() {
    if (confirm('모든 볼륨 설정을 삭제하시겠습니까?')) {
      this.savedStreamers = {};
      await chrome.storage.sync.set({ savedStreamers: this.savedStreamers });
      this.updateStreamerList();
      this.updateCurrentStreamerUI();
    }
  }

  // 데이터 새로고침
  async refreshData() {
    await this.loadStoredData();
    this.initializeUI();
    console.log('ChzzkMate Popup: 데이터 새로고침됨');
  }
}

// 전역 변수로 팝업 인스턴스 생성
let popup;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  popup = new ChzzkMatePopup();
});

console.log('ChzzkMate Popup: Script 로드됨');
