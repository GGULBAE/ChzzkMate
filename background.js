// ChzzkMate Background Service Worker
// 확장프로그램 설치 시 초기화 및 기본 설정

chrome.runtime.onInstalled.addListener((details) => {
  console.log('ChzzkMate 확장프로그램이 설치되었습니다.');
  
  // 기본 볼륨 설정 초기화 (0.5 = 50%)
  chrome.storage.sync.get(['defaultVolume'], (result) => {
    if (result.defaultVolume === undefined) {
      chrome.storage.sync.set({ defaultVolume: 0.5 });
    }
  });
});

// 확장프로그램 아이콘 클릭 시 현재 탭 정보 확인
chrome.action.onClicked.addListener((tab) => {
  // 팝업이 열리므로 별도 처리 불필요
  console.log('ChzzkMate 아이콘 클릭됨');
});

// 스토리지 변경 감지 (디버깅용)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.log('ChzzkMate 스토리지 변경됨:', changes);
  }
});

let lastUrl = "";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url !== lastUrl) {
    lastUrl = changeInfo.url;
    if (changeInfo.url.includes("chzzk.naver.com")) {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      });
    }
  }
});