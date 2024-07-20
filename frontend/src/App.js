import {Route} from 'react-router-dom';
import Homepage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import './App.css'; 

function App() {
    return (
       <div className = "App">
         <Route  path = "/" component={Homepage}  exact />
         <Route  path = "/admin"  component = {DashboardPage} exact/>
       </div>
    )
}

export default App;
