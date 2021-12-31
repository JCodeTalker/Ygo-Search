type searchProps = {
  exact: boolean,
  name: string
}

/* 
*function to be used with forms, it returns an array with the searched card(in the first position)
*and its respective archetype(related cards):
*/
export async function cardSearchFunc(props: searchProps) {

  if (props.name === 'complete-list') {
    let json = await (await fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php')).json()
    return json.data
  }

  async function portugueseSearch() {
    let cardPt = await (await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt&name=${props.name}`)).json()
    let archetype
    if (cardPt.data[0].archetype) {
      archetype = await (await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?language=pt&archetype=${cardPt.data[0].archetype}`)).json()
    }
    if (archetype) {
      return [cardPt.data[0], ...archetype.data].filter((card, index, self) =>
        index === self.findIndex((t) => (
          t.place === card.place && t.name === card.name
        ))
      )
    }
    else {
      return [cardPt.data[0]]
    }
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
    try {
      return await englishSearch()
    } catch (e) {
      return await portugueseSearch()
    }
  } catch (e) {
    console.log("error: " + e)
    alert('No card found with the specified name. Please try again.')
    window.location.reload()
  }
}