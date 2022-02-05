import { findRecordById } from '../../lib/airtable';

export default async function getCoffeeStoreById(req, res) {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({
            data: null,
            error: 'id is missing'
        });

        const record = await findRecordById(id);
        if (!record) return res.status(404).json({
            data: null,
            error: 'record not found'
        });

        return res.status(200).json({
            data: record
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: null,
            error
        });
    }
}
