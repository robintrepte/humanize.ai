import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground py-4 text-sm text-center border-t px-6 mt-16">
      <div className="flex justify-between">
        <p>&copy; {new Date().getFullYear()}</p>
        <div>
          <Link href="/impressum" className="mx-2">Impressum</Link>
          <Link href="/datenschutz" className="mx-2">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
