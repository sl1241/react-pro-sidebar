export const sidebarClasses = {
  root: "relative border-r-2 border-gray-200",
  container: "relative h-full overflow-y-auto overflow-x-hidden z-3",
  image: "w-full h-full object-cover object-center absolute inset-0 z-2",
  backdrop: "fixed top-0 bottom-0 z-10 bg-black opacity-30",
  collapsed: 'ps-collapsed',
  toggled: 'ps-toggled',
  rtl: '[direction-rtl] border-r-[none] border-l-[1px] [border-right-style:none] [border-left-style:solid] ',
  broken: 'ps-broken',
};

export const menuClasses = {
  root: 'ps-menu-root',
  menuItemRoot: 'ps-menuitem-root',
  subMenuRoot: 'ps-submenu-root',
  button: 'ps-menu-button',
  prefix: 'ps-menu-prefix',
  suffix: 'ps-menu-suffix',
  label: 'ps-menu-label',
  icon: 'ps-menu-icon',
  subMenuContent: 'ps-submenu-content',
  SubMenuExpandIcon: 'ps-submenu-expand-icon',
  disabled: 'ps-disabled',
  active: 'ps-active',
  open: 'ps-open',
};
