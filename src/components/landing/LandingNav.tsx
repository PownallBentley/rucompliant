import { Link } from "react-router-dom";

export default function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-page/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 md:px-8 lg:px-12 transition-all duration-300">
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
          <span className="text-primary font-extrabold text-lg leading-none">R</span>
        </div>
        <span className="font-extrabold text-xl text-foreground tracking-tight hidden sm:block">
          RUCompliant
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link to="/auth?mode=signin">
          <button className="px-3 sm:px-4 py-2 h-[44px] text-primary font-bold text-sm bg-white border-[1.5px] border-primary rounded-lg hover:bg-primary/5 transition-colors hidden sm:block">
            Sign in
          </button>
        </Link>
        <Link to="/auth">
          <button className="px-4 sm:px-5 py-2 h-[44px] bg-magenta text-white font-bold text-sm rounded-lg hover:bg-magenta-600 transition-colors w-full sm:w-auto">
            Get started free
          </button>
        </Link>
      </div>
    </nav>
  );
}
