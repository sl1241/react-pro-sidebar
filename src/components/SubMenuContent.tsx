import { useMenu } from '../hooks/useMenu';
import { $, $$ } from 'voby';

interface SubMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  transitionDuration?: number;
  open?: ObservableMaybe<boolean>;
  openWhenCollapsed?: ObservableMaybe<boolean>;
  firstLevel?: boolean;
  collapsed?: ObservableMaybe<boolean>;
  defaultOpen?: boolean;
  rootStyles?: ObservableMaybe<string>;
  children?: JSX.Child
}


const SubMenuContentFR = (
  { children, open, openWhenCollapsed, firstLevel, collapsed, defaultOpen, ref, ...rest }: SubMenuContentProps,
) => {
  const { transitionDuration } = useMenu();
  const defaultOpenState = $(defaultOpen)

  return (
    <div
      style={{
        display: () => ($$(collapsed) && firstLevel) ? "block" : "none",
        transition: () => ($$(collapsed) && firstLevel) ? "none" : `height ${transitionDuration}ms`,
        boxShadow: () => ($$(collapsed) && firstLevel) ? "0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d" : "",
        height: () => ($$(collapsed) && firstLevel && defaultOpen) ? "auto" : "",
        position: () => ($$(collapsed) && firstLevel) ? "fixed" : "static",
        paddingLeft: () => ($$(collapsed) && firstLevel) ? "0px" : "",
        width: () => ($$(collapsed) && firstLevel) ? "200px" : "",
        borderRadius: () => ($$(collapsed) && firstLevel) ? "4px" : "",
        visibility: () => $$(open) ? "visible" : "hidden",
        transform: () => (!$$(collapsed) && !firstLevel) ? "none" : ""
      }
      }
      className={
        [
          `overflow-hidden z-[999] box-border bg-white`,
        ]
      }
      ref={ref}
      {...rest}
    >
      <ul className={"list-none p-0 m-0"}>
        {children}
      </ul>
    </div>
  );
};

export const SubMenuContent = (SubMenuContentFR);
