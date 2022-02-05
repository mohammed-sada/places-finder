// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchPlaces } from '../../lib/coffee-stores';

export default async function getPlacesByLocation(req, res) {
  try {
    const { latLong, query, limit } = req.query;
    const places = await fetchPlaces(latLong, query, limit);

    res.status(200).json({
      data: places
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error
    });
  }
}
