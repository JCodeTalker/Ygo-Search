import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { Wishlist } from './pages/Wishlist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SavedDecks } from './pages/SavedDecks';
import Footer from './components/Footer';

// caminhos para as páginas vão aqui.
function App() {
  return (
    <>
      <HashRouter>
        <DndProvider backend={HTML5Backend}>
          <AuthContextProvider>
            <Switch>
              <Route path="/" exact={true} component={Home} />
              <Route path="/Wishlist" exact={true} component={Wishlist} />
              <Route path="/Recipes" exact={true} component={Recipes}></Route>
              <Route path="/Decks" exact={true} component={SavedDecks}></Route>
            </Switch>
          </AuthContextProvider>
        </DndProvider>
      </HashRouter>
      <Footer />
    </>
  );
}

export default App;
