import './styles.scss'

export function Spinner() {

  return (
    <div id="spinner">
      <div className="spinner-border" role="status">
      </div>
      <span>Loading...</span>
    </div>
  )
}