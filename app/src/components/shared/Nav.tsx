import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Link } from 'react-router-dom';

function Nav() {
    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <a href="#">Home</a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a href="#">About</a>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>
              <Link to="/blog">Blog</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>  
    )
}

export default Nav