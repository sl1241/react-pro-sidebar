import { createContext, useEffect, $, $$, useMemo, useContext } from 'voby';
// import { useMediaQuery } from '../hooks/useMediaQuery';
import { useMediaQuery } from '../../../use-voby/src/useMediaQuery/useMediaQuery';
import { sidebarClasses } from '../utils/utilityClasses';

type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always' | 'all';

const BREAK_POINTS = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
  always: 'always',
  all: 'all',
};

export interface SidebarProps extends HTMLAttributes<HTMLHtmlElement> {
  /**
   * sidebar collapsed status
   */
  collapsed?: ObservableMaybe<boolean>;

  /**
   * width of the sidebar
   * @default ```250px```
   */
  width?: string;

  /**
   * width of the sidebar when collapsed
   * @default ```80px```
   */
  collapsedWidth?: string;

  /**
 * Used to  control whether the main content is active when toggled
 * @default ```true```
 */
  activeWhenCollapsed?: ObservableMaybe<boolean>;

  /**
   * initial collapsed status
   * @default ```false```
   *
   * @deprecated use ```collapsed``` instead
   */
  defaultCollapsed?: boolean;

  /**
   * set when the sidebar should trigger responsiveness behavior
   * @type `xs | sm | md | lg | xl | xxl | all | undefined`
   */
  breakPoint?: BreakPoint;

  /**
   * alternative breakpoint value that will be used to trigger responsiveness
   *
   */
  customBreakPoint?: string;

  /**
   * sidebar background color
   */
  backgroundColor?: string;

  /**
   * duration for the transition in milliseconds to be used in collapse and toggle behavior
   * @default ```300```
   */
  transitionDuration?: number;

  /**
   * sidebar background image
   */
  image?: string;

  /**
   * sidebar direction
   */
  rtl?: boolean;

  /**
   * sidebar toggled status
   */
  toggled?: ObservableMaybe<boolean>;

  /**
   * callback function to be called when backdrop is clicked
   */
  onBackdropClick?: () => void;

  /**
   * callback function to be called when sidebar's broken state changes
   */
  onBreakPoint?: (broken: boolean) => void;

  /**
   * sidebar styles to be applied from the root element
   */
  rootStyles?: ObservableMaybe<string>;

  children?: JSX.Child;
}

// const StyledSidebar = styled.aside<StyledSidebarProps>`
//   position: relative;
//   border-right-width: 1px;
//   border-right-style: solid;
//   border-color: #efefef;

//   transition: ${({ transitionDuration }) => `width, left, right, ${transitionDuration}ms`};

//   width: ${({ width }) => width};
//   min-width: ${({ width }) => width};

// &.${sidebarClasses.collapsed} {
// width: ${({ collapsedWidth }) => collapsedWidth};
// min-width: ${({ collapsedWidth }) => collapsedWidth};
// }

//   &.${sidebarClasses.rtl} {
//     direction: rtl;
//     border-right-width: none;
//     border-left-width: 1px;
//     border-right-style: none;
//     border-left-style: solid;
//   }

// &.${sidebarClasses.broken} {
//   position: fixed;
//   height: 100%;
//   top: 0px;
//   z-index: 100;

// ${({ rtl, width }) => (!rtl ? `left: -${width};` : '')}

// &.${sidebarClasses.collapsed} {
//   ${({ rtl, collapsedWidth }) => (!rtl ? `left: -${collapsedWidth}; ` : '')}
// }

// &.${sidebarClasses.toggled} {
//   ${({ rtl }) => (!rtl ? `left: 0;` : '')}
// }

// &.${sidebarClasses.rtl} {
//   right: -${({ width }) => width};

// &.${sidebarClasses.collapsed} {
//   right: -${({ collapsedWidth }) => collapsedWidth};
// }

//     &.${sidebarClasses.toggled} {
//       right: 0;
//     }
//   }
// }

// ${({ rootStyles }) => rootStyles}
// `;



interface SidebarContextProps {
  collapsed?: ObservableMaybe<boolean>;
  toggled?: ObservableMaybe<boolean>;
  rtl?: boolean;
  transitionDuration?: number;
}

export const SidebarContext = createContext<SidebarContextProps>({
  collapsed: false,
  toggled: false,
  rtl: false,
  transitionDuration: 300,
});

export const Sidebar = (
  {
    collapsed,
    toggled,
    onBackdropClick,
    onBreakPoint,
    width = '250px',
    collapsedWidth = '80px',
    activeWhenCollapsed,
    defaultCollapsed,
    className,
    children,
    breakPoint,
    customBreakPoint,
    backgroundColor = 'bg-[#F9F9F9]/[0.7]',
    transitionDuration = 300,
    image,
    rtl,
    rootStyles,
    ref,
    ...rest
  }: SidebarProps
) => {
  const getBreakpointValue = () => {
    if (customBreakPoint) {
      return `(max-width: ${customBreakPoint})`;
    }

    if (breakPoint) {
      if (['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(breakPoint)) {
        return `(max-width: ${BREAK_POINTS[breakPoint]})`;
      }

      if (breakPoint === 'always' || breakPoint === 'all') {
        if (breakPoint === 'always') {
          console.warn(
            'The "always" breakPoint is deprecated and will be removed in future release. ' +
            'Please use the "all" breakPoint instead.',
          );
        }
        return `screen`;
      }

      return `(max-width: ${breakPoint})`;
    }
  };

  const breakpointCallbackFnRef = (broken: boolean) => {
    onBreakPoint?.(broken);
  }

  const broken = useMediaQuery(getBreakpointValue());
  const mounted = $(false)
  const active = activeWhenCollapsed ?? $(true)

  const collapsedValue = collapsed ?? mounted()
  const handleBackdropClick = () => {
    onBackdropClick?.();
    // legacySidebarContext?.updateSidebarState({ toggled: false });
  };

  useEffect(() => {
    breakpointCallbackFnRef(broken());
  },);

  return (
    <SidebarContext.Provider
      value={{ collapsed: collapsedValue, toggled: toggled, rtl, transitionDuration }}
    >
      <aside
        ref={ref}
        rtl={rtl}

        style={{
          position: () => $$(broken) ? "fixed" : "",
          height: () => $$(broken) ? "100%" : "",
          top: () => $$(broken) ? "0px" : "",
          zIndex: () => $$(broken) && $(active) ? "100" : "0",
          width: () => $$(collapsedValue) ? collapsedWidth : width,
          minWidth: () => $$(collapsedValue) ? collapsedWidth : width,
          transition: `width , left, right , all ${transitionDuration}ms 0s`,
          direction: () => rtl ? "rtl" : "ltr",
          right: () => $$(broken) ? "80px" : "",
          left: () =>
            ($$(broken) && !$$(toggled) && !rtl) ? "-" + width : ($$(collapsed) && !rtl && $$(broken))
              ? "-" + collapsedWidth : ($$(broken) && $$(toggled) && !rtl)
                ? "0px" : "ps-collapsed",
        }
        }
        className={
          [
            rootStyles,
            className,
            `border-r-[1px] border-solid border-[#efefef]`,
          ]}
        {...rest}
      >
        <div
          className={`relative h-full overflow-y-auto overflow-x-hidden z-[3] ${backgroundColor ? `${backgroundColor}` : ''} `}
        >
          {children}
        </div>

        {image && (
          <img
            src={image}
            alt="sidebar background"
            className={sidebarClasses.image}
          />
        )}

        {useMemo(() => {
          return !$$(active) && $$(broken) && $$(toggled) && (
            <div
              role="button"
              tabIndex={0}
              aria-label="backdrop"
              onClick={handleBackdropClick}
              onKeyPress={handleBackdropClick}
              className={sidebarClasses.backdrop}
            />
          )
        })
        }
      </aside>
    </SidebarContext.Provider >
  );
}