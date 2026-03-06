export default function Home() {
  return (
    <>
      <div className="grain"></div>

      <nav className="fixed top-0 left-0 w-full h-[80px] flex justify-between items-center px-[5%] bg-hosteloom-bg/50 backdrop-blur-md z-50 border-b border-hosteloom-border transition-all duration-300">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 bg-hosteloom-accent text-hosteloom-bg font-extrabold text-xl rounded-md">H</span>
          <span className="font-heading font-bold text-2xl -tracking-[0.02em]">HOSTELOOM</span>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="#features" className="text-hosteloom-text font-medium text-[0.95rem] hover:text-hosteloom-accent transition-colors">Features</a>
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
            Make hostel management completely stress-free. Prevent overbooking, track payments instantly, and keep all student records in one place.
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
                      <p className="text-hosteloom-text font-medium text-[0.95rem]">New Registration</p>
                      <span className="text-[0.7rem] text-hosteloom-muted mt-1">15m ago</span>
                    </div>
                    <p className="text-[0.8rem] text-hosteloom-muted mt-0.5">Sarah Smith • Pending</p>
                  </div>
                </div>
              </div>
            </div>

            
            {/* Floating decorative metric 2 */}
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
            <span>NO OVERBOOKING</span> • <span>INSTANT UPDATES</span> • <span>EASY ROOM ASSIGNMENT</span> • <span>SIMPLE MANAGEMENT</span> • <span>NO OVERBOOKING</span> • <span>INSTANT UPDATES</span> • <span>EASY ROOM ASSIGNMENT</span> • <span>SIMPLE MANAGEMENT</span> •
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
            { num: '01', title: 'Smart Room Assignment', desc: 'Automatically assign rooms based on what is available, making double-booking impossible.' },
            { num: '02', title: 'Payment Tracking', desc: 'Instantly know who has paid, who is pending, and who is overdue. Generate digital receipts securely.' },
            { num: '03', title: 'Student Portal', desc: 'Let students register themselves, update their details, and send maintenance requests.' },
            { num: '04', title: 'Live Reports', desc: 'See your total revenue and exactly how many rooms are occupied at a single glance.' },
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
              <li className="py-4 border-y border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-accent bg-hosteloom-accent/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Quick one-click approvals
              </li>
            </ul>
          </div>
          
          <div className="center-divider relative w-full h-[1px] lg:w-[1px] lg:h-full lg:min-h-[300px]"></div>
          
          <div className="flex flex-col">
            <div className="font-heading text-hosteloom-secondary font-bold tracking-widest text-[0.9rem] mb-4">PRIVATE OWNERS</div>
            <h2 className="font-heading font-bold text-[2.5rem] mb-6 leading-tight">Maximize Profitability</h2>
            <p className="text-hosteloom-muted text-[1.1rem] mb-10 max-w-[400px]">Never lose track of a payment or a tenant's maintenance request again. See exactly what happens across all your properties.</p>
            <ul className="list-none m-0 p-0">
              <li className="py-4 border-t border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-secondary bg-hosteloom-secondary/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Manage everything from one simple screen
              </li>
              <li className="py-4 border-y border-hosteloom-border font-normal flex items-center text-hosteloom-text">
                <span className="text-hosteloom-secondary bg-hosteloom-secondary/10 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs mr-4">✓</span>
                Live revenue tracking
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
              <span className="flex items-center justify-center w-8 h-8 bg-hosteloom-accent text-hosteloom-bg font-extrabold text-xl rounded-md">H</span>
              <span className="font-heading font-bold text-2xl -tracking-[0.02em]">HOSTELOOM</span>
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
