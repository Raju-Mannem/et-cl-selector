import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header
      className="flex justify-between items-center height-10 width-full px-16 py-4 bg-slate-50
    border-b-4 shadow-xl shadow-blue-500/10 sticky top-0"
    >
      <aside className="">
        <Image
          src="/campuslogics.webp"
          width={150}
          height={150}
          alt="campus logics"
          className="width-[300px] md:width-[500px] drop-shadow-xl"
        />
      </aside>
      <nav className="mx-4 hidden sm:block text-blue-500 font-bold">
  <ul className="flex items-center justify-between gap-12">
    <li className="relative group">
      <Link href="/" className="block py-2">
        Home
      </Link>
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-all duration-2000 ease-in-out"></span>
    </li>
    <li className="relative group">
      <Link href="/about" className="block py-2">
        About
      </Link>
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-all duration-2000 ease-in-out"></span>
    </li>
    <li className="relative group">
      <Link href="/contact" className="block py-2">
        Contact
      </Link>
      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-all duration-2000 ease-in-out"></span>
    </li>
  </ul>
</nav>

    </header>
  );
};

export default Navbar;
