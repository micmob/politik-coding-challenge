import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../store';

/**
 * example:
 * const { fetchSomething } = useActions();
 * fetchSomething();
 */
export const useActions = () => {
    const dispatch = useDispatch();

    return useMemo(() => {
        return bindActionCreators(actions, dispatch);
    }, [dispatch]);
};
