/* eslint-disable @typescript-eslint/no-unused-expressions */
import classnames from 'classnames';
import { SubMenuContent } from './SubMenuContent';
import { StyledMenuLabel } from '../styles/StyledMenuLabel';
import { StyledMenuIcon } from '../styles/StyledMenuIcon';
import { StyledMenuPrefix } from '../styles/StyledMenuPrefix';
import { useMenu } from '../hooks/useMenu';
import { StyledMenuSuffix } from '../styles/StyledMenuSuffix';
import { menuClasses } from '../utils/utilityClasses';
import {
  StyledExpandIcon,
  StyledExpandIconCollapsed,
  StyledExpandIconWrapper,
} from '../styles/StyledExpandIcon';
import { usePopper } from '../hooks/usePopper';
import { MenuButton, menuButtonStyles } from './MenuButton';
import { SidebarContext } from './Sidebar';
import { LevelContext } from './Menu';
import { useContext, $, $$, useEffect, useMemo } from 'voby';

export interface SubMenuProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> {
  /**
   * The label to be displayed in the menu item
   */
  label?: string | React.ReactNode;

  /**
   * The icon to be displayed in the menu item
   */
  icon?: React.ReactNode;

  /**
   * The prefix to be displayed in the menu item
   */
  prefix?: React.ReactNode;

  /**
   * The suffix to be displayed in the menu item
   */
  suffix?: React.ReactNode;

  /**
   * set open value to control the open state of the sub menu
   */
  open?: boolean;

  /**
   * set defaultOpen value to set the initial open state of the sub menu
   */
  defaultOpen?: boolean;

  /**
   * If set to true, the menu item will have an active state
   */
  active?: boolean;

  /**
   * If set to true, the menu item will be disabled
   */
  disabled?: boolean;

  /**
   * The component to be rendered as the menu item button
   */
  component?: string | React.ReactElement;

  /**
   * Apply styles from the root element
   */
  rootStyles?: CSSObject;

  /**
   * callback function to be called when the open state of the sub menu changes
   * @param open
   */
  onOpenChange?: (open: boolean) => void;

  children?: React.ReactNode;
}

interface StyledSubMenuProps extends Pick<SubMenuProps, 'rootStyles' | 'active' | 'disabled'> {
  level: number;
  menuItemStyles?: CSSObject;
  collapsed?: boolean;
  rtl?: boolean;
  buttonStyles?: CSSObject;
}

type MenuItemElement =
  | 'root'
  | 'button'
  | 'label'
  | 'prefix'
  | 'suffix'
  | 'icon'
  | 'subMenuContent'
  | 'SubMenuExpandIcon';

export const SubMenuFR = (
  {
    children,
    className,
    label,
    icon,
    title,
    prefix,
    suffix,
    open: openControlled,
    defaultOpen,
    active = false,
    disabled = false,
    rootStyles,
    component,
    onOpenChange,
    onClick,
    onKeyUp,
    ref,
    ...rest
  }: SubMenuProps,
) => {
  const level = useContext(LevelContext);
  const {
    collapsed,
    rtl,
    transitionDuration: sidebarTransitionDuration,
  } = useContext(SidebarContext);

  const { renderExpandIcon, closeOnClick, menuItemStyles, transitionDuration } = useMenu();

  const open = $(!!defaultOpen);
  const openWhenCollapsed = $(false);
  const mounted = $(false);

  const buttonRef = $<HTMLAnchorElement>();
  const contentRef = $<HTMLDivElement>();
  const timer = $<ReturnType<typeof setTimeout>>();

  const { popperInstance } = usePopper({
    level,
    buttonRef,
    contentRef,
  });

  const slideUp = () => {
    const target = contentRef();
    if (target) {
      target.style.display = 'block';
      target.style.overflow = 'hidden';
      target.style.height = 'auto';
      const height = target.offsetHeight;
      target.style.height = '0px';
      target.offsetHeight;
      target.style.height = `${height}px`;

      timer(setTimeout(() => {
        target.style.overflow = 'auto';
        target.style.height = 'auto';
      }, transitionDuration))
    }
  };

  const slideDown = () => {
    const target = contentRef();
    if (target) {
      target.style.overflow = 'hidden';
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.height = '0px';

      timer(setTimeout(() => {
        target.style.overflow = 'auto';
        target.style.display = 'none';
      }, transitionDuration))
    }
  };

  const handleSlideToggle = (): void => {
    if (!(level === 0 && $$(collapsed))) {
      clearTimeout(Number(timer()));
      const openValue = openControlled ?? $$(open);
      openValue ? slideDown() : slideUp();
      onOpenChange?.(!openValue);
      open(!open());
    }
  };

  const handleOnClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick?.(event);
    handleSlideToggle();
  };

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
    onKeyUp?.(event);
    if (event.key === 'Enter') {
      handleSlideToggle();
    }
  };

  const getSubMenuItemStyles = (element: MenuItemElement): CSSObject | undefined => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: true, open };
      const {
        root: rootElStyles,
        button: buttonElStyles,
        label: labelElStyles,
        icon: iconElStyles,
        prefix: prefixElStyles,
        suffix: suffixElStyles,
        subMenuContent: subMenuContentElStyles,
        SubMenuExpandIcon: SubMenuExpandIconElStyles,
      } = menuItemStyles;

      switch (element) {
        case 'root':
          return typeof rootElStyles === 'function' ? rootElStyles(params) : rootElStyles;

        case 'button':
          return typeof buttonElStyles === 'function' ? buttonElStyles(params) : buttonElStyles;

        case 'label':
          return typeof labelElStyles === 'function' ? labelElStyles(params) : labelElStyles;

        case 'icon':
          return typeof iconElStyles === 'function' ? iconElStyles(params) : iconElStyles;

        case 'prefix':
          return typeof prefixElStyles === 'function' ? prefixElStyles(params) : prefixElStyles;

        case 'suffix':
          return typeof suffixElStyles === 'function' ? suffixElStyles(params) : suffixElStyles;

        case 'SubMenuExpandIcon':
          return typeof SubMenuExpandIconElStyles === 'function'
            ? SubMenuExpandIconElStyles(params)
            : SubMenuExpandIconElStyles;

        case 'subMenuContent':
          return typeof subMenuContentElStyles === 'function'
            ? subMenuContentElStyles(params)
            : subMenuContentElStyles;

        default:
          return undefined;
      }
    }
  };

  useEffect(() => {
    setTimeout(() => popperInstance()?.update(), sidebarTransitionDuration);
    if ($$(collapsed) && level === 0) {
      openWhenCollapsed(false);
      // ? if its useful to close first level submenus on collapse sidebar uncomment the code below
      open(false);
    }
  })
  useEffect(()=>{
    console.log("openWhenCollapsed", openWhenCollapsed())
  })
  useEffect(() => {
    const handleTogglePopper = (target: Node) => {
      debugger
      if (!$$(openWhenCollapsed) && buttonRef()?.contains(target)){
        openWhenCollapsed(true);
      } 
      else if (
        (closeOnClick &&
          !(target as HTMLElement)
            .closest(`.${menuClasses.menuItemRoot}`)
            ?.classList.contains(menuClasses.subMenuRoot)) ||
        (!contentRef()?.contains(target) && $$(openWhenCollapsed))
      ) {
        openWhenCollapsed(false);
      }
    };

    const handleDocumentClick = (event: MouseEvent) => {
      debugger
      handleTogglePopper(event.target as Node);
    };

    const handleDocumentKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleTogglePopper(event.target as Node);
      } else if (event.key === 'Escape') {
        openWhenCollapsed(false);
      }
    };

    const removeEventListeners = () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keyup', handleDocumentKeyUp);
    };

    removeEventListeners();

    if ($$(collapsed) && level === 0) {
      document.addEventListener('click', handleDocumentClick, false);
      document.addEventListener('keyup', handleDocumentKeyUp, false);
    }

    return () => {
      removeEventListeners();
    };
  })
  useEffect(() => {
    if (openControlled !== undefined && openControlled !== $$(open)) {
      if (!(level === 0 && collapsed)) {
        clearTimeout(Number(timer()));

        !openControlled ? slideDown() : slideUp();
        open(openControlled);
      }
    }
    // Excluded slideUp and slideDown from deps because they are not supposed to change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  useEffect(() => {
    mounted(true);
  })

  const sharedClasses = {
    [menuClasses.active]: active,
    [menuClasses.disabled]: disabled,
    [menuClasses.open]: open(),
  };

  return (
    <li
      ref={ref}
      style={{
        paddingLeft: rtl ? "20px" : `${level === 0 ? 20 : ($$(collapsed) ? level : level + 1) * 20}px`,
        paddingRight: rtl ? ` ${level === 0 ? 20 : ($$(collapsed) ? level : level + 1) * 20}px` : "20px"
      }}
      className={
        [
        menuClasses.menuItemRoot,
        menuClasses.subMenuRoot,
        sharedClasses,
        className,
        getSubMenuItemStyles('root'),
        rootStyles,
        getSubMenuItemStyles('button'),
        `relative w-full
        `
        ]
      }
      disabled={disabled}
    >
      <MenuButton
        ref={buttonRef}
        title={title}
        style={useMemo(()=>{return {
          paddingLeft: rtl ? "20px" : `${level === 0 ? 20 : ($$(collapsed) ? level : level + 1) * 20}px`,
          paddingRight: rtl ? ` ${level === 0 ? 20 : ($$(collapsed) ? level : level + 1) * 20}px` : "20px"
        }})
      }
        className={
          [
          menuClasses.button,
          sharedClasses,
          `flex items-center h-[50px] no-underline text-inherit box-border cursor-pointer hover:bg-[#f3f3f3] ${disabled ? `pointer-events-none cursor-default color-[#adadad]` : ""} ${active ? 'background-color: #e2eef9' : ""}`
        ]}
        onClick={handleOnClick}
        onKeyUp={handleOnKeyUp}
        component={component}
        tabIndex={0}
        {...rest}
      >
        {icon && (
          <span
            className={
              [
                menuClasses.icon,
                sharedClasses,
                `w-[35px] min-w-[35px] h-[35px] leading-[35px] text-center inline-flex rounded-sm items-center justify-center`,
                `${rtl ? "ml-2.5" : "mr-2.5"}`,
                getSubMenuItemStyles('icon')
              ]}
          >
            {icon}
          </span>
        )}

        {prefix && (
          <span
            style={{
              transition: `opacity ${sidebarTransitionDuration}ms`
            }}
            className={
              [
                menuClasses.prefix,
                sharedClasses,
                `${rtl ? "ml-[5px]" : "mr-[5px]"}`,
                `${(level === 0 && $$(collapsed)) ? "opacity-0": "opacity-100"}`,
                getSubMenuItemStyles('prefix') 
              ]}
          >
            {prefix}
          </span>
        )}

        <span
          className={
            [
            menuClasses.label,
            sharedClasses,
            `grow overflow-hidden text-ellipsis whitespace-nowrap`,
            getSubMenuItemStyles('label')
          ]}
        >
          {label}
        </span>

        {suffix && (
          <span
            style={{
              transition: `opacity ${sidebarTransitionDuration}ms`
            }}
            className={
              [
                menuClasses.suffix,
                sharedClasses,
                `mr-[5px] ml-[5px]`,
                `${(level === 0 && $$(collapsed)) ? "opacity-0": "opacity-100"}`,
                getSubMenuItemStyles('suffix')
              ]}
          >
            {suffix}
          </span>
        )}

        <span
          className={
            [
              menuClasses.SubMenuExpandIcon,
              sharedClasses,
              `${(!$$(collapsed) && level === 0) ? `absolute top-1/2 translate-y-[-50%] ${rtl ? "left-2.5" : "right-2.5"}` : "" }`,
              getSubMenuItemStyles('SubMenuExpandIcon')
            ]}
        >
          {useMemo(()=>{return renderExpandIcon ? 
          (
            renderExpandIcon({
              level,
              disabled,
              active,
              open: $$(open),
            })
          ) 
          : $$(collapsed) && level  === 0 ? (
            <span 
            className={"w-[5px] h-[5px] bg-current rounded-[50%] inline-block "} 
            />
          ) : (
            <span
            style={{
              transition: "transform 0.3s",
              transform: `rotate(${$$(open) ? `${rtl ? '-135deg' : '45deg'}` : '-45deg'}`
            }} 
            className={
            `inline-block w-[5px] h-[5px]
             ${rtl ? "border-solid border-l-2 border-t-2 border-current" : "border-solid border-r-2 border-b-2 border-current" }`}
            open={$$(open)}
            />
          )}
          )}
        </span>
      </MenuButton>

      <SubMenuContent
        ref={contentRef}
        openWhenCollapsed={openWhenCollapsed}
        open={open}
        firstLevel={level === 0}
        collapsed={collapsed}
        defaultOpen={(openControlled && !$$(mounted)) || defaultOpen}
        className={classnames(menuClasses.subMenuContent, sharedClasses)}
        rootStyles={getSubMenuItemStyles('subMenuContent')}
      >
        <LevelContext.Provider value={level + 1}>{children}</LevelContext.Provider>
      </SubMenuContent>
    </li>
  );
};
export const SubMenu = (SubMenuFR);
