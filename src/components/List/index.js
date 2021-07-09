import './index.css';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActions } from '../../hooks/useActions';

const List = () => {
    // the name "councillors" (as in councillorsData, councillorsFilteredData) is misleading, it's a variable intended to be used for councillors, councils and affairs
    // didn't have time to modify it
    const councillors = useSelector(state => state.councillors);

    const [councillorsData, setCouncillorsData] = useState(null);
    const [councillorsFilteredData, setCouncillorsFilteredData] =
        useState(null);

    const {
        fetchData,
        sortCoincillors,
        filterCoincillors,
        resetFiltersCoincillors,
    } = useActions();

    // ***** FETCH *****

    useEffect(() => {
        fetchData('councillors');
    }, [fetchData]);

    // ***** LOADING *****

    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        if (councillors.loading) {
            setIsLoading(true);
        } else {
            if (!councillors.loading) {
                setIsLoading(false);
            }
        }
    }, [councillors.loading]);

    // ***** ERRORS & SET DATA *****

    useEffect(() => {
        if (councillors.data && !councillors.error) {
            setCouncillorsData(councillors.data);
            setCouncillorsFilteredData(councillors.filteredData);
            setHasError(false);
        } else {
            if (councillors.error) {
                setHasError(true);
            }
        }
    }, [councillors.error, councillors.data, councillors.filteredData]);

    // ***** SORT *****
    const [sortField, setSortField] = useState(null);

    const handleSort = field => {
        if (sortField !== field) {
            sortCoincillors(field);
        }
    };

    useEffect(() => {
        setCouncillorsFilteredData(councillors.filteredData);
    }, [councillors.filteredData]);

    // ***** FILTER (SEARCH) *****

    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        filterCoincillors(searchValue.toLowerCase());
    };

    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };

    const handleResetFilters = () => {
        resetFiltersCoincillors();
        setSearchValue('');
    };

    // ***** SWITCH BETWEEN TABLES *****

    const [table, setTable] = useState('councillors');

    const tables = ['councillors', 'councils', 'affairs'];
    const filters = [['First Name', 'Last Name', 'Id'], ['Name'], ['Date']];

    const showData = updatedTable => {
        fetchData(updatedTable);
        setTable(updatedTable);
    };

    return (
        <div>
            {hasError ? (
                <div>Oops, something went wrong: {councillors.error}</div>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="list-tables">
                        {tables.map(table => (
                            <button
                                onClick={() => showData(table)}
                                className="list-button"
                            >
                                {'Show ' + table}
                            </button>
                        ))}
                    </div>
                    <div className="list-filters">
                        {filters[tables.findIndex(elem => elem === table)].map(
                            elem => (
                                <button
                                    onClick={() => handleSort(elem)}
                                    className="list-button"
                                >
                                    {elem}
                                </button>
                            )
                        )}

                        <form onSubmit={handleSubmit}>
                            <label>
                                Search:
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                />
                            </label>
                            <input
                                type="submit"
                                value="Search"
                                className="list-button"
                            />
                        </form>
                        <button
                            onClick={handleResetFilters}
                            className="list-button"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {councillorsFilteredData &&
                        councillorsFilteredData.map(data => (
                            <div className="list">
                                {Object.keys(data).map(value => (
                                    <div className="list-item">
                                        {data[value]}
                                    </div>
                                ))}
                            </div>
                        ))}
                </>
            )}
        </div>
    );
};

export default List;
