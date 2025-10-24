// ===========================================================
// ChzzkMate Content Script (SPA-safe)
// ===========================================================

// ✅ 1. 클래스 중복 선언 방지
if (!window.ChzzkMate) {
  class ChzzkMate {
    constructor() {
      this.videoElement = null;
      this.volumeElement = null;
      this.volumeSetting = { defaultVolume: 0, savedVolumes: 0 };
      this.streamerId = "";
      this.streamerName = "";
      this.streamerAvatar = "";
      this.saveButton = null;

      this.init();
    }

    async init() {
      console.log('ChzzkMate: 초기화 시작');

      this.videoElement = await this.findVideoElement(); 
      this.volumeElement = await this.findVolumeElement();

      this.streamerId = this.getStreamerId();
      this.streamerName = this.getStreamerName();
      this.streamerAvatar = this.getStreamerAvatar();
      this.volumeSetting = await this.loadVolumeSetting();

      this.setVolume();
      this.addSaveButton();

      console.log('ChzzkMate: 초기화 완료');
    }

    getStreamerId() {
      const url = window.location.href;
      const match = url.match(/\/live\/([^\/\?]+)/);
      return match ? match[1] : null;
    }

    getStreamerName() {
      const videoInfoContainers = document.querySelectorAll('div[class^="video_information_container"]');
      if (videoInfoContainers.length < 2) return '';
      const streamerInfo = videoInfoContainers[1];
      const nameEl = streamerInfo.querySelector('span[class^="name_text__"]');
      return nameEl ? nameEl.textContent : '';
    }

    getStreamerAvatar() {
      const videoInfoContainers = document.querySelectorAll('div[class^="video_information_container"]');
      
      if (videoInfoContainers.length < 2) return '';
      const streamerInfo = videoInfoContainers[1];
      const avatar = streamerInfo.querySelector("img").src
      
      return avatar ? avatar : '';
    }

    async findVideoElement() {
      let video = document.querySelector('video');
      while (!video) {
        await new Promise(r => setTimeout(r, 500));
        video = document.querySelector('video');
      }
      return video;
    }

    async findVolumeElement() {
      let volume = document.querySelector('.pzp-pc__volume-control');
      while (!volume) {
        await new Promise(r => setTimeout(r, 500));
        volume = document.querySelector('.pzp-pc__volume-control');
      }
      return volume;
    }

    async loadVolumeSetting() {
      const result = await chrome.storage.sync.get(['defaultVolume', 'savedStreamers']);
      const defaultVolume = result.defaultVolume;
      const has = result.savedStreamers && Object.keys(result.savedStreamers).includes(this.streamerId);
      const streamerVolumes = has ? result.savedStreamers[this.streamerId].volume : null;
      return { defaultVolume, streamerVolumes };
    }

    setVolume() {
      const volume = this.volumeSetting.streamerVolumes ?? this.volumeSetting.defaultVolume;
      this.videoElement.volume = volume;
      console.log('ChzzkMate: 볼륨 설정 완료', volume);
    }

    async saveVolumeSetting(volume) {
      if (!this.streamerId) return;
      try {
        const result = await chrome.storage.sync.get(['savedStreamers']);
        const savedStreamers = result.savedStreamers || {};
        savedStreamers[this.streamerId] = {
          volume,
          name: this.streamerName,
          streamerId: this.streamerId,
          streamerAvatar: this.streamerAvatar,
          date: Date.now().toString()
        };
        await chrome.storage.sync.set({ savedStreamers });
        console.log(`볼륨 저장됨: ${this.streamerId} (${volume})`);
      } catch (err) {
        console.error('볼륨 저장 실패:', err);
      }
    }

    addSaveButton() {
      if (this.saveButton) return;
      const volumeControl = document.querySelector('.pzp-pc__volume-control');
      if (!volumeControl) return;

      this.saveButton = document.createElement('div');
      this.saveButton.className = 'chzzkmate-save-button';
      
      const icon = document.createElement('img');
      const defaultSrc = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zYXZlLWljb24gbHVjaWRlLXNhdmUiPjxwYXRoIGQ9Ik0xNS4yIDNhMiAyIDAgMCAxIDEuNC42bDMuOCAzLjhhMiAyIDAgMCAxIC42IDEuNFYxOWEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMlY1YTIgMiAwIDAgMSAyLTJ6Ii8+PHBhdGggZD0iTTE3IDIxdi03YTEgMSAwIDAgMC0xLTFIOGExIDEgMCAwIDAtMSAxdjciLz48cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3Ii8+PC9zdmc+";

      icon.style.width = '18px';
      icon.style.height = '18px';
      icon.alt = "현재 볼륨 저장";
      icon.src = defaultSrc
      
      this.saveButton.appendChild(icon);
      
      this.saveButton.title = '현재 볼륨 저장';
      Object.assign(this.saveButton.style, {
        color: '#000',
        border: 'none',
        borderRadius: '3px',
        padding: '4px 8px',
        fontSize: '12px',
        cursor: 'pointer',
        marginLeft: '8px'
      });

      this.saveButton.addEventListener('click', () => this.saveCurrentVolume());
      volumeControl.appendChild(this.saveButton);
      console.log('저장 버튼 추가됨');
    }

    async saveCurrentVolume() {
      const volume = this.videoElement.volume;
      await this.saveVolumeSetting(volume);
      this.showToast(`볼륨 ${Math.round(volume * 100)}% 저장됨!`, 'success');
    }

    showToast(message, type = 'info') {
      const existing = document.querySelector('.chzzkmate-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'chzzkmate-toast';
      toast.textContent = message;

      const styles = {
        success: { background: '#00FFA3', color: '#000' },
        error: { background: '#ff4444', color: '#fff' },
        info: { background: '#333', color: '#fff' }
      };

      Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        borderRadius: '6px',
        padding: '10px 14px',
        fontSize: '14px',
        zIndex: '99999',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        ...styles[type]
      });

      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
  }

  window.ChzzkMate = ChzzkMate;
}

// ✅ 2. SPA 라우팅 감시 (URL이 바뀌면 인스턴스 다시 생성)
if (!window.__chzzkMateObserverInitialized) {
  window.__chzzkMateObserverInitialized = true;

  let lastUrl = location.href;
  let instance = null;

  function run() {
    if (instance) {
      console.log('ChzzkMate: 이전 인스턴스 정리');
      instance = null;
    }
    console.log('ChzzkMate: 새 인스턴스 실행');
    instance = new window.ChzzkMate();
  }

  // 최초 실행
  run();

  // MutationObserver로 SPA URL 변화 감지
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      console.log('ChzzkMate: URL 변경 감지됨', lastUrl);
      run();
    }
  }).observe(document, { subtree: true, childList: true });
}