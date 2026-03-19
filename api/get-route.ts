import type {VercelRequest, VercelResponse} from '@vercel/node';

export default async function handler(req:VercelRequest, res:VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const {origin, destination} = req.query as {origin:string; destination:string};
    const REST_API_KEY = process.env.KAKAO_REST_KEY;

    if (!origin || !destination) {
        return res.status(400).json({error: '출발지와 목적지가 필요합니다.'});
    }

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
        return res.status(200).json(data);
    }
    catch(error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
}