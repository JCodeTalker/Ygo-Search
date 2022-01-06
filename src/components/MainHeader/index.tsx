import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from '../../hooks/useAuth'
import avatar from '../../assets/avatar.png'

type formProps = {
  resolveFunction?: (name: string) => void
}

export function MainHeader(props: formProps) {

  const [cardName, setCardName] = useState('')
  const navigate = useNavigate()
  const { user, logOut, signInWithGoogle } = useAuth()

  function handleNavigation(path: string) {
    if (window.location.pathname === path) {
      document.location.reload()
    } else {
      navigate(path)
    }
  }

  return (
    <header className="container-fluid p-3 mb-3 border-bottom" style={{ width: '100%' }}>
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a className="nav-link px-2 link-secondary" onClick={() => { handleNavigation('/') }}>Home</a></li>
            {user?.wishlist && user.wishlist.length > 0 && <li><a className="nav-link px-2 link-dark" onClick={() => { handleNavigation('/wishlist') }}>WishList</a></li>}
            <li>
              <a type="button" className="dropdown-toggle nav-link px-2 link-dark" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" >Anime Series</a>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">Duel Monsters</a></li>
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh-gx" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">GX</a></li>
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh-5ds" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">5D's</a></li>
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh-zexal" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">Zexal</a></li>
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh-arc-v" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">Arc-V</a></li>
                <li><a href="https://www.crunchyroll.com/pt-br/yu-gi-oh-vrains" target="_blank" rel="noreferrer" className="dropdown-item nav-link px-2 link-dark">VRAINS</a></li>
              </ul>
            </li>
            <li><a href="https://img.yugioh-card.com/en/rulebook/SD_RuleBook_EN_10.pdf" className="nav-link px-2 link-dark" rel="noreferrer" target="_blank">How to Play</a></li>
          </ul>

          {props.resolveFunction && <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 d-flex" onSubmit={(event) => { event.preventDefault(); props.resolveFunction && props.resolveFunction(cardName) }}>
            <input type="search" id="search" className="form-control" placeholder="Search a card..." aria-label="Search" onChange={event => setCardName(event.target.value)} autoComplete="on" />
          </form>}

          <div className="dropdown text-end">
            <a className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={user?.avatar ? user.avatar : avatar} alt="avatar" width="32" height="32" className="rounded-circle" style={{ opacity: 0.5 }} />
            </a>
            <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
              {user && <li><a className="dropdown-item" onClick={() => navigate('/SavedDecks')} >My deck recipes</a></li>}
              <li><a className="dropdown-item" onClick={() => navigate('/DeckCreation')}>Create a deck</a></li>
              <li><hr className="dropdown-divider" /></li>
              {user?.name
                ?
                <li><a className="dropdown-item" onClick={logOut}>Sign out</a></li>
                :
                <li><a className="dropdown-item" onClick={signInWithGoogle}>Sign In</a></li>
              }
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}