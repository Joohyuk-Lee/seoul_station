import React, { useState, useEffect } from 'react';
import { 
  Menu, Car, Navigation, Clock, Calendar, Train, ChevronRight, CreditCard, MapPin 
} from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // 1. 상태 관리 (날짜 및 역 코드)
  const [arrivalDate, setArrivalDate] = useState("");
  const [startCity, setStartCity] = useState(""); // 상행 출발지 ID
  const [departureDate, setDepartureDate] = useState("");
  const [endCity, setEndCity] = useState("");   // 하행 도착지 ID

  const [arrivalTrains, setArrivalTrains] = useState([]);
  const [departureTrains, setDepartureTrains] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);

  // 공통 기차 데이터 가져오기 함수
  const fetchTrains = async (date, depId, arrId, setterFunc) => {
    if (!date || !depId || !arrId) return;
    const formattedDate = date.replace(/-/g, "");
    try {
      // 통합된 백엔드 주소 사용
      const response = await fetch(`http://localhost:80/api/trains?date=${formattedDate}&depPlaceId=${depId}&arrPlaceId=${arrId}`);
      const data = await response.json();
      setterFunc(Array.isArray(data) ? data : [data]);
      
      // 하행선까지 조회가 되면 차량 목록 활성화 (예시 시나리오)
      if (arrId !== 'NODE0000000001') {
        setAvailableCars([
          { id: 1, name: '더 뉴 아반떼', type: '준중형', price: '45,600', img: '🚗' },
          { id: 2, name: '아이오닉 5', type: '전기차', price: '62,000', img: '⚡' },
          { id: 3, name: '더 뉴 셀토스', type: '소형 SUV', price: '51,200', img: '🚙' },
        ]);
      }
    } catch (error) {
      console.error("열차 로드 에러:", error);
    }
  };

  // 상행: 선택도시 -> 서울역(NODE0000000001)
  useEffect(() => { 
    fetchTrains(arrivalDate, startCity, 'NODE0000000001', setArrivalTrains); 
  }, [arrivalDate, startCity]);

  // 하행: 서울역(NODE0000000001) -> 선택도시
  useEffect(() => { 
    fetchTrains(departureDate, 'NODE0000000001', endCity, setDepartureTrains); 
  }, [departureDate, endCity]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* ======= Header ======= */}
      <header className="fixed top-0 w-full bg-white border-b h-16 flex items-center px-4 z-50 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Menu className="cursor-pointer text-gray-600" onClick={() => setSidebarOpen(!isSidebarOpen)} />
          <div className="flex items-center gap-2">
            <Car className="text-blue-600 w-8 h-8" />
            <span className="text-xl font-bold text-gray-800 tracking-tight">서울역 쏘카 커넥트</span>
          </div>
        </div>
      </header>

      {/* ======= Main Content ======= */}
      <main className="mt-16 flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
        
        {/* [왼쪽] 기차 시간표 섹션 (2분할) */}
        <div className="w-full md:w-3/5 flex border-r bg-white overflow-hidden">
          
          {/* 상행 (서울행) */}
          <div className="w-1/2 p-6 border-r flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-blue-700 font-bold border-b pb-2">
              <Train className="w-5 h-5" /> <span>1. 서울역 도착 (상행)</span>
            </div>
            <div className="space-y-4 mb-6">
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block">도착 일자</label>
                <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
                       onChange={(e) => setArrivalDate(e.target.value)} />
              </div>
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block">출발지(지방역)</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" 
                        onChange={(e) => setStartCity(e.target.value)}>
                  <option value="">출발지 선택</option>
                  <option value="NODE0000000011">부산역</option>
                  <option value="NODE0000000012">대전역</option>
                  <option value="NODE0000000002">동대구역</option>
                  <option value="NODE0000000020">광주송정역</option>
                  <option value="NODE0000000570">포항역</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {arrivalTrains.length > 0 ? arrivalTrains.map((train, i) => (
                <div key={i} className="p-4 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition shadow-sm">
                  <p className="text-[10px] font-bold text-blue-500 mb-1">{train.traingradename} {train.trainno}</p>
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-black text-gray-800">
                      {train.arrtime?.toString().substring(8, 10)}:{train.arrtime?.toString().substring(10, 12)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">서울역 도착예정</span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 italic">
                   <Calendar size={32} className="mb-2 opacity-20" />
                   <p className="text-sm text-center px-4">서울로 오는 기차표를<br/>선택해 주세요</p>
                </div>
              )}
            </div>
          </div>

          {/* 하행 (지방행) */}
          <div className="w-1/2 p-6 flex flex-col bg-gray-50/40">
            <div className="flex items-center gap-2 mb-6 text-gray-700 font-bold border-b pb-2">
              <Navigation className="w-5 h-5" /> <span>2. 서울역 출발 (하행)</span>
            </div>
            <div className="space-y-4 mb-6">
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block">출발 일자</label>
                <input type="date" className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 outline-none transition" 
                       onChange={(e) => setDepartureDate(e.target.value)} />
              </div>
              <div className="group">
                <label className="text-[10px] text-gray-400 font-bold ml-1 mb-1 block">도착지(지방역)</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 outline-none transition" 
                        onChange={(e) => setEndCity(e.target.value)}>
                  <option value="">도착지 선택</option>
                  <option value="NODE0000000011">부산역</option>
                  <option value="NODE0000000012">대전역</option>
                  <option value="NODE0000000002">동대구역</option>
                  <option value="NODE0000000020">광주송정역</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {departureTrains.length > 0 ? departureTrains.map((train, i) => (
                <div key={i} className="p-4 border border-white bg-white rounded-xl hover:bg-gray-100 hover:border-gray-200 cursor-pointer transition shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 mb-1">{train.traingradename} {train.trainno}</p>
                  <div className="flex justify-between items-end">
                    <span className="text-xl font-black text-gray-800">
                      {train.depplandtime?.toString().substring(8, 10)}:{train.depplandtime?.toString().substring(10, 12)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">서울역 출발예정</span>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 py-20 italic">
                   <p className="text-sm text-center px-4">지방으로 떠나는 기차표를<br/>선택해 주세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* [오른쪽] 차량 목록 섹션 */}
        <div className="w-full md:w-2/5 p-8 bg-white overflow-y-auto shadow-2xl z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              서울역 도착 즉시<br/>이용 가능한 쏘카
            </h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600 font-bold">
              <MapPin size={14} /> <span>공항철도 15번 출구 노외주차장</span>
            </div>
          </div>

          {availableCars.length > 0 ? (
            <div className="grid gap-4">
              {availableCars.map(car => (
                <div key={car.id} className="group border border-gray-100 rounded-2xl p-5 flex items-center justify-between hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {car.img}
                    </div>
                    <div>
                      <p className="text-[11px] text-blue-500 font-bold">{car.type}</p>
                      <h4 className="font-bold text-gray-800 text-lg">{car.name}</h4>
                      <p className="text-gray-400 text-xs italic">대기 중인 차량 3대</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{car.price}원</p>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-[11px] font-extrabold group-hover:bg-blue-700 transition shadow-md shadow-blue-100">
                      지금 예약
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-[11px] text-gray-500 text-center leading-relaxed font-medium">
                  * 쏘카 이용 시간은 기차 도착 시간부터<br/>다음 기차 출발 30분 전까지로 자동 권장됩니다.
                </p>
              </div>
          </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 text-center p-8">
              <Car size={48} className="mb-4 opacity-10" />
              <p className="font-medium text-sm leading-relaxed">
                기차 일정을 모두 선택하시면<br/>가장 가까운 쏘카를 추천해 드립니다.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ======= Footer ======= */}
      <footer className="h-16 bg-white border-t flex items-center justify-center text-[10px] text-gray-400 tracking-widest uppercase">
        &copy; 2026 SOCAR Seoul Station Project. Mobility Innovation.
      </footer>
    </div>
  );
};

export default App;