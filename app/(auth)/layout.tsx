import React from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-hosteloom-bg text-hosteloom-text relative overflow-hidden">
      {/* Background Graphic Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-hosteloom-accent opacity-25 blur-[120px] mix-blend-screen pointer-events-none animate-drift" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-hosteloom-secondary opacity-[0.04] blur-[150px] mix-blend-screen pointer-events-none animate-drift-reverse" />
      
      {/* Global Grain from globals.css applies here as well */}
      <div className="grain" />

      {/* Main Container */}
      <div className="flex w-full h-screen z-10 relative">
        {/* Left Side: Visual/Editorial Presentation */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 lg:p-16 border-r border-hosteloom-border bg-hosteloom-surface/30 backdrop-blur-3xl relative">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-10 h-10 rounded-sm bg-hosteloom-text text-hosteloom-bg flex items-center justify-center font-heading font-bold text-xl cursor-pointer hover:bg-hosteloom-accent hover:text-white transition-colors">
                H
              </div>
            </Link>
            <span className="font-heading font-medium tracking-widest uppercase text-sm opacity-80">Hosteloom</span>
          </div>

          <div className="mt-auto mb-32">
            <h1 className="font-heading text-5xl xl:text-6xl font-extrabold leading-[1.1] mb-6">
              FIND YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-hosteloom-accent to-hosteloom-secondary">PERFECT</span> <br />
              ROOM.
            </h1>
            <p className="font-body text-hosteloom-muted text-lg max-w-md leading-relaxed mb-8">
              Hosteloom makes it easy to find, book, and manage hostel rooms — whether you&apos;re a student looking for a place to stay or a hostel owner.
            </p>

            <div className="flex items-center gap-2 text-xs font-heading tracking-widest text-hosteloom-muted uppercase">
              <span className="w-8 h-[1px] bg-hosteloom-muted/50 inline-block"></span>
              Your account is safe with us
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-y-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
            <Link href="/">
              <div className="w-8 h-8 rounded-sm bg-hosteloom-text text-hosteloom-bg flex items-center justify-center font-heading font-bold text-lg">
                H
              </div>
            </Link>
            <span className="font-heading font-medium tracking-widest uppercase text-xs opacity-80">Hosteloom</span>
          </div>

          <div className="w-full max-w-md my-auto flex flex-col items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
