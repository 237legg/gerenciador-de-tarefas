import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function NavbarPill() {
  return (
    <div className="min-h-screen bg-[#90C850] p-5 font-sans">
      {/* Navbar */}
      <nav className="max-w-10/12 mx-auto flex items-center gap-6">
        {/* Navegação Principal */}
        <div className="flex-1 bg-white rounded-xl flex  justify-between pl-6 pr-3 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center ">
            <div className="w-8 h-8 text-[#90C850] flex items-center justify-center"></div>
            <span className="text-2xl font-medium text-gray-900 tracking-tight">
              TestingService
            </span>
          </Link>

          {/* Links de Navegação */}
          <div className="hidden lg:flex items-center whitespace-nowrap ml-62 gap-8 text-[20px] font-medium text-gray-700">
            <Link
              href="#"
              className="flex items-center hover:text-gray-500 transition-colors"
            >
              Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </Link>
            <Link
              href="#"
              className="flex items-center hover:text-gray-500 transition-colors"
            >
              Methodology <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </Link>
            <Link
              href="#"
              className="flex items-center hover:text-gray-500 transition-colors"
            >
              Industry Sectors{" "}
              <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </Link>
            <Link
              href="#"
              className="flex items-center hover:text-gray-500 transition-colors pr-4"
            >
              Network <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </Link>
          </div>

          {/* Hamburger */}
          <button className="w-11 h-11 bg-[#90C850] hover:bg-[#82b846] mr-3 transition-colors rounded-full flex flex-col items-center justify-center gap-[2px]">
            <span className="w-5 h-[2px] bg-black rounded-full"></span>
            <span className="w-5 h-[2px] bg-black rounded-full"></span>
          </button>
        </div>

        {/* Call to Action */}
        <button className="bg-white hover:bg-gray-50 transition-colors rounded-3xl flex items-center gap-4 pl-5 pr-5 py-4.5 89897">
          <span className="text-[20px] font-bold text-gray-700">Criar</span>
        </button>
      </nav>
    </div>
  );
}
