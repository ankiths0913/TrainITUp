import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
  const [courses] = useState([
    { id: 1, title: 'UPSC CSE - GS', icon: 'bi-building' },
    { id: 2, title: 'IIT JEE', icon: 'bi-flask' },
    { id: 3, title: 'NEET UG', icon: 'bi-heart-pulse' },
    { id: 4, title: 'Bank exams', icon: 'bi-bank' },
    { id: 5, title: 'SSC JE & state AE exams', icon: 'bi-checklist-task' },
    { id: 6, title: 'CAT & other MBA entrance tests', icon: 'bi-pencil-square' },
    { id: 7, title: 'CBSE class 12', icon: 'bi-book' },
    { id: 8, title: 'CA Intermediate', icon: 'bi-calculator' }
  ])

  const [mentors] = useState([
    { id: 1, name: 'Shanaya Mehta', role: 'Java Specialist', rating: 4.9, students: '20K+', courses: 8, avatar: '/assets/images/avatar/avatar-1.jpg' },
    { id: 2, name: 'Priyanka Solanki', role: 'Design Expert', rating: 4.8, students: '18K+', courses: 12, avatar: '/assets/images/avatar/avatar-2.jpg' },
    { id: 3, name: 'Romma Sharma', role: 'Data Science Expert', rating: 4.9, students: '22K+', courses: 10, avatar: '/assets/images/avatar/avatar-3.jpg' },
    { id: 4, name: 'Ajay Kumar Roy', role: 'Marketing Pro', rating: 4.7, students: '15K+', courses: 9, avatar: '/assets/images/avatar/avatar-4.jpg' }
  ])

  const [communityFeatures] = useState([
    { id: 1, title: 'Study Groups', icon: 'bi-chat-dots', description: 'Connect with like-minded learners and form collaborative study groups.' },
    { id: 2, title: 'Discussion Forums', icon: 'bi-chat-square', description: 'Engage in meaningful discussions and get answers from peers and mentors.' },
    { id: 3, title: 'Live Q&A Sessions', icon: 'bi-broadcast', description: 'Join live sessions and workshops with industry experts.' },
    { id: 4, title: 'Peer Support', icon: 'bi-hand-thumbs-up', description: 'Get help and support from fellow learners anytime you need it.' },
    { id: 5, title: 'Global Network', icon: 'bi-globe', description: 'Connect with students from 150+ countries worldwide.' },
    { id: 6, title: 'Project Collaboration', icon: 'bi-diagram-3', description: 'Work on real-world projects with your peers and build portfolios.' }
  ])

  const [testimonials] = useState([
    { id: 1, name: 'Ayushi Singh', company: 'Software Developer at Meta', rating: 5, text: '"The courses here transformed my career. I landed my dream job at Meta thanks to the practical skills learned."', avatar: '/assets/images/avatar/avatar-1.jpg' },
    { id: 2, name: 'Bhumika Gupta', company: 'UX Designer at Spotify', rating: 5, text: '"I switched careers from marketing to design. The structured curriculum and mentorship made the transition seamless."', avatar: '/assets/images/avatar/avatar-2.jpg' },
    { id: 3, name: 'Sakshi Roy', company: 'Data Analyst at Amazon', rating: 5, text: '"As a freelancer, I needed flexible learning. The self-paced courses fit perfectly into my schedule."', avatar: '/assets/images/avatar/avatar-3.jpg' }
  ])

  const [pricingCourses] = useState([
    { id: 1, title: 'Complete HTML', subtitle: 'One shot with Project in 4 Hours', image: '/assets/images/course-img-1.jpg', tag: 'Skills & Projects' },
    { id: 2, title: 'Complete CSS', subtitle: 'One Shot with Clone in 7 Hours', image: '/assets/images/course-img-2.jpg', tag: 'Skills & Projects' },
    { id: 3, title: 'Complete Java', subtitle: 'Complete Java in 36 Hours', image: '/assets/images/course-img-3.jpg', tag: 'Coding & DSA' },
    { id: 4, title: 'Complete Python', subtitle: 'One Shot with Project in 12 Hours', image: '/assets/images/course-img-4.jpg', tag: 'Coding & Projects' }
  ])

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-lg-10 py-8 bg-white position-relative overflow-hidden" id="hero">
        <div className="circle-bg d-none d-lg-block"></div>
        <div className="container">
          <div className="row align-items-center gy-8">
            <div className="col-lg-6">
              <span className="badge bg-success bg-opacity-10 text-success px-4 py-2 rounded-pill mb-4 border border-success">
                <i className="bi bi-circle-fill me-1 small"></i> New Courses Available
              </span>
              <h1 className="display-3 fw-bold mt-2 text-dark">
                Master New Skills <span className="text-primary">Online Anytime,</span> Anywhere
              </h1>
              <p className="my-5 lead">Join over 10,000+ students learning from world-class mentors. Transform your career with industry-leading courses.</p>
              <div className="d-flex gap-3">
                <a href="#courses" className="btn btn-primary btn-lg px-5">Start Learning <i className="bi bi-arrow-right ms-2"></i></a>
                <a href="#" className="btn btn-primary btn-lg px-5 text-white rounded-pill"><i className="bi bi-play-circle me-2 text-danger"></i> Demo</a>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="/assets/images/hero-img.jpg" alt="hero" className="img-fluid rounded-5 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Goals */}
      <section className="py-lg-10 py-8 bg-light" id="courses">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="fw-bold mb-8">Popular <span className="text-primary">goals</span></h2>
          </div>
          <div className="row g-4">
            {courses.map((course) => (
              <div key={course.id} className="col-lg-3 col-md-6 col-sm-6">
                <div className="goal-card text-center">
                  <div className="goal-icon-box">
                    <i className={`bi ${course.icon} goal-icon`}></i>
                  </div>
                  <h5 className="goal-title">{course.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-lg-10 py-8" id="mentors">
        <div className="container text-center">
          <span className="text-primary text-uppercase small fw-bold">Mentors</span>
          <h2 className="fw-bold mt-3 mb-10">Learn From Industry <span className="text-primary">Experts</span></h2>
          <div className="row g-4 mt-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="col-lg-3 col-md-6">
                <div className="card p-4 border-0 shadow-sm rounded-5 card-lift h-100">
                  <img src={mentor.avatar} alt={mentor.name} className="rounded-circle mx-auto mb-3 border border-4 border-success" style={{ width: '90px', height: '90px', objectFit: 'cover' }} />
                  <h5 className="fw-bold mb-1">{mentor.name}</h5>
                  <p className="text-muted small mb-2">{mentor.role}</p>
                  <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
                    <span className="text-warning small"><i className="bi bi-star-fill"></i></span>
                    <span className="small fw-bold">{mentor.rating}</span>
                  </div>
                  <div className="d-flex justify-content-around text-center mb-3">
                    <div><p className="small text-muted mb-0">{mentor.students}</p><p className="small fw-bold">Students</p></div>
                    <div><p className="small text-muted mb-0">{mentor.courses}</p><p className="small fw-bold">Courses</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/mentors" className="btn btn-outline-dark text-black rounded-pill px-5">View All Mentors <i className="bi bi-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-lg-10 py-8 bg-light" id="community">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-primary text-uppercase small fw-bold">Community</span>
            <h2 className="display-5 fw-bold mt-3">Join Our <span className="text-primary">Thriving Community</span></h2>
            <p className="text-muted lead">Learning is better together. Connect with 50,000+ students worldwide.</p>
          </div>
          <div className="row g-4 mt-6">
            {communityFeatures.map((feature) => (
              <div key={feature.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-5 p-5 text-center card-lift h-100">
                  <div className="fs-1 text-primary mb-3"><i className={`bi ${feature.icon}`}></i></div>
                  <h5 className="fw-bold mb-2">{feature.title}</h5>
                  <p className="text-muted small">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/community" className="btn btn-primary btn-lg px-5">Join Community</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-lg-10 py-8" id="testimonials">
        <div className="container">
          <div className="text-center mb-8">
            <span className="text-primary text-uppercase small fw-bold">Success Stories</span>
            <h2 className="display-5 fw-bold mt-3">What Our <span className="text-primary">Students Say</span></h2>
            <p className="text-muted lead">Join thousands of successful learners who transformed their careers.</p>
          </div>
          <div className="row g-4 mt-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm rounded-5 p-5 card-lift h-100">
                  <div className="mb-3">
                    <span className="text-warning">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </span>
                  </div>
                  <p className="text-muted fw-normal mb-4">{testimonial.text}</p>
                  <div className="d-flex align-items-center">
                    <img src={testimonial.avatar} alt={testimonial.name} className="rounded-circle me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    <div>
                      <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                      <p className="text-muted small mb-0">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/testimonials" className="btn btn-outline-dark text-black rounded-pill px-5">Read More Stories <i className="bi bi-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-lg-10 py-8 bg-white" id="pricing">
        <div className="container">
          <div className="text-center mb-10">
            <span className="text-primary text-uppercase small fw-bold">Popular Free Courses</span>
            <h2 className="fw-bold mt-3">Learn Job-Ready Skills <span className="text-primary">At Zero Cost</span></h2>
          </div>
          <div className="row g-3 justify-content-center pricing-grid">
            {pricingCourses.map((course) => (
              <div key={course.id} className="col-md-6 col-lg-3 d-flex">
                <article className="pricing-course-card w-100">
                  <div className="pricing-header-wrapper">
                    <h3 className="pricing-course-title">{course.title}</h3>
                    <p className="pricing-course-subtitle">{course.subtitle}</p>
                  </div>
                  <img src={course.image} alt={course.title} className="pricing-course-image" />
                  <div className="pricing-meta-row">
                    <span>Duration: 1 year</span>
                    <strong>Free</strong>
                  </div>
                  <h4 className="pricing-free-title">Free Course</h4>
                  <p className="pricing-free-copy">Enroll now at no cost</p>
                  <span className="pricing-pill">{course.tag}</span>
                  <a href="#courses" className="pricing-view-btn">View Course <i className="bi bi-arrow-right"></i></a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Home
