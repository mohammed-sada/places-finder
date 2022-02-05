export function isEmpty(object) {
    return object ? Object.keys(object).length === 0 : null; // Boolean
}

export function fetcher(...args) {
    return fetch(...args).then(res => res.json());
}
