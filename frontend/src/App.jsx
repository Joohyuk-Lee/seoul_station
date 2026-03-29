import React, { useState, useEffect } from 'react';
import { Search, Menu, MapPin, Car, Navigation, Clock, CreditCard } from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [taxiPrice, setTaxiPrice] = useState(25000);
  const [socarPrice, setSocarPrice] = useState(12000);
  
  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");

  // 쏘카 서울역 공항철도 노외주차장 위치 (정확한 좌표 적용)
  const SOCAR_ZONE = { lat: 37.553321, lng: 126.969948 };

  // 컴포넌트가 마운트될 때 카카오맵 초기화
useEffect(() => {
    // 1. 카카오 객체가 있는지 확인하는 함수
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById('kakao-map');
        const options = {
          center: new window.kakao.maps.LatLng(SOCAR_ZONE.lat, SOCAR_ZONE.lng),
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(SOCAR_ZONE.lat, SOCAR_ZONE.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:12px;color:blue;font-weight:bold;">쏘카 서울역 노외주차장</div>'
        });
        infowindow.open(map, marker);
      }
    };

    // 2. 만약 아직 로드가 안 됐다면 로드될 때까지 기다림
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      // 스크립트가 로드될 때까지 0.1초마다 체크 (간단한 방법)
      const timer = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          initMap();
          clearInterval(timer);
        }
      }, 100);
    }
  }, []);

  // 검색 실행 함수 (백엔드 연결용)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return alert("목적지를 입력해주세요.");

    console.log("검색어:", searchQuery);
    
    try {
      // 실제 백엔드 주소가 생기면 아래 주석을 해제하고 연결하세요
      // const response = await fetch(`http://localhost:80/api/v1/search?query=${searchQuery}`);
      // const data = await response.json();
      // console.log("결과:", data);
      
      alert(`'${searchQuery}'까지의 예상 요금을 백엔드에서 불러옵니다.`);
    } catch (error) {
      console.error("데이터 통신 오류:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ======= Header ======= */}
      <header className="fixed top-0 w-full bg-white border-b h-16 flex items-center px-4 z-50 justify-between">
        <div className="flex items-center gap-4">
          <Menu 
            className="cursor-pointer text-gray-600" 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
          />
          <div className="flex items-center gap-2">
            <Car className="text-blue-600 w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">서울역 쏘카존</span>
          </div>
        </div>

        {/* 검색바 영역 */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="목적지를 입력해 보세요" 
              className="w-full border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit">
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 cursor-pointer hover:text-blue-500" />
            </button>
          </form>
        </div>

        <div className="flex gap-2">
          <button className="text-sm text-gray-600 px-3">로그인</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">회원가입</button>
        </div>
      </header>

      {/* ======= Sidebar Overlay ======= */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ======= Sidebar ======= */}
      <aside className={`fixed left-0 top-16 h-full bg-white w-64 shadow-xl z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="p-4">
          <ul className="space-y-4">
            <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Navigation className="w-5 h-5" /> <span>예약 확인</span>
            </li>
            <li className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <CreditCard className="w-5 h-5" /> <span>이용 요금</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ======= Main Content ======= */}
      <main className="mt-16 flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left: Map Section */}
        <div className="flex-1 bg-gray-200 relative">
           <div id="kakao-map" className="w-full h-full">
              {/* 여기에 카카오 지도가 렌더링됩니다 */}
           </div>
        </div>

        {/* Right: Promotion & Price Comparison */}
        <div className="w-full md:w-[450px] p-8 bg-white shadow-inner overflow-y-auto">
          <div className="mb-8">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">HOT TIP</span>
            <h2 className="text-2xl font-black mt-2 leading-tight">
              택시보다 가까운 쏘카,<br/> 서울역 공항철도 노외주차장!
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              긴 택시 줄에서 기다리지 마세요. <br/>
              공항철도 출구 바로 앞, <strong className="text-blue-600">노외주차장 쏘카존</strong>은 
              캐리어 끌고 이동하기 가장 편한 위치에 있습니다.
            </p>
          </div>

          {/* Price Calculator UI */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> 목적지별 예상 비용
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">일반 택시 이용 시</span>
                <span className="font-medium line-through text-red-400">{taxiPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">쏘카 이용 시</span>
                <span className="text-2xl font-extrabold text-blue-600">{socarPrice.toLocaleString()}원~</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">* 서울역 출발 기준 (유류비/보험료 별도)</p>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-6 hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              지금 바로 예약하기
            </button>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded-lg"><Navigation className="w-5 h-5 text-green-600"/></div>
              <div>
                <h4 className="font-bold">압도적 접근성</h4>
                <p className="text-sm text-gray-500">공항철도 15번 출구 도보 1분 거리</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-orange-100 p-2 rounded-lg"><Car className="w-5 h-5 text-orange-600"/></div>
              <div>
                <h4 className="font-bold">다양한 차종</h4>
                <p className="text-sm text-gray-500">경차부터 대형 SUV까지 50대 이상 상시 대기</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-6 text-center text-xs text-gray-400">
        &copy; 2024 SOCAR Seoul Station Project. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;