import { createPopper } from '@popperjs/core';
import { SidebarContext } from '../components/Sidebar';
import { $$,$, useContext, useEffect } from 'voby';

interface PopperOptions {
  level: number;
  buttonRef: ObservableMaybe<HTMLAnchorElement>;
  contentRef: ObservableMaybe<HTMLDivElement>;
}

interface PopperResult {
  popperInstance?: ObservableMaybe<ReturnType<typeof createPopper>>
}

export const usePopper = (options: PopperOptions): PopperResult => {
  const { level, buttonRef, contentRef } = options;

  const { collapsed, toggled, transitionDuration } = useContext(SidebarContext);
  const popperInstanceRef = $<ReturnType<typeof createPopper> | undefined>();

  /**
   * create popper instance only on first level submenu components and when sidebar is collapsed
   */
  useEffect(() => {
    if (level === 0 && $$(collapsed) && $$(contentRef) && $$(buttonRef)) {
      popperInstanceRef(createPopper($$(buttonRef), $$(contentRef), {
        placement: 'right',
        strategy: 'fixed',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ],
      })
      )
    }

    return () => popperInstanceRef()?.destroy();
  })
  /**
   * update popper instance (position) when buttonRef or contentRef changes
   */
  useEffect(() => {
    if ($$(contentRef) && $$(buttonRef)) {
      const ro = new ResizeObserver(() => {
        popperInstanceRef()?.update();
      });

      ro.observe($$(contentRef));
      ro.observe($$(buttonRef));
    }

    setTimeout(() => {
      popperInstanceRef()?.update();
    }, transitionDuration);
  })

  return { popperInstance: popperInstanceRef };
};
