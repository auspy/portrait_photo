import Link from "next/link";

const Navigation = [
  {
    href: "/privacy",
    label: "Privacy Policy",
  },
  {
    href: "/terms",
    label: "Terms & Conditions",
  },
  {
    href: "/terms#refund",
    label: "Refund Policy",
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t w-screen bg-gray-50">
      <div className="max-w-7xl contain mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Picture Outline Generator
          </div>
          <nav>
            <ul className="flex items-center space-x-6 text-sm">
              {Navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-gray-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
