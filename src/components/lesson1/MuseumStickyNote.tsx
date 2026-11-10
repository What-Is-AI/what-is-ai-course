"use client";

import type { ReactNode } from "react";
import { useT } from "@/i18n/LocaleProvider";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Rnd } from "react-rnd";

export type StickyNoteData = {
  id: string;
  title: string;
  body: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
};

type Props = {
  note: StickyNoteData;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onResizeStop: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => void;
  /** Override default lesson1 close aria label. */
  closeAriaLabel?: string;
};

export function MuseumStickyNote({
  note,
  onClose,
  onFocus,
  onDragStop,
  onResizeStop,
  closeAriaLabel,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const t = useT();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Portal + fixed shell: escape MuseumFrame transforms so notes stay on
  // screen while scrolling (fixed inside a transformed ancestor is broken).
  return createPortal(
    <div
      className="museum-sticky-layer"
      style={{ zIndex: note.zIndex }}
    >
      <Rnd
        className="museum-sticky"
        size={{ width: note.width, height: note.height }}
        position={{ x: note.x, y: note.y }}
        minWidth={240}
        minHeight={160}
        bounds="parent"
        dragHandleClassName="museum-sticky-handle"
        enableResizing={{
          bottom: true,
          bottomLeft: true,
          bottomRight: true,
          left: true,
          right: true,
          top: true,
          topLeft: true,
          topRight: true,
        }}
        onMouseDown={() => onFocus(note.id)}
        onDragStart={() => onFocus(note.id)}
        onResizeStart={() => onFocus(note.id)}
        onDragStop={(_e, d) => onDragStop(note.id, d.x, d.y)}
        onResizeStop={(_e, _dir, ref, _delta, position) =>
          onResizeStop(
            note.id,
            ref.offsetWidth,
            ref.offsetHeight,
            position.x,
            position.y,
          )
        }
      >
        <div className="museum-sticky-inner">
          <header className="museum-sticky-handle">
            <p className="museum-sticky-title">{note.title}</p>
            <button
              type="button"
              className="museum-sticky-close"
              aria-label={
                closeAriaLabel ??
                t("lesson1.reveal.closeNoteAria", {
                  title: note.title,
                })
              }
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onClose(note.id);
              }}
            >
              ×
            </button>
          </header>
          <div className="museum-sticky-body">{note.body}</div>
        </div>
      </Rnd>
    </div>,
    document.body,
  );
}
