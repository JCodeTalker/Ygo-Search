type searchProps = {
  exact: boolean,
  name: string,
  lang?: string
}

/* 
*function to be used with forms, it returns an array with the searched card(in the first position)
*and its respective archetype:
*/
export async function useCardSearch(props: searchProps) {


  if (props.name === 'complete-list') {
    let json = await (await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')).json()
    return json.data
  }

  async function portugueseSearch() {
    let responsePt = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt&name=${props.name}`)
    let cardPt = await responsePt.json()
    return cardPt ? [cardPt] : [englishSearch()]
  }

  async function englishSearch() {
    let cardEn = await (await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${props.name}`)).json()
    let archetype
    if (cardEn.data[0].archetype) {
      archetype = await (await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?archetype=${cardEn.data[0].archetype}`)).json()
    }

    if (archetype) {
      return [cardEn.data[0], ...archetype.data].filter((card, index, self) =>
        index === self.findIndex((t) => (
          t.place === card.place && t.name === card.name
        ))
      )
    }
    else {
      return [cardEn.data[0]]
    }
  }

  try {
    if (props.lang === "Portuguese") {
      return await portugueseSearch()
    } else {
      return await englishSearch()
    }
  } catch (e) {
    console.log(e)
  }
}