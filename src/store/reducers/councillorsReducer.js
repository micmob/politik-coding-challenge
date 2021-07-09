import produce, { original } from 'immer';
import { ActionTypes } from '../actions/action-types';

const initialState = {
    loading: true,
    error: null,
    data: null,
    filteredData: null,
};

const reducer = produce((state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.FETCH_COUNCILLORS:
            state.loading = true;
            state.error = null;
            state.data = null;
            state.filteredData = null;

            return state;
        case ActionTypes.FETCH_COUNCILLORS_ERROR:
            state.loading = false;
            state.error = action.payload;
            state.data = null;
            state.filteredData = null;

            return state;
        case ActionTypes.FETCH_COUNCILLORS_COMPLETE:
            state.loading = false;
            state.data = action.payload;
            state.filteredData = action.payload;

            return state;
        case ActionTypes.SORT_COUNCILLORS:
            let sortedEntries = original(state).filteredData.slice();

            const sortName = (a, b) => {
                let fa = a[action.field].toLowerCase(),
                    fb = b[action.field].toLowerCase();

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            };

            const sortNumber = (a, b) =>
                parseInt(a[action.field]) - parseInt(b[action.field]);

            if (action.field === 'Id') {
                sortedEntries.sort(sortNumber);
            } else {
                sortedEntries.sort(sortName);
            }

            state.filteredData = sortedEntries;

            return state;

        case ActionTypes.FILTER_COUNCILLORS:
            let filteredEntries = original(state).filteredData.slice();

            filteredEntries = filteredEntries.filter(
                data =>
                    (data['First Name'] &&
                        data['First Name']
                            .toLowerCase()
                            .includes(action.keyword)) ||
                    (data['Last Name'] &&
                        data['Last Name']
                            .toLowerCase()
                            .includes(action.keyword)) ||
                    (data['Id'] &&
                        data['Id']
                            .toString()
                            .includes(action.keyword.toString())) ||
                    (data['Name'] &&
                        data['Name']
                            .toString()
                            .toLowerCase()
                            .includes(action.keyword.toString()))
            );

            state.filteredData = filteredEntries;

            return state;

        case ActionTypes.RESET_FILTERS_COUNCILLORS:
            state.filteredData = state.data;
            return state;
        default:
            return state;
    }
});

export default reducer;
