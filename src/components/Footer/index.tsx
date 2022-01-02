import { GithubOutlined, LinkedinOutlined, MailOutlined } from "@ant-design/icons";
let year = new Date().getFullYear()
const Footer = () => {

  return (
    <>
      <div className="container mt-5">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <span className="text-muted">&copy; {year}, Jones Soares</span>
          </div>

          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
              <a className="text-muted" href="https://github.com/JCodeTalker/Ygo-Search" target="_blank" rel="noreferrer">
                <GithubOutlined width="24" height="24" style={{ fontSize: '1.5em' }} data-bs-toggle="tooltip" data-bs-placement="top" title="Take a look at the source code" />
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="https://www.linkedin.com/in/jones-soares/" rel="noreferrer" target="_blank">
                <LinkedinOutlined width="24" height="24" style={{ fontSize: '1.5em' }} data-bs-placement="top" data-bs-toggle="tooltip" title="Visit my LinkedIn" />
              </a>
            </li>
            <li className="ms-3">
              <a className="text-muted" href="mailto:jonesoaresdasilva@gmail.com">
                <MailOutlined width="24" height="24" style={{ fontSize: '1.5em' }} data-bs-placement="left" data-bs-toggle="tooltip" title="Mail me something interesting" />
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  )
}

export default Footer