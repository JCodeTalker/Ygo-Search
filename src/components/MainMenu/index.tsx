import { useHistory } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../Button"
import './styles.scss'

export function MainMenu() {
  const { user, logOut, signInWithGoogle } = useAuth()
  const history = useHistory()

  function handleClick(path: string) {
    if (window.location.pathname === path) {
      document.location.reload()
    } else {
      history.push(path)
    }
  }


  return (
    <div className="main-menu" style={{ alignSelf: 'center' }}>

      <Button onClick={() => { handleClick('/') }}>Home</Button>
      {user?.name ? <Button onClick={logOut}>Sign Out</Button> : ''}
      {user?.name ? <Button onClick={() => { handleClick('/wishlist') }}>Go to your Card WishList</Button> : ''}
      <Button><a href="https://img.yugioh-card.com/en/rulebook/SD_RuleBook_EN_10.pdf" target='_blank' rel="noreferrer" style={{ textDecoration: 'none', color: 'black' }}>Learn How to Play</a></Button>

      <div className="dropdown" >
        <Button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: '#EFEFEF', color: 'black', }}>Watch the Anime Series</Button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh" target="_blank" rel="noreferrer">Duel Monsters</a></li>
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh-gx" target="_blank" rel="noreferrer">GX</a></li>
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh-5ds" target="_blank" rel="noreferrer">5D's</a></li>
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh-zexal" target="_blank" rel="noreferrer">Zexal</a></li>
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh-arc-v" target="_blank" rel="noreferrer">Arc-V</a></li>
          <li><a className="dropdown-item" href="https://www.crunchyroll.com/pt-br/yu-gi-oh-vrains" target="_blank" rel="noreferrer">Vrains</a></li>
        </ul>
      </div>

    </div>
  )
}