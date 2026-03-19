export default async function handler(req, res) {
    const {origin, destination} = req.query;
    const REST_API_KEY = process.env.KAKAO_REST_KEY;

    try {
        const response = await fetch(
        `https://apis-navi.kakaomobility.com/v1/directions?origin=${origin}&destination=${destination}`,
        {
            headers: {
            Authorization: `KakaoAK ${REST_API_KEY}`,
            'Content-Type': 'application/json'
            }
        }
        );

        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*'); // CORS 에러 방지를 위한 헤더 설정
        res.status(200).json(data);
    }
    catch(error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
}

