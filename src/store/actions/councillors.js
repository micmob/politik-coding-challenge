import { ActionTypes } from './action-types';

// gets the html document for a given url
const getDoc = async url => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error fetching ${url}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return doc;
};

// gets the data from the html table for a given page
const getData = async (i, categories, tableName) => {
    try {
        const doc = await getDoc(
            `https://guarded-beyond-25903.herokuapp.com/http://ws-old.parlament.ch/${tableName}?pageNumber=${i}`
        );
        const table = getTable(doc);

        const data = [];

        for (let elem of table.getElementsByTagName('tr')) {
            const obj = {};
            let index = 0;
            for (let child of elem.children) {
                if (!child.children.length) {
                    const text = child.innerHTML.toString().trim();
                    obj[categories[index]] = text;
                    index++;
                }
            }
            data.push(obj);
        }

        // first elem is the header so remove it
        data.shift();
        return data;
    } catch (err) {
        throw err;
    }
};

const getTable = doc => {
    let table;
    for (let elem of doc.getElementById('main').children) {
        if (elem.tagName === 'TABLE') {
            table = elem;
            break;
        }
    }
    return table;
};

export const fetchData = tableName => {
    return async dispatch => {
        dispatch({
            type: ActionTypes.FETCH_COUNCILLORS,
        });

        try {
            // Access to fetch at 'http://ws-old.parlament.ch/councillors' from origin 'http://localhost:3000' has been blocked by CORS policy
            const doc = await getDoc(
                `https://guarded-beyond-25903.herokuapp.com/http://ws-old.parlament.ch/${tableName}`
            );

            // getting the element with the tag table that is inside id main
            const table = getTable(doc);

            // ***** find the last page number *****
            let lastPage = null;
            if (
                doc.getElementsByClassName('paging').length > 0 &&
                doc
                    .getElementsByClassName('paging')[0]
                    .getElementsByTagName('a').length > 0
            ) {
                lastPage = doc
                    .getElementsByClassName('paging')[0]
                    .getElementsByTagName('a')[1];
            }

            let lastPageNumber;
            if (lastPage) {
                const lastIndex = lastPage.href.toString().lastIndexOf('=');
                lastPageNumber = parseInt(
                    lastPage.toString().substring(lastIndex + 1)
                );
            } else {
                // only one page
                lastPageNumber = 1;
            }

            if (lastPageNumber > 100) {
                lastPageNumber = 100;
            }

            // ***** categories *****
            const categories = [];
            for (let elem of table.getElementsByTagName('th')) {
                const text = elem.innerHTML.toString().trim();
                if (text.length > 0) {
                    categories.push(text);
                }
            }

            const allData = [];

            // ***** fetching data from each page *****
            const requests = [];
            for (let i = 1; i <= lastPageNumber; i++) {
                try {
                    requests.push(getData(i, categories, tableName));
                } catch (err) {
                    throw err;
                }
            }

            const data = await Promise.all(requests);

            data.forEach(obj =>
                obj.forEach(elem => {
                    allData.push(elem);
                })
            );

            dispatch({
                type: ActionTypes.FETCH_COUNCILLORS_COMPLETE,
                payload: allData,
            });
        } catch (err) {
            dispatch({
                type: ActionTypes.FETCH_COUNCILLORS_ERROR,
                payload: 'Councillors - FETCHING ERROR.',
            });
        }
    };
};

export const sortCoincillors = field => {
    return async dispatch => {
        dispatch({
            type: ActionTypes.SORT_COUNCILLORS,
            field,
        });
    };
};

export const filterCoincillors = keyword => {
    return async dispatch => {
        dispatch({
            type: ActionTypes.FILTER_COUNCILLORS,
            keyword,
        });
    };
};

export const resetFiltersCoincillors = () => {
    return async dispatch => {
        dispatch({
            type: ActionTypes.RESET_FILTERS_COUNCILLORS,
        });
    };
};
