
interface NavLink {
  name: string;
  href: string;
  section: string;
}

interface NavLinksProps {
  links: NavLink[];
  onNavLinkClick: (href: string) => void;
  className?: string;
}

export const NavLinks = ({ links, onNavLinkClick, className }: NavLinksProps) => {
  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.name}
          href={link.href}
          className="font-medium text-sm md:text-sm text-base hover:text-yellow transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-0 after:bg-yellow after:transition-all after:duration-300 hover:after:w-full"
          onClick={(e) => {
            e.preventDefault();
            onNavLinkClick(link.href);
          }}
        >
          {link.name}
        </a>
      ))}
    </div>
  );
};
