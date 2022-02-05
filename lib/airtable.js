import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY);
const coffeeStoresTable = base('coffee-stores');

function minifyRecord(record) {
    return { recordId: record.id, ...record.fields };
}

async function findRecordById(id) {
    const foundRecords = await coffeeStoresTable.select({ filterByFormula: `id='${id}'` }).firstPage();
    if (foundRecords.length !== 0) {
        const record = foundRecords[0];
        return minifyRecord(record); // send the first record and minify it
    }
    return false;
}
export {
    base,
    coffeeStoresTable,
    minifyRecord,
    findRecordById
};