import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#000000',
  pillColor = '#ffffff',
  hoveredPillTextColor = '#ffffff',
  pillTextColor,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<any | null>>([]);
  const activeTweenRefs = useRef<Array<any | null>>([]);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const gsapRef = useRef<any | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - Math.ceil(delta);

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (gsapRef.current) {
          const gsap = gsapRef.current;

          gsap.set(circle, {
            xPercent: -50,
            scale: 0,
            transformOrigin: `50% ${originY}px`
          });

          if (label) gsap.set(label, { y: 0 });
          if (white) gsap.set(white, { y: h + 12, opacity: 0 });

          const index = circleRefs.current.indexOf(circle);
          if (index === -1) return;

          tlRefs.current[index]?.kill?.();
          const tl = gsap.timeline({ paused: true });

          tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

          if (label) {
            tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
          }

          if (white) {
            gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
            tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
          }

          tlRefs.current[index] = tl;
        } else {
          // Fallback (no GSAP): setup basic inline transforms/transitions for CSS-based hover
          circle.style.transform = `translateX(-50%) scale(0)`;
          circle.style.transformOrigin = `50% ${originY}px`;
          circle.style.transition = 'transform 0.25s ease';

          if (label) {
            label.style.transform = 'translateY(0)';
            label.style.transition = 'transform 0.25s ease';
          }

          if (white) {
            white.style.transform = `translateY(${h + 12}px)`;
            white.style.opacity = '0';
            white.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
          }
        }
      });
    };

    // Try to dynamically import GSAP; if not available, we'll gracefully fall back
    (async () => {
      try {
        // @ts-ignore - dynamic import of optional dependency
        // Build package name dynamically so Vite can't statically analyze it
        const pkgName = 'g' + 'sap';
        // @vite-ignore - prevent Vite from pre-resolving this optional package
        // @ts-ignore
        const mod = await import(/* @vite-ignore */ (pkgName as any));
        gsapRef.current = mod.gsap || (mod as any).default || mod;
        // Re-run layout once gsap is available
        layout();
      } catch (err) {
        // GSAP not installed — fallback behavior will be used
        // console.warn('GSAP not available — PillNav will use CSS fallbacks');
      }
    })();

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    if (initialLoadAnimation) {
      const navItems = navItemsRef.current;

      if (gsapRef.current && navItems) {
        const gsap = gsapRef.current;
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease
        });
      } else if (navItems) {
        navItems.style.width = 'auto';
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (tl && gsapRef.current) {
      activeTweenRefs.current[i]?.kill?.();
      activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
        duration: 0.3,
        ease,
        overwrite: 'auto'
      });
      return;
    }

    // Fallback: inline CSS transforms
    const circle = circleRefs.current[i];
    if (!circle || !circle.parentElement) return;
    const pill = circle.parentElement as HTMLElement;
    const h = pill.getBoundingClientRect().height;
    const label = pill.querySelector<HTMLElement>('.pill-label');
    const white = pill.querySelector<HTMLElement>('.pill-label-hover');

    circle.style.transition = 'transform 0.28s ease';
    circle.style.transform = 'translateX(-50%) scale(1.2)';
    if (label) label.style.transform = `translateY(-${h + 8}px)`;
    if (white) {
      white.style.transition = 'transform 0.28s ease, opacity 0.28s ease';
      white.style.transform = 'translateY(0px)';
      white.style.opacity = '1';
    }
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (tl && gsapRef.current) {
      activeTweenRefs.current[i]?.kill?.();
      activeTweenRefs.current[i] = tl.tweenTo(0, {
        duration: 0.2,
        ease,
        overwrite: 'auto'
      });
      return;
    }

    // Fallback: revert inline transforms
    const circle = circleRefs.current[i];
    if (!circle || !circle.parentElement) return;
    const pill = circle.parentElement as HTMLElement;
    const label = pill.querySelector<HTMLElement>('.pill-label');
    const white = pill.querySelector<HTMLElement>('.pill-label-hover');

    circle.style.transition = 'transform 0.2s ease';
    circle.style.transform = 'translateX(-50%) scale(0)';
    if (label) label.style.transform = 'translateY(0)';
    if (white) {
      white.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      const rect = pill.getBoundingClientRect();
      white.style.transform = `translateY(${rect.height + 12}px)`;
      white.style.opacity = '0';
    }
  };

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px'
  } as React.CSSProperties;

  return (
    <div ref={navItemsRef} className={`relative items-center rounded-full hidden md:flex ml-2 ${className}`} style={{ height: 'var(--nav-h)', background: 'var(--base, #000)', ...cssVars }}>
      <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full" style={{ gap: 'var(--pill-gap)' }}>
        {items.map((item, i) => {
          const isActive = activeHref === item.href;

          const pillStyle: React.CSSProperties = {
            background: 'var(--pill-bg, #fff)',
            color: 'var(--pill-text, var(--base, #000))',
            paddingLeft: 'var(--pill-pad-x)',
            paddingRight: 'var(--pill-pad-x)'
          };

          const PillContent = (
            <>
              <span
                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                style={{ background: 'var(--base, #000)', willChange: 'transform' }}
                aria-hidden="true"
                ref={el => {
                  circleRefs.current[i] = el;
                }}
              />
              <span className="label-stack relative inline-block leading-[1] z-[2]">
                <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>
                  {item.label}
                </span>
                <span className="pill-label-hover absolute left-0 top-0 z-[3] inline-block" style={{ color: 'var(--hover-text, #fff)', willChange: 'transform, opacity' }} aria-hidden="true">
                  {item.label}
                </span>
              </span>
              {isActive && (
                <span className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]" style={{ background: 'var(--base, #000)' }} aria-hidden="true" />
              )}
            </>
          );

          const basePillClasses = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

          return (
            <li key={item.href} role="none" className="flex h-full">
              {item.href && item.href.startsWith('/') ? (
                <Link role="menuitem" to={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)}>
                  {PillContent}
                </Link>
              ) : (
                <a role="menuitem" href={item.href} className={basePillClasses} style={pillStyle} aria-label={item.ariaLabel || item.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={() => handleLeave(i)}>
                  {PillContent}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PillNav;
