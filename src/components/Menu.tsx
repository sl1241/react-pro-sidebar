import { $$, createContext, useMemo } from 'voby';
import { menuClasses } from '../utils/utilityClasses';

export interface MenuItemStylesParams {
  level: number;
  disabled: boolean;
  active: boolean;
  isSubmenu: boolean;
  open?: boolean;
}

export type ElementStyles = CSSObject | ((params: MenuItemStylesParams) => CSSObject | undefined);

export interface MenuItemStyles {
  root?: ElementStyles;
  button?: ElementStyles;
  label?: ElementStyles;
  prefix?: ElementStyles;
  suffix?: ElementStyles;
  icon?: ElementStyles;
  subMenuContent?: ElementStyles;
  SubMenuExpandIcon?: ElementStyles;
}

export interface RenderExpandIconParams {
  level: number;
  disabled: boolean;
  active: boolean;
  open: boolean;
}

export interface MenuContextProps {
  /**
   * Transition duration in milliseconds
   * @default ```300```
   */
  transitionDuration?: number;

  /**
   * If set to true, the popper menu will close when a menu item is clicked
   * This works on collapsed mode only
   * @default ```false```
   */
  closeOnClick?: boolean;

  /**
   * Apply styles to MenuItem and SubMenu components and their children
   */
  menuItemStyles?: MenuItemStyles;

  /**
   * Render a custom expand icon for SubMenu components
   */
  renderExpandIcon?: (params: RenderExpandIconParams) => React.ReactNode;
}

export interface MenuProps extends MenuContextProps, React.MenuHTMLAttributes<HTMLMenuElement> {
  rootStyles?: CSSObject;
  children?: React.ReactNode;
}

// const StyledMenu = styled.nav<Pick<MenuProps, 'rootStyles'>>`
//   &.${menuClasses.root} {
//     ${({ rootStyles }) => rootStyles}
//   }
// `;

export const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const LevelContext = createContext<number>(0);

const MenuFR = (
  {
    children,
    className,
    transitionDuration = 300,
    closeOnClick = false,
    rootStyles,
    menuItemStyles,
    renderExpandIcon,
    ref,
    ...rest
  } : MenuProps,
) => {
  
  const providerValue = useMemo(() => ({ transitionDuration, closeOnClick, menuItemStyles, renderExpandIcon }));
  return (
    <MenuContext.Provider value={$$(providerValue)}>
      <LevelContext.Provider value={0}>
        <nav
          ref={ref}
          className={[menuClasses.root, className]}
          {...rest}
        >
          <ul class="list-none p-0 m-0">{children}</ul>
        </nav>
      </LevelContext.Provider>
    </MenuContext.Provider>
  );
};

export const Menu = (MenuFR);
