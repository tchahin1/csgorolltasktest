import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarItems } from '../../../constants/sidebarRoutes';
import classNames from 'classnames';

interface NavBarProps {
  isSuperCoach: boolean;
}
const NavBar = ({ isSuperCoach }: NavBarProps) => {
  const pathname = usePathname();

  return (
    <div className='bg-gray-700 hidden md:flex w-screen flex-row gap-24 px-12 py-5'>
      {sidebarItems.map((el) => {
        const isActive =
          el.route === pathname ||
          pathname
            .split('/')
            .filter((path) => !!path && path === el.route.slice(1)).length;
        const isEcercises = el.name === 'Exercises';

        return (
          <Link key={el.name} href={el.route}>
            <p
              className={classNames(
                `text-sm hover:text-primary-500 hover:scale-110 transition-all`,
                {
                  'text-primary-500 scale-110 transition-all': isActive,
                  'text-gray-400': !isActive,
                  hidden: isEcercises ? !isSuperCoach : el.hidden,
                },
              )}
            >
              {el.name}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default NavBar;
