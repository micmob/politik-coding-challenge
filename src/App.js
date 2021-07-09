import './App.css';
import { Provider } from 'react-redux';
import { store } from './store';
import List from './components/List';

const App = () => {
    return (
        <Provider store={store}>
            <div className="page-wrapper">
                <List />
            </div>
        </Provider>
    );
};

export default App;
