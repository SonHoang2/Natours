import Header from "./component/Header"
import Card from "./component/Card"

export default function Home({tours}) {
  const cards = () => {
    if (tours.data) {
      return tours.data.doc.map(tour => (
        <Card 
          {...tour}
        />
      ))
    }
  }

  return(
    <div>
      <Header />
      <div className="container-fluid">
        <div className="row">
          {cards()}
        </div>
      </div>
    </div>
  )
}