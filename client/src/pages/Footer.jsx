import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-blue-800 text-blue-100 w-full py-6 px-6 flex flex-col items-center">
    <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4 md:gap-0">
      
      {/* Branding */}
      <div className="text-center md:text-left">
        <h2 className="text-xl font-semibold mb-1">DevSync</h2>
        <p className="text-blue-200 max-w-xs text-sm">
          Sync your projects, teams, and tasks — all in one place.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col space-y-1 text-center md:text-left text-sm">
        <h3 className="font-semibold mb-1 text-blue-300">Quick Links</h3>
        <a href="/" className="hover:text-blue-300 transition">Home</a>
        <a href="/dashboard" className="hover:text-blue-300 transition">Dashboard</a>
        <a href="/signup" className="hover:text-blue-300 transition">Sign Up</a>
      </div>

      {/* Social Icons */}
      <div className="flex flex-col items-center md:items-start">
        <h3 className="font-semibold mb-1 text-blue-300 text-sm">Connect with me</h3>
        <div className="flex space-x-3 text-xl">
          <a
            href="https://linkedin.com/in/yourlinkedin"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/yourgithub"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://twitter.com/yourtwitter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Copyright */}
    <div className="mt-6 text-center text-blue-300 text-xs">
      &copy; {new Date().getFullYear()} DevSync. All rights reserved.
    </div>
    <div className="mt-4 text-center text-blue-300 text-xs italic">
  Made with ❤️ by <a href="https://linkedin.com/in/mayurchaudhary" target="_blank" rel="noopener noreferrer" className="hover:underline">Mayur Chaudhary</a>
</div>
  </footer>
);

export default Footer;