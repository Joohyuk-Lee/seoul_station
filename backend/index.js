const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 80;

app.use(cors());

// [중요] 공공데이터포털에서 발급받은 '일반 인증키(Decoding)'를 여기에 넣으세요.
// 인증키 앞뒤에 공백이 포함되지 않도록 주의하세요!
const SERVICE_KEY = 'nRptTdHrhNq1HmWUUpNctvlqessYds1XYra5m0KBwLiLHI8yJtKj5QzyYGc+ngYdEw4HgPm9CoMq0T1ab9fi5A=='; 

// // 공통 API 호출 주소
//const BASE_URL = 'http://apis.data.go.kr/1613000/TrainAtrtInfoService/getStrtpntAlocSttnTrainArvlInfo';

// TAGO 열차정보 서비스 기본 URL
const BASE_URL = 'http://apis.data.go.kr/1613000/TrainAtrtInfoService/getStrtpntAlocFndTrainInfo';

// // 1. [상행] 서울역 도착 열차 정보 API
// app.get('/api/arrival', async (req, res) => {
//     try {
//         const { date, depPlaceId } = req.query;
        
//         // URL 직접 구성 (인증키 특수문자 깨짐 방지)
//         const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&depPlaceId=${depPlaceId}&arrPlaceId=NODE0000000001&depPlandTime=${date}&_type=json&numOfRows=50`;

//         console.log("🚀 [상행] 요청 URL:", url);

//         const response = await axios.get(url);
        
//         // 공공데이터 응답 구조 체크
//         const header = response.data.response?.header;
//         if (header && header.resultCode !== '00') {
//             console.error("❌ 공공데이터 API 에러:", header.resultMsg);
//             return res.status(500).json({ error: header.resultMsg });
//         }

//         const items = response.data.response?.body?.items?.item || [];
//         // 데이터가 단일 객체일 경우 배열로 변환하여 전달
//         res.json(Array.isArray(items) ? items : [items]);

//     } catch (error) {
//         console.error("❌ 서버 내부 에러 (Arrival):", error.message);
//         res.status(500).json({ error: '데이터 로드 실패', details: error.message });
//     }
// });

// // 2. [하행] 서울역 출발 열차 정보 API
// app.get('/api/departure', async (req, res) => {
//     try {
//         const { date, arrPlaceId } = req.query;
        
//         // 출발역을 서울역(NODE0000000001)으로 고정
//         const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&depPlaceId=NODE0000000001&arrPlaceId=${arrPlaceId}&depPlandTime=${date}&_type=json&numOfRows=50`;

//         console.log("🚀 [하행] 요청 URL:", url);

//         const response = await axios.get(url);

//         const header = response.data.response?.header;
//         if (header && header.resultCode !== '00') {
//             console.error("❌ 공공데이터 API 에러:", header.resultMsg);
//             return res.status(500).json({ error: header.resultMsg });
//         }

//         const items = response.data.response?.body?.items?.item || [];
//         res.json(Array.isArray(items) ? items : [items]);

//     } catch (error) {
//         console.error("❌ 서버 내부 에러 (Departure):", error.message);
//         res.status(500).json({ error: '데이터 로드 실패', details: error.message });
//     }
// });


// app.get('/api/trains', async (req, res) => {
//     try {
//         const { date, depPlaceId, arrPlaceId } = req.query;

//         // 메타데이터 규격에 맞춘 파라미터 구성
//         //const url = `${BASE_URL}?serviceKey=${SERVICE_KEY}&depPlaceId=${depPlaceId}&arrPlaceId=${arrPlaceId}&depPlandTime=${date}&_type=json&numOfRows=50`;
//         // 수정 코드: encodeURIComponent로 키를 감싸줍니다.
//         const url = `${BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}&depPlaceId=${depPlaceId}&arrPlaceId=${arrPlaceId}&depPlandTime=${date}&_type=json&numOfRows=50`;

//         console.log("🚀 [TAGO API 요청]:", url);

//         const response = await axios.get(url);

//         // 공공데이터 특유의 에러 핸들링
//         const result = response.data.response;
//         if (result?.header?.resultCode !== '00') {
//             console.error("❌ API 서버 응답 에러:", result?.header?.resultMsg);
//             return res.status(500).json({ error: result?.header?.resultMsg });
//         }

//         const items = result?.body?.items?.item || [];
//         res.json(Array.isArray(items) ? items : [items]);

//     } catch (error) {
//         console.error("❌ 백엔드 내부 에러:", error.message);
//         res.status(500).json({ error: '열차 정보를 불러오지 못했습니다.', details: error.message });
//     }
// });

// backend/index.js (에러 발생 시 가짜 데이터 전송 버전)

app.get('/api/trains', async (req, res) => {
    try {
        const { date, depPlaceId, arrPlaceId } = req.query;
        const encodedKey = encodeURIComponent(SERVICE_KEY);
        const url = `${BASE_URL}?serviceKey=${encodedKey}&depPlaceId=${depPlaceId}&arrPlaceId=${arrPlaceId}&depPlandTime=${date}&_type=json&numOfRows=50`;

        console.log("🚀 [TAGO API 요청 중...]:", url);

        const response = await axios.get(url);
        
        const result = response.data.response;
        if (result?.header?.resultCode !== '00') {
            throw new Error(result?.header?.resultMsg || "API 응답 에러");
        }

        const items = result?.body?.items?.item || [];
        res.json(Array.isArray(items) ? items : [items]);

    } catch (error) {
        console.error("⚠️ API 호출 실패 (인증키 활성화 대기 중 가능성). 가짜 데이터를 전송합니다.");
        
        // 실제 API 응답과 똑같은 형식의 가짜 데이터
        const mockData = [
            { traingradename: 'KTX', trainno: '012', arrtime: '20260330103000', depplandtime: '20260330103000' },
            { traingradename: 'SRT', trainno: '342', arrtime: '20260330121500', depplandtime: '20260330121500' },
            { traingradename: 'KTX-산천', trainno: '045', arrtime: '20260330154000', depplandtime: '20260330154000' }
        ];
        
        res.json(mockData); 
    }
});


app.listen(PORT, () => {
    console.log(`✅ TAGO 열차정보 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

// app.listen(PORT, () => {
//     console.log(`
//     ====================================================
//     ✅ SOCAR Project Backend Server가 시작되었습니다.
//     🚀 포트 번호: ${PORT}
//     📅 현재 시각: ${new Date().toLocaleString()}
//     ====================================================
//     `);
// });
