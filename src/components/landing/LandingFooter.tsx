import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-page py-10 px-4 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <span className="text-primary font-extrabold text-sm leading-none">R</span>
          </div>
          <span className="font-medium text-[13px] text-muted-foreground">
            Compliance That Has Your Back
          </span>
        </div>

        <div className="flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
          <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium text-muted-foreground">
          &copy; {new Date().getFullYear()} RUCompliant Ltd
        </p>
      </div>
    </footer>
  );
}
