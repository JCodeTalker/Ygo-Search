import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
// import logo from './logo.svg';
//import './App.css';
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { Wishlist } from './pages/Wishlist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// caminhos para as páginas vão aqui.
function App() {
  return (
    // <h2>test</h2>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/Wishlist" exact={true} component={Wishlist} />
            <Route path="/Recipes" exact={true} component={Recipes}></Route>
          </Switch>
        </AuthContextProvider>
      </DndProvider>
    </BrowserRouter>
  );
}

export default App;