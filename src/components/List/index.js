import './index.css';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActions } from '../../hooks/useActions';

const List = () => {
    const councillors = useSelector(state => state.councillors);

    const [councillorsData, setCouncillorsData] = useState(null);
    const [councillorsFilteredData, setCouncillorsFilteredData] =
        useState(null);

    const {
        fetchCouncillors,
        sortCoincillors,
        filterCoincillors,
        resetFiltersCoincillors,
    } = useActions();

    // ***** FETCH *****

    useEffect(() => {
        fetchCouncillors();
    }, [fetchCouncillors]);

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

    useEffect(() => {
        if (councillorsData) {
            console.log(councillorsData.length);
        }
    }, [councillorsData]);

    // ***** SORT *****
    const [sortField, setSortField] = useState(null);

    const handleSort = field => {
        console.log(sortField, field);
        if (sortField !== field) {
            sortCoincillors(field);
        }
    };

    useEffect(() => {
        setCouncillorsFilteredData(councillors.filteredData);
    }, [councillors.filteredData]);

    // ***** FILTER *****

    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        filterCoincillors(searchValue);
    };

    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    };

    const handleResetFilters = () => {
        resetFiltersCoincillors();
        setSearchValue('');
    };

    return (
        <div>
            {hasError ? (
                <div>Oops, something went wrong.</div>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <button onClick={() => handleSort('First Name')}>
                        {sortField === 'First Name'
                            ? 'Reset sort'
                            : 'Sort by first name'}
                    </button>
                    <button onClick={() => handleSort('Last Name')}>
                        {sortField === 'Last Name'
                            ? 'Reset sort'
                            : 'Sort by last name'}
                    </button>
                    <button onClick={() => handleSort('Id')}>
                        {sortField === 'Id Name' ? 'Reset sort' : 'Sort by id'}
                    </button>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Id or name:
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                            />
                        </label>
                        <input type="submit" value="Search" />
                    </form>
                    <button onClick={handleResetFilters}>Reset</button>
                    {councillorsFilteredData &&
                        councillorsFilteredData.map(data => (
                            <div className="list">
                                <div className="list-item">{data['Id']}</div>
                                <div className="list-item">
                                    {data['Number']}
                                </div>
                                <div className="list-item">
                                    {data['First Name']}
                                </div>
                                <div className="list-item">
                                    {data['Last Name']}
                                </div>
                            </div>
                        ))}
                </>
            )}
        </div>
    );
};

export default List;
