import { coffeeStoresTable, findRecordById, minifyRecord } from '../../lib/airtable';

export default async function favouriteCoffeeStore(req, res) {
    if (req.method !== 'PUT') return res.status(400).json({
        data: null,
        error: 'this is a put route'
    });

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

        // update voting record
        let updatedRecord = await coffeeStoresTable.update(record.recordId, {
            voting: +(record.voting + 1)
        });
        updatedRecord = minifyRecord(updatedRecord);

        return res.status(200).json({
            data: updatedRecord
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: null,
            error
        });
    }
}
