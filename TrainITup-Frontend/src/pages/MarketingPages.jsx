import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const pageWrap = (children) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
)

const PageHeader = ({ title, highlight, copy }) => (
  <div className="text-center mb-10">
    <h1 className="display-4 fw-bold text-dark">
      {title} <span className="text-primary">{highlight}</span>
    </h1>
    <p className="lead text-muted">{copy}</p>
  </div>
)

const mentors = [
  { name: 'Chetan Patil', role: 'Java & Backend Specialist', rating: '4.9', students: '20K+', courses: 8, avatar: '/assets/images/avatar/avatar-1.jpg', bio: '8+ years of experience building enterprise Java applications at leading tech companies.' },
  { name: 'Sarah Johnson', role: 'UI/UX & Design Expert', rating: '4.8', students: '18K+', courses: 12, avatar: '/assets/images/avatar/avatar-2.jpg', bio: '10+ years designing beautiful user experiences at design agencies and tech companies.' },
  { name: 'Mike Chen', role: 'Data Science & ML Expert', rating: '4.9', students: '22K+', courses: 10, avatar: '/assets/images/avatar/avatar-3.jpg', bio: '7+ years in data science and ML. Former Data Scientist at Facebook and AWS.' },
  { name: 'Emma Davis', role: 'Digital Marketing Specialist', rating: '4.7', students: '15K+', courses: 9, avatar: '/assets/images/avatar/avatar-4.jpg', bio: '9+ years in digital marketing and growth strategies. Former Marketing Lead at Google.' },
  { name: 'Alex Rodriguez', role: 'Web Development Leader', rating: '4.8', students: '19K+', courses: 11, avatar: '/assets/images/avatar/avatar-5.jpg', bio: '12+ years building web applications. CTO experience at multiple startups.' },
  { name: 'Priya Sharma', role: 'DevOps & Cloud Expert', rating: '4.9', students: '16K+', courses: 7, avatar: '/assets/images/avatar/avatar-6.jpg', bio: '6+ years in DevOps, Kubernetes, and AWS. Infrastructure at scale expert.' }
]

export const MentorsPage = () => pageWrap(
  <section className="py-lg-10 py-8 bg-white">
    <div className="container">
      <PageHeader title="Learn From" highlight="Industry Experts" copy="Meet our world-class mentors with years of experience." />
      <div className="row g-4 mt-8">
        {mentors.map((mentor) => (
          <div className="col-md-6 col-lg-4" key={mentor.name}>
            <article className="card p-5 border-0 shadow-sm rounded-5 card-lift h-100">
              <img src={mentor.avatar} alt={mentor.name} className="rounded-circle mx-auto mb-4 border border-4 border-success" style={{ width: 100, height: 100, objectFit: 'cover' }} />
              <div className="text-center">
                <h2 className="h5 fw-bold mb-1 text-dark">{mentor.name}</h2>
                <p className="text-muted small mb-3">{mentor.role}</p>
                <div className="d-flex justify-content-center align-items-center gap-1 mb-3">
                  <span className="text-warning small"><i className="bi bi-star-fill"></i></span>
                  <span className="small fw-bold">{mentor.rating}</span>
                </div>
                <p className="text-muted small mb-3">{mentor.bio}</p>
                <div className="d-flex justify-content-around text-center mb-4">
                  <div><p className="small text-muted mb-0">{mentor.students}</p><p className="small fw-bold">Students</p></div>
                  <div><p className="small text-muted mb-0">{mentor.courses}</p><p className="small fw-bold">Courses</p></div>
                </div>
                <Link to="/course-detail" className="btn btn-primary w-100 rounded-pill py-2">View Courses</Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const communityFeatures = [
  { title: 'Study Groups', icon: 'bi-chat-dots', action: 'Join a Group', description: 'Form study groups with peers, share resources, and learn together. Join groups based on your courses and interests.' },
  { title: 'Discussion Forums', icon: 'bi-chat-square', action: 'Visit Forums', description: 'Ask questions, share insights, and engage with experts and mentors. Get answers within 24 hours.' },
  { title: 'Live Q&A Sessions', icon: 'bi-broadcast', action: 'View Schedule', description: 'Attend weekly live sessions with industry experts. Ask questions and get real-time feedback.' },
  { title: 'Peer Support Network', icon: 'bi-hand-thumbs-up', action: 'Connect Now', description: 'Get help from fellow learners anytime. Share your progress, celebrate wins, and overcome challenges together.' },
  { title: 'Project Collaboration', icon: 'bi-diagram-3', action: 'Browse Projects', description: 'Work on real-world projects with peers. Build portfolio projects and gain practical experience.' },
  { title: 'Global Network', icon: 'bi-globe', action: 'Find Friends', description: 'Connect with learners worldwide. Make friends, build professional networks, and expand your horizons.' }
]

export const CommunityPage = () => pageWrap(
  <section className="py-lg-10 py-8 bg-white">
    <div className="container">
      <PageHeader title="Join Our" highlight="Global Community" copy="Learn together with 50,000+ students from 150+ countries." />
      <div className="row g-4 mt-8">
        {communityFeatures.map((feature) => (
          <div className="col-md-6 col-lg-4" key={feature.title}>
            <article className="card border-0 shadow-sm rounded-5 p-5 card-lift h-100">
              <div className="fs-1 text-primary mb-4"><i className={`bi ${feature.icon}`}></i></div>
              <h2 className="h4 fw-bold mb-3 text-dark">{feature.title}</h2>
              <p className="text-muted">{feature.description}</p>
              <button className="btn btn-primary mt-auto">{feature.action}</button>
            </article>
          </div>
        ))}
      </div>
      <StatsBlock title="Community Stats" stats={[['50K+', 'Active Members'], ['150+', 'Countries'], ['24/7', 'Support Available']]} />
    </div>
  </section>
)

const testimonials = [
  { name: 'Alex Thompson', role: 'Software Developer at Meta', avatar: '/assets/images/avatar/avatar-1.jpg', text: 'The Java course completely transformed my career. Within 3 months of completing it, I landed a job at Meta with a 50% salary increase.' },
  { name: 'Jessica Lee', role: 'UX Designer at Spotify', avatar: '/assets/images/avatar/avatar-2.jpg', text: 'I switched careers from marketing to UX design thanks to this platform. The mentorship and project portfolio I built got me hired at Spotify.' },
  { name: 'David Park', role: 'Data Analyst at Amazon', avatar: '/assets/images/avatar/avatar-3.jpg', text: 'As a freelancer, I needed flexible learning. The self-paced courses fit perfectly, and I have increased my freelance rates by 40%.' },
  { name: 'Maria Garcia', role: 'Startup Founder', avatar: '/assets/images/avatar/avatar-4.jpg', text: 'The marketing course helped me understand growth strategies. I applied the learnings to my startup and doubled our revenue in 6 months.' },
  { name: 'James Wilson', role: 'Product Manager at Google', avatar: '/assets/images/avatar/avatar-5.jpg', text: 'Learning design and business skills gave me a unique edge. I got promoted to Product Manager at Google within a year.' },
  { name: 'Emily Chen', role: 'Senior Developer at Apple', avatar: '/assets/images/avatar/avatar-6.jpg', text: 'The web development bootcamp was intensive but worth every penny. I transitioned from a non-tech career and now earn 3x my previous salary.' }
]

export const TestimonialsPage = () => pageWrap(
  <section className="py-lg-10 py-8 bg-white">
    <div className="container">
      <PageHeader title="Success Stories From Our" highlight="Learners" copy="See how TrainITup students transformed their careers." />
      <div className="row g-4 mt-8">
        {testimonials.map((story) => (
          <div className="col-md-6 col-lg-4" key={story.name}>
            <article className="card border-0 shadow-sm rounded-5 p-5 card-lift h-100">
              <div className="mb-3 text-warning">{Array.from({ length: 5 }, (_, index) => <i className="bi bi-star-fill" key={index}></i>)}</div>
              <p className="text-muted fw-normal mb-4">"{story.text}"</p>
              <div className="d-flex align-items-center">
                <img src={story.avatar} alt={story.name} className="rounded-circle me-3" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                <div>
                  <h2 className="h6 fw-bold mb-0 text-dark">{story.name}</h2>
                  <p className="text-muted small mb-0">{story.role}</p>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
      <StatsBlock title="Our Impact" stats={[['50K+', 'Students Empowered'], ['85%', 'Career Growth'], ['4.9/5', 'Average Rating']]} />
    </div>
  </section>
)

const StatsBlock = ({ title, stats }) => (
  <div className="mt-10 text-center">
    <h2 className="h3 fw-bold mb-4 text-dark">{title}</h2>
    <div className="row g-4">
      {stats.map(([value, label]) => (
        <div className="col-md-4" key={label}>
          <div className="p-4">
            <h3 className="display-5 fw-bold text-primary">{value}</h3>
            <p className="text-muted">{label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const plans = [
  { name: 'Free', price: '$0', note: 'Perfect for beginners', cta: 'Get Started', featured: false, features: ['Access to 10 free courses', 'Basic community access', 'Email support (48h response)', 'Mobile app access', 'Course certificates'] },
  { name: 'Pro', price: '$29', note: 'Best for active learners', cta: 'Start Free Trial', featured: true, features: ['Unlimited course access', 'Full community features', 'Priority 24/7 support', 'Downloadable resources', 'Live Q&A sessions', 'Project code reviews', 'Career coaching'] },
  { name: 'Enterprise', price: '$99', note: 'For teams & organizations', cta: 'Contact Sales', featured: false, features: ['Everything in Pro +', 'Custom learning paths', 'Team analytics dashboard', 'Dedicated success manager', 'Custom integrations', 'SSO authentication', 'Invoice billing'] }
]

const comparisonRows = [
  ['Courses Access', '10 courses', 'Unlimited', 'Unlimited'],
  ['Support Response Time', '48 hours', '2 hours', '1 hour'],
  ['Community Access', 'Basic', 'Full', 'Full + Priority'],
  ['Live Q&A Sessions', false, true, true],
  ['Project Code Reviews', false, true, true],
  ['Career Coaching', false, true, true],
  ['Analytics Dashboard', false, false, true],
  ['Dedicated Manager', false, false, true]
]

const faqs = [
  ['Can I switch plans anytime?', 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'],
  ['Is there a money-back guarantee?', 'Absolutely! All paid plans come with a 14-day money-back guarantee, no questions asked.'],
  ['Do you offer bulk discounts?', 'Yes! Contact our sales team for team or organization pricing and discounts.'],
  ['Can I cancel anytime?', 'Of course! You can cancel your subscription at any time without penalties.']
]

const featureCell = (value) => {
  if (typeof value === 'boolean') {
    return value ? <i className="bi bi-check text-success"></i> : <i className="bi bi-x-lg text-muted"></i>
  }
  return value
}

export const PricingPage = () => pageWrap(
  <section className="py-lg-10 py-8 bg-white">
    <div className="container">
      <PageHeader title="Simple, Transparent" highlight="Pricing" copy="Choose the perfect plan for your learning goals. All plans include a 14-day money-back guarantee." />
      <div className="row g-4 justify-content-center mt-8">
        {plans.map((plan) => (
          <div className="col-md-6 col-lg-4" key={plan.name}>
            <article className={`card p-5 ${plan.featured ? 'border-primary border-3 shadow-lg' : 'border-0 shadow-sm'} rounded-5 text-center card-lift h-100 position-relative`}>
              {plan.featured && <span className="badge bg-primary position-absolute fw-bold" style={{ top: -15, right: 20 }}>MOST POPULAR</span>}
              <h2 className="h3 fw-bold mb-1 mt-2 text-dark">{plan.name}</h2>
              <h3 className="display-5 fw-bold text-dark">{plan.price}<span className="fs-5 text-muted">/month</span></h3>
              <p className="text-muted mb-4">{plan.note}</p>
              <ul className="list-unstyled my-5 text-start small">
                {plan.features.map((feature) => (
                  <li className="mb-2" key={feature}><i className="bi bi-check-circle-fill text-success me-2"></i> {feature}</li>
                ))}
              </ul>
              <button className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline-dark'} w-100 py-2 rounded-pill mt-auto`}>{plan.cta}</button>
            </article>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="h3 fw-bold mb-4 text-dark">Detailed Comparison</h2>
        <div className="table-responsive">
          <table className="table table-hover border-0">
            <thead className="border-top border-bottom">
              <tr>
                <th className="text-start">Features</th>
                <th className="text-center">Free</th>
                <th className="text-center">Pro</th>
                <th className="text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([label, free, pro, enterprise]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td className="text-center">{featureCell(free)}</td>
                  <td className="text-center">{featureCell(pro)}</td>
                  <td className="text-center">{featureCell(enterprise)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="h4 fw-bold mb-4 text-dark">Frequently Asked Questions</h2>
        <div className="row g-3">
          {faqs.map(([question, answer]) => (
            <div className="col-md-6" key={question}>
              <div className="text-start p-4 border rounded-3 h-100">
                <h3 className="h6 fw-bold text-dark">{question}</h3>
                <p className="text-muted small mb-0">{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)
