import { useAuth } from '../../hooks/useAuth'
import googleIcon from '../../images/google-icon.svg'
import './styles.scss'
import kuriboh from '../../images/kuriboh.jpg'
import { useHistory } from 'react-router'

export function Description() { // SHOULD CREATE SIGNED IN AND NOT SIGNED START SCREEN SEPARATED!!
  const { user, signInWithGoogle } = useAuth()
  const history = useHistory()

  return (
    <>
      <div className="container col-xxl-8 px-4 py-0">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-10 col-sm-8 col-lg-6">
            <img src={kuriboh} className="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy" />
          </div>
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold lh-1 mb-3">Welcome to Ygo Search{user?.name ? `, ${user.name}.` : ''}</h1>
            <p className="lead">Here, you can view information on any card in the Yu-Gi-Oh! Trading Card Game, as well as save your deck recipes and create a wish-list of cards that you do not own.
              You can also register your card collection to quickly dig through it.</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <button type="button" className="btn btn-primary btn-lg px-4 me-md-2" onClick={() => { history.push('/Recipes') }}>Create deck recipe</button>
              {!user &&
                <button type="button" onClick={signInWithGoogle} className="btn btn-outline-secondary btn-lg px-4" id="sign-in-button"><img src={googleIcon} alt="" />Sign In with Google</button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}