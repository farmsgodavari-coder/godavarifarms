import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-950 text-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Godavari Farms</h3>
          <p className="text-sm text-zinc-400">Nashik, Maharashtra</p>
          <p className="text-sm text-zinc-400">Daily onion market rates updated live.</p>
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-white">Contact</h4>
          <p className="text-sm text-zinc-400">Email: <a className="hover:underline" href="mailto:farmsgodavari@gmail.com">farmsgodavari@gmail.com</a></p>
          <p className="text-sm text-zinc-400">Phone: <a className="hover:underline" href="tel:+919370513599">+91 93705 13599</a></p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Follow</h4>
          <div className="flex items-center gap-3">
            <Link className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition" href="#" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9V12h2.54V9.79c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.97h-2.34v7.03C18.34 21.24 22 17.08 22 12.06z"/></svg>
            </Link>
            <Link className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition" href="#" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19 3A2.94 2.94 0 0 1 22 6v12a2.94 2.94 0 0 1-3 3H5a2.94 2.94 0 0 1-3-3V6a2.94 2.94 0 0 1 3-3zm-9.5 7H7v8h2.5zm-.1-2.5A1.4 1.4 0 1 0 8 6.1a1.39 1.39 0 0 0 1.4 1.4zM19 18v-4.5c0-2.42-1.3-3.55-3.03-3.55A2.62 2.62 0 0 0 13 11.41h-.06V10H10.5v8H13v-4.3c0-1.14.22-2.24 1.64-2.24s1.36 1.34 1.36 2.31V18z"/></svg>
            </Link>
            <Link className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition" href="#" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 0 11.993C0 5.373 5.373 0 11.993 0S24 5.373 24 11.993 18.627 24 12.007 24c-2.037 0-3.926-.521-5.6-1.44L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.593 5.448.003 9.89-4.415 9.893-9.862.003-5.448-4.415-9.89-9.862-9.893-5.448-.003-9.89 4.415-9.893 9.862-.001 2.329.752 4.482 2.027 6.235l-.48 1.748 2.923-.783zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.607.134-.133.297-.347.446-.52.149-.173.198-.297.297-.496.099-.198.05-.372-.025-.52-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.873.118.571-.085 1.758-.718 2.006-1.411.248-.694.248-1.289.173-1.411z"/></svg>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-zinc-400"> {new Date().getFullYear()} Godavari Farms. All rights reserved.</div>
    </footer>
  );
}
