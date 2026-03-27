export default function Home() {
  return (
    <>
      <div className="grain"></div>

      <nav className="fixed top-0 left-0 w-full h-[80px] flex justify-between items-center px-[5%] bg-hosteloom-bg/50 backdrop-blur-md z-50 border-b border-hosteloom-border transition-all duration-300">
        <div className="flex items-center gap-3">
          <img src="/hosteloom-logo.png" alt="Hosteloom Logo" className="h-10 w-auto" />
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-hosteloom-text font-medium text-[0.95rem] hover:text-hosteloom-accent transition-colors">Features</a>
          <a href="#how-it-works" className="text-hosteloom-text font-medium text-[0.95rem] hover:text-hosteloom-accent transition-colors">How it Works</a>
          <a href="#solutions" className="text-hosteloom-text font-medium text-[0.95rem] hover:text-hosteloom-accent transition-colors">Solutions</a>
        </div>
        <div className="flex gap-3 items-center">
          <a href="/login" className="hidden sm:inline text-hosteloom-text font-medium text-[0.95rem] hover:text-hosteloom-accent transition-colors">Sign In</a>
          <a href="/register" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-[0.9rem] bg-hosteloom-accent text-hosteloom-bg hover:bg-hosteloom-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] transition-all duration-300">Register</a>
        </div>
      </nav>

      <main className="relative pt-[140px] pb-[60px] px-[5%] min-h-screen max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center text-center lg:text-left">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 bg-hosteloom-accent -top-[20%] -left-[10%] animate-drift"></div>
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-[0.04] bg-hosteloom-secondary bottom-0 -right-[10%] animate-drift-reverse"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center lg:items-start">

          <h1 className="font-heading font-bold text-[clamp(3rem,6vw,5.5rem)] leading-tight -tracking-[0.03em] mb-6">
            <span className="block">Smart Hostel</span>
            <span className="block text-hosteloom-muted">Management.</span>
            <span className="block text-hosteloom-accent">Simplified.</span>
          </h1>
          <p className="text-[1.2rem] text-hosteloom-muted max-w-[85%] mb-10 font-light mx-auto lg:mx-0">
            Make hostel management completely stress-free. Prevent overbooking, track payments instantly, manage complaints, and keep all student records in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start w-full">
            <a href="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-[1.05rem] bg-hosteloom-accent text-hosteloom-bg hover:bg-hosteloom-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] transition-all duration-300">Create Account</a>
            <a href="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-[1.05rem] bg-transparent text-hosteloom-text border border-hosteloom-border hover:border-hosteloom-text hover:bg-white/5 transition-all duration-300">Sign In</a>
          </div>
        </div>
        
        <div className="relative w-full h-[600px] hidden md:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] z-10">
            {/* Main glass panel */}
            <div className="bg-hosteloom-surface/80 backdrop-blur-2xl border border-hosteloom-border rounded-[2rem] p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-hosteloom-text font-heading font-bold text-lg">Live Activity</h3>
                <span className="flex items-center gap-2 text-[0.75rem] font-semibold text-hosteloom-accent bg-hosteloom-accent/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 bg-hosteloom-accent rounded-full animate-pulse shadow-[0_0_8px_var(--color-hosteloom-accent)]"></span>
                  Real-time
                </span>
              </div>
              
              <div className="space-y-3">
                {/* Activity Item 1 */}
                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-hosteloom-accent/20 flex items-center justify-center text-hosteloom-accent group-hover:bg-hosteloom-accent group-hover:text-hosteloom-bg transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-hosteloom-text font-medium text-[0.95rem]">Room 402 Allocated</p>
                      <span className="text-[0.7rem] text-hosteloom-muted mt-1">Just now</span>
                    </div>
                    <p className="text-[0.8rem] text-hosteloom-muted mt-0.5">Block A • John Doe</p>
                  </div>
                </div>
                
                {/* Activity Item 2 */}
                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-hosteloom-secondary/20 flex items-center justify-center text-hosteloom-secondary group-hover:bg-hosteloom-secondary group-hover:text-hosteloom-bg transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-hosteloom-text font-medium text-[0.95rem]">Payment Received</p>
                      <span className="text-[0.7rem] text-hosteloom-muted mt-1">2m ago</span>
                    </div>
                    <p className="text-[0.8rem] text-hosteloom-muted mt-0.5">₦150,000 • Session 2026</p>
                  </div>
                </div>

                {/* Activity Item 3 */}
                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group opacity-60 cursor-default">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-hosteloom-text font-medium text-[0.95rem]">Application Approved</p>
                      <span className="text-[0.7rem] text-hosteloom-muted mt-1">15m ago</span>
                    </div>
                    <p className="text-[0.8rem] text-hosteloom-muted mt-0.5">Sarah Smith • Block B</p>
                  </div>
                </div>
              </div>
            </div>

            
            {/* Floating decorative metric */}
            <div className="absolute -top-6 -left-10 bg-hosteloom-surface/90 backdrop-blur-xl border border-hosteloom-border px-5 py-4 rounded-[1.25rem] shadow-2xl flex items-center gap-3 animate-float-simple">
               <span className="text-hosteloom-accent font-heading font-extrabold text-2xl">98%</span>
               <span className="text-[0.75rem] text-hosteloom-muted leading-tight font-medium uppercase tracking-wider">Collection<br/>Rate</span>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee Ticker */}
      <section className="py-8 bg-hosteloom-accent text-hosteloom-bg overflow-hidden -rotate-[1.5deg] scale-105 my-10 relative z-10">
        <div className="flex whitespace-nowrap">
          <div className="font-heading font-extrabold text-3xl uppercase animate-ticker flex gap-10">
            <span>NO OVERBOOKING</span> • <span>INSTANT UPDATES</span> • <span>EASY ROOM ASSIGNMENT</span> • <span>COMPLAINT TRACKING</span> • <span>ONE-CLICK APPROVALS</span> • <span>CSV REPORTS</span> • <span>SIMPLE MANAGEMENT</span> • <span>NO OVERBOOKING</span> • <span>INSTANT UPDATES</span> • <span>EASY ROOM ASSIGNMENT</span> • <span>COMPLAINT TRACKING</span> • <span>ONE-CLICK APPROVALS</span> • <span>CSV REPORTS</span> • <span>SIMPLE MANAGEMENT</span> •
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-[120px] px-[5%] relative">
        <div className="max-w-[600px] mx-auto text-center mb-20">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,4vw,3.5rem)] mb-6">The End of Manual Chaos</h2>
          <p className="text-hosteloom-muted text-[1.1rem] font-light">Replace paper records and scattered forms with a simple, easy-to-use platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {[
            { num: '01', title: 'Smart Room Assignment', desc: 'Assign rooms based on availability with zero overbooking. Manage blocks, floors, and rooms in a clear hierarchy.' },
            { num: '02', title: 'Payment Tracking', desc: 'See who has paid, who is pending, and who is overdue. Auto-generate invoices and export records as CSV.' },
            { num: '03', title: 'Student Portal', desc: 'Students apply to hostels, file complaints, track payments, and receive broadcast announcements — all in one place.' },
            { num: '04', title: 'Admin Command Center', desc: 'Approve applications, resolve complaints, manage sessions, send broadcasts, and generate detailed reports.' },
          ].map((feature) => (
            <div key={feature.num} className="feature-card bg-hosteloom-surface border border-hosteloom-border p-10 rounded-3xl transition-all duration-400 relative overflow-hidden group hover:-translate-y-2 hover:border-hosteloom-accent/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="font-heading font-extrabold text-6xl text-transparent mb-6 inline-block transition-all duration-400 group-hover:text-hosteloom-accent/5 group-hover:[webkit-text-stroke:1px_var(--color-hosteloom-accent)]" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                {feature.num}
              </div>
              <h3 className="font-heading font-bold text-2xl mb-4">{feature.title}</h3>
              <p className="text-hosteloom-muted font-light leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-[120px] px-[5%] relative">
        <div className="max-w-[600px] mx-auto text-center mb-20">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,4vw,3.5rem)] mb-6">How It Works</h2>
          <p className="text-hosteloom-muted text-[1.1rem] font-light">Three simple steps from sign-up to moving in.</p>
        </div>

        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[60px] left-[16.67%] right-[16.67%] h-[1px] bg-gradient-to-r from-hosteloom-accent via-hosteloom-accent/40 to-hosteloom-secondary"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-[120px] h-[120px] rounded-[2rem] bg-hosteloom-accent/10 border border-hosteloom-accent/20 flex items-center justify-center mb-8 relative z-10 group-hover:bg-hosteloom-accent/20 group-hover:border-hosteloom-accent/40 transition-all duration-300">
              <span className="font-heading font-extrabold text-5xl text-hosteloom-accent">1</span>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Register &amp; Apply</h3>
            <p className="text-hosteloom-muted font-light text-[0.95rem] max-w-[280px] leading-relaxed">Create your account, complete your profile, and apply to the hostel of your choice.</p>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-[120px] h-[120px] rounded-[2rem] bg-hosteloom-accent/10 border border-hosteloom-accent/20 flex items-center justify-center mb-8 relative z-10 group-hover:bg-hosteloom-accent/20 group-hover:border-hosteloom-accent/40 transition-all duration-300">
              <span className="font-heading font-extrabold text-5xl text-hosteloom-accent">2</span>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Get Approved &amp; Assigned</h3>
            <p className="text-hosteloom-muted font-light text-[0.95rem] max-w-[280px] leading-relaxed">Admins review your application and assign you a room. You get notified instantly.</p>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-[120px] h-[120px] rounded-[2rem] bg-hosteloom-secondary/10 border border-hosteloom-secondary/20 flex items-center justify-center mb-8 relative z-10 group-hover:bg-hosteloom-secondary/20 group-hover:border-hosteloom-secondary/40 transition-all duration-300">
              <span className="font-heading font-extrabold text-5xl text-hosteloom-secondary">3</span>
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Pay &amp; Move In</h3>
            <p className="text-hosteloom-muted font-light text-[0.95rem] max-w-[280px] leading-relaxed">Your invoice is generated automatically. Pay online, get your receipt, and move in.</p>
          </div>
        </div>
      </section>

      {/* Role Showcase Section */}
      <section className="py-[120px] px-[5%] relative">
        <div className="max-w-[600px] mx-auto text-center mb-20">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,4vw,3.5rem)] mb-6">Built for Every Role</h2>
          <p className="text-hosteloom-muted text-[1.1rem] font-light">Whether you&apos;re a student, administrator, or property owner — Hosteloom adapts to your workflow.</p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <div className="bg-hosteloom-surface border border-hosteloom-border rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-400/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-2 text-white">Students</h3>
            <p className="text-hosteloom-muted text-sm font-light mb-6">Your hostel life, simplified.</p>
            <ul className="space-y-3">
              {['Apply to any hostel', 'View room & payment status', 'File & track complaints', 'Receive broadcast updates'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-hosteloom-text">
                  <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Admin Card */}
          <div className="bg-hosteloom-surface border border-hosteloom-border rounded-[2rem] p-8 relative overflow-hidden group hover:border-hosteloom-accent/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 md:-translate-y-4">

            <div className="absolute top-4 right-4">
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest bg-hosteloom-accent/10 text-hosteloom-accent px-3 py-1 rounded-full">Most Features</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-hosteloom-accent/10 border border-hosteloom-accent/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-hosteloom-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-2 text-white">Hostel Admins</h3>
            <p className="text-hosteloom-muted text-sm font-light mb-6">Full control, zero chaos.</p>
            <ul className="space-y-3">
              {['Manage hostel structure (blocks, floors, rooms)', 'Approve or reject applications', 'Allocate rooms & track payments', 'Handle complaints & generate reports', 'Broadcast announcements', 'Manage academic sessions'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-hosteloom-text">
                  <span className="w-5 h-5 rounded-full bg-hosteloom-accent/10 flex items-center justify-center text-hosteloom-accent text-[10px] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Owner Card */}
          <div className="bg-hosteloom-surface border border-hosteloom-border rounded-[2rem] p-8 relative overflow-hidden group hover:border-hosteloom-secondary/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300">

            <div className="w-14 h-14 rounded-2xl bg-hosteloom-secondary/10 border border-hosteloom-secondary/20 flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-hosteloom-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-xl mb-2 text-white">Property Owners</h3>
            <p className="text-hosteloom-muted text-sm font-light mb-6">See everything, manage anywhere.</p>
            <ul className="space-y-3">
              {['Create & manage multiple hostels', 'Build structure (blocks, floors, rooms)', 'Assign hostel admins', 'Monitor all properties from one view'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-hosteloom-text">
                  <span className="w-5 h-5 rounded-full bg-hosteloom-secondary/10 flex items-center justify-center text-hosteloom-secondary text-[10px] font-bold shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-[120px] px-[5%] max-w-[1400px] mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-[40px] lg:gap-[80px] items-center bg-hosteloom-surface border border-hosteloom-border rounded-[40px] p-10 lg:p-20">
          <div className="flex flex-col">
            <div className="font-heading text-hosteloom-accent font-bold tracking-widest text-[0.9rem] mb-4">INSTITUTIONS</div>
            <h2 className="font-heading font-bold text-[2.5rem] mb-6 leading-tight">Scale with Confidence</h2>
            <p className="text-hosteloom-muted text-[1.1rem] mb-10 max-w-[400px]">Handle thousands of students smoothly during busy times without any extra paperwork.</p>
            <ul className="list-none m-0 p-0">
              <li className="py-4 border-t border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-accent bg-hosteloom-accent/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Manage multiple buildings easily
              </li>
              <li className="py-4 border-t border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-accent bg-hosteloom-accent/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Quick one-click application approvals
              </li>
              <li className="py-4 border-y border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-accent bg-hosteloom-accent/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Built-in complaint management & resolution tracking
              </li>
            </ul>
          </div>
          
          <div className="center-divider relative w-full h-[1px] lg:w-[1px] lg:h-full lg:min-h-[300px]"></div>
          
          <div className="flex flex-col">
            <div className="font-heading text-hosteloom-secondary font-bold tracking-widest text-[0.9rem] mb-4">PRIVATE OWNERS</div>
            <h2 className="font-heading font-bold text-[2.5rem] mb-6 leading-tight">Maximize Profitability</h2>
            <p className="text-hosteloom-muted text-[1.1rem] mb-10 max-w-[400px]">Never lose track of a payment or a tenant&apos;s maintenance request again. See exactly what happens across all your properties.</p>
            <ul className="list-none m-0 p-0">
              <li className="py-4 border-t border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-secondary bg-hosteloom-secondary/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Manage all properties from one dashboard
              </li>
              <li className="py-4 border-t border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-secondary bg-hosteloom-secondary/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Application approval workflow with full audit trail
              </li>
              <li className="py-4 border-y border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-secondary bg-hosteloom-secondary/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Live revenue tracking & exportable reports
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-[120px] px-[5%] max-w-[1400px] mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="text-center relative z-10 py-20 px-10 rounded-[40px] border border-hosteloom-border bg-hosteloom-surface overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-hosteloom-accent before:to-hosteloom-secondary">
          <h2 className="font-heading font-bold text-[clamp(2.5rem,5vw,4rem)] mb-6 leading-tight">Ready to upgrade your property?</h2>
          <p className="text-[1.2rem] text-hosteloom-muted mb-10 max-w-[600px] mx-auto font-light">Join thousands of administrators completely upgrading the way they run their hostels.</p>
          <div className="flex justify-center gap-4">
            <a href="/register" className="inline-flex items-center justify-center px-10 py-4 rounded-full font-semibold text-[1.15rem] bg-hosteloom-accent text-hosteloom-bg hover:bg-hosteloom-accent-hover hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(168,85,247,0.2)] transition-all duration-300">Register Now</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-hosteloom-bg py-[80px] px-[5%] border-t border-hosteloom-border pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-[60px] max-w-[1400px] mx-auto">
          <div>
            <div className="flex items-center gap-3">
              <img src="/hosteloom-logo.png" alt="Hosteloom Logo" className="h-10 w-auto" />
            </div>
            <p className="text-hosteloom-muted mt-6 max-w-[300px] font-light">The digital standard for student accommodation management in Nigeria.</p>
          </div>
          <div className="flex flex-col lg:items-end justify-end h-full">
            <p className="text-hosteloom-muted text-[0.9rem]">&copy; 2026 Hosteloom. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
