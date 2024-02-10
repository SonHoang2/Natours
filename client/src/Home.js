import Header from "./component/Header"
import Card from "./component/Card"

export default function Home({tours}) {
  const cards = () => {
      return tours.map((tour, i) => (
        <Card
          key={i}
          {...tour}
        />
      ))
  }

  return(
    <div>
      <Header />
      <div className="pb-5"></div>
      <div className="pb-3"></div>
      <div className="container-fluid">
        <div className="row">
          {cards()}
        </div>
      </div>
    </div>
  )
}