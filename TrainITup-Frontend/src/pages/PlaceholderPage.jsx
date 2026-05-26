import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PlaceholderPage = ({ title, sourceFile }) => {
  return (
    <>
      <Navbar />
      <main className="py-lg-10 py-8 bg-light" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div className="bg-white shadow-sm rounded-4 p-5">
            <span className="text-primary text-uppercase small fw-bold">Migration pending</span>
            <h1 className="fw-bold mt-3 mb-3">{title}</h1>
            <p className="lead text-muted mb-0">
              This React route is ready. Next we will move the content from <code>{sourceFile}</code> into a real component.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PlaceholderPage
