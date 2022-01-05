import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
import { Home } from './pages/Home';
import { DeckCreation } from './pages/DeckCreation';
import { Wishlist } from './pages/Wishlist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SavedDecks } from './pages/SavedDecks';
import Footer from './components/Footer';
import './styles/global.scss'

// caminhos para as páginas vão aqui.
function App() {

  return (
    <>
      <BrowserRouter>
        <DndProvider backend={HTML5Backend}>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Wishlist" element={<Wishlist />} />
              <Route path="/DeckCreation" element={<DeckCreation />}></Route>
              <Route path="/SavedDecks" element={<SavedDecks />}></Route>
            </Routes>
          </AuthContextProvider>
        </DndProvider>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
