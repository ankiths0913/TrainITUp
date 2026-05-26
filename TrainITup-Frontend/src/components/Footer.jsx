import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-dark text-white-50 py-lg-10 py-8 border-top border-secondary">
      <div className="container">
        <div className="row gy-5 mb-8">
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white fw-bold mb-4"><span className="text-primary">Train</span>ITup</h5>
            <p className="text-white-50 mb-4">Empowering millions of learners worldwide with industry-leading courses and expert mentors. Join our community and transform your career.</p>
            <div className="d-flex gap-2">
              {['facebook', 'twitter', 'linkedin', 'github'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                  aria-label={social}
                  style={{ width: 40, height: 40 }}
                >
                  <i className={`bi bi-${social} text-primary`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-4 fw-bold">Product</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/#courses" className="text-white-50 text-decoration-none small">Courses</a></li>
              <li className="mb-2"><Link to="/mentors" className="text-white-50 text-decoration-none small">Mentors</Link></li>
              <li className="mb-2"><a href="/#pricing" className="text-white-50 text-decoration-none small">Pricing</a></li>
              <li className="mb-2"><Link to="/community" className="text-white-50 text-decoration-none small">Community</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-4 fw-bold">Company</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">About Us</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Careers</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Blog</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Press</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-4 fw-bold">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none small">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="text-white mb-4 fw-bold">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2 text-white-50 small">
                <i className="bi bi-envelope text-primary me-2"></i>
                <a href="mailto:hello@trainitup.com" className="text-white-50 text-decoration-none">hello@trainitup.com</a>
              </li>
              <li className="mb-2 text-white-50 small">
                <i className="bi bi-telephone text-primary me-2"></i>
                +91 8989856323
              </li>
              <li className="text-white-50 small">
                <i className="bi bi-geo-alt text-primary me-2"></i>
                Indore, M.P.
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary my-5" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-center text-md-start small mb-3 mb-md-0">© 2026 TrainITup Technologies. All rights reserved.</p>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="#" className="text-white-50 text-decoration-none small">Sitemap</a>
              <span className="text-white-50">•</span>
              <a href="#" className="text-white-50 text-decoration-none small">Cookies</a>
              <span className="text-white-50">•</span>
              <a href="#" className="text-white-50 text-decoration-none small">Security</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
