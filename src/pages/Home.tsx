import { useState } from "react"
import '../styles/home.scss'
import { Spinner } from "../components/Spinner"
import { Description } from "../components/Description"
import { CardInfo } from "../components/CardInfo"
import { cardType } from '../components/CardInfo'
import { MainMenu } from "../components/MainMenu"
import { useCardSearch } from '../hooks/useCardSearch'
import { CardSearchForm } from "../components/CardSearchForm"
import Footer from "../components/Footer"

export function Home() {

    const [cardInfo, setCard] = useState<cardType>();
    const [component, setComponent] = useState('')
    const cardSearch = useCardSearch

    async function handleCardSearch(cardName: string) {
        setComponent('spinner')
        let card = await cardSearch({ name: cardName, exact: true })

        if (card) {
            setCard(card[0])
            setComponent('card')
        }
        else {
            alert('No card with the specified name was found!')
            setComponent('description')
        }
    }

    function renderComponent() {
        switch (component) {
            case "spinner":
                return <Spinner />
            case "card":
                if (cardInfo) { return <CardInfo card={cardInfo} /> }
                break
            case 'description':
                return <Description></Description>
            default:
                return <Description></Description>
        }
    }

    return (
        <div className="home">
            {/* <div className="main-menu container-fluid"> */}
            {/* <MainMenu /> */}
            <CardSearchForm resolveFunction={handleCardSearch} />
            {/* </div> */}

            {renderComponent()}

            <Footer />
        </div>
    )
}