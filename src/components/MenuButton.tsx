import classNames from 'classnames';
import { cloneElement, createElement } from 'voby';

interface MenuButtonProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix'> {
  component?: string | React.ReactElement;
  children?: React.ReactNode;
}

interface MenuButtonStylesProps {
  level: number;
  collapsed?: boolean;
  rtl?: boolean;
  disabled?: boolean;
  active?: boolean;
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  const { rtl, level, collapsed, disabled, active } = props;

  return `
    flex 
    items-center 
    h-[50px] 
    no-underline
    text-inherit
    box-border
    cursor-pointer

    ${rtl ? `pl-5
           padding-right: ${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px;
            `
      : `pr-5
           padding-left: ${level === 0 ? 20 : (collapsed ? level : level + 1) * 20}px;
           `
    }

    hover:bg-[#f3f3f3]

    ${disabled &&
    ` 
      pointer-events-none
      cursor-default
      color-[#adadad]
        `
    }

    ${active && 'background-color: #e2eef9;'}
  
  `;
};

export const MenuButtonRef = (
  { className, component, children, ref, ...rest }: MenuButtonProps,
) => {
  if (component) {
    if (typeof component === 'string') {
      return createElement(
        component,
        {
          className: classNames(className),
          ...rest,
          ref,
        },
        children,
      );
    } else {
      const { className: classNameProp, ...props } = component.props;

      return cloneElement(
        component,
        {
          className: classNames(className, classNameProp),
          ...rest,
          ...props,
          ref,
        },
        children,
      );
    }
  } else {
    return (
      <a ref={ref} className={classNames(className)} {...rest}>
        {children}
      </a>
    );
  }
};

export const MenuButton = (MenuButtonRef);
