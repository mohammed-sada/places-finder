import { coffeeStoresTable, findRecordById, minifyRecord } from '../../lib/airtable';


export default async function createCoffeeStore(req, res) {
    // => search coffeeStore in db, 
    // => if found, done send it
    // => else if not found, create it and send it

    if (req.method !== 'POST') return res.status(400).json({
        data: null,
        error: 'this is a post route'
    });

    try {
        const { id, name, address, street, voting, imgUrl } = req.body;

        if (!id) return res.status(400).json({
            data: null,
            error: 'id is missing'
        });

        // search for the record

        const record = await findRecordById(id);
        if (record) {
            return res.status(200).json({
                data: record
            });
        } else {
            // create the record

            if (!name) return res.status(400).json({
                data: null,
                error: 'name is missing'
            });

            if (voting && isNaN(voting)) {
                return res.status(400).json({
                    data: null,
                    error: 'voting must be a number'
                });
            }

            let createdRecord = await coffeeStoresTable.create({
                id,
                name,
                address,
                street,
                voting: +voting,
                imgUrl: `{"small":"${imgUrl.small}","regular":"${imgUrl.regular}"}`
            });

            createdRecord = minifyRecord(createdRecord);
            return res.status(200).json({
                data: createdRecord
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: null,
            error
        });
    }

}