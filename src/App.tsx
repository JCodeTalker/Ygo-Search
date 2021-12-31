import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext'
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { Wishlist } from './pages/Wishlist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SavedDecks } from './pages/SavedDecks';
import Footer from './components/Footer';
import './styles/global.scss'
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { TouchBackend } from 'react-dnd-touch-backend';

// caminhos para as páginas vão aqui.
function App() {

  useEffect(() => {
    let ua = navigator.userAgent
    console.log(ua)
    if (isMobile) {
      console.log("mobile browser detected!")
    } else {
      console.log("non-mobile browser detected!")
    }
  }, [])

  return (
    <>
      <BrowserRouter basename={process.env.REACT_APP_PUBLIC_URL}>
        {/* <DndProvider backend={HTML5Backend}> */}
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <AuthContextProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Wishlist" element={<Wishlist />} />
              <Route path="/Recipes" element={<Recipes />}></Route>
              <Route path="/Decks" element={<SavedDecks />}></Route>
            </Routes>
          </AuthContextProvider>
        </DndProvider>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App;
