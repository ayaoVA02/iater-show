import { useRef, useState } from "react";
import { isMobile } from "react-device-detect";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const ImageZoom = ({ src, alt, className }) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDown, setIsDown] = useState(false);

  const containerRef = useRef(null);
  const pointers = useRef(new Map());
  const initialDistance = useRef(null);
  const initialScale = useRef(1);
  const lastPan = useRef({ x: 0, y: 0 });

  const openModal = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setOpen(false);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pointers.current.clear();
    initialDistance.current = null;
    initialScale.current = 1;
    lastPan.current = { x: 0, y: 0 };
    setIsDown(false);
    document.body.style.overflow = "";
  };

  const getDistance = (p1, p2) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  const MIN_SCALE = 1;
  const MAX_SCALE = 2; // reduce max zoom for desktop
  const DOUBLE_CLICK_SCALE = 1.6;

  const clampTranslate = (t, s, rect) => {
    if (!rect) return t;
    const cw = rect.width;
    const ch = rect.height;
    const maxX = Math.max(0, (cw * (s - 1)) / 2 + 20); // small buffer
    const maxY = Math.max(0, (ch * (s - 1)) / 2 + 20);
    return { x: clamp(t.x, -maxX, maxX), y: clamp(t.y, -maxY, maxY) };
  };

  const onWheel = (e) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const delta = -e.deltaY;
  const factor = delta > 0 ? 1.06 : 0.94; // gentler zoom
  const oldScale = scale;
  const nextScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);

    // Zoom towards cursor position
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const scaleRatio = nextScale / oldScale;
    const newTx = (translate.x - offsetX) * scaleRatio + offsetX;
    const newTy = (translate.y - offsetY) * scaleRatio + offsetY;

    const clamped = clampTranslate({ x: newTx, y: newTy }, nextScale, rect);
    setScale(nextScale);
    setTranslate(clamped);
  };

  const onPointerDown = (e) => {
    if (!open) return;
    e.target.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setIsDown(true);

    // initialize lastPan for single pointer
    if (pointers.current.size === 1) {
      lastPan.current = { x: e.clientX, y: e.clientY };
    }

    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      initialDistance.current = getDistance(pts[0], pts[1]);
      initialScale.current = scale;
    }
  };

  const onPointerMove = (e) => {
    if (!open) return;
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const dist = getDistance(pts[0], pts[1]);
      if (initialDistance.current) {
        const ratio = dist / initialDistance.current;
        const next = clamp(initialScale.current * ratio, MIN_SCALE, MAX_SCALE);
        setScale(next);
      }
    } else if (pointers.current.size === 1) {
      // panning when zoomed
      if (scale <= 1) return;
      const pt = pointers.current.values().next().value;
      const dx = pt.x - lastPan.current.x;
      const dy = pt.y - lastPan.current.y;
      lastPan.current = { x: pt.x, y: pt.y };
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTranslate((t) => clampTranslate({ x: t.x + dx, y: t.y + dy }, scale, rect));
    }
  };

  const onPointerUp = (e) => {
    try {
      e.target.releasePointerCapture?.(e.pointerId);
    } catch (err) {}
    pointers.current.delete(e.pointerId);
    setIsDown(false);
    if (pointers.current.size < 2) {
      initialDistance.current = null;
      initialScale.current = scale;
    }
    if (pointers.current.size === 1) {
      const pt = pointers.current.values().next().value;
      if (pt) lastPan.current = { x: pt.x, y: pt.y };
    }
  };

  const onDoubleClick = (e) => {
    if (!open) {
      openModal();
      return;
    }
    // toggle between 1 and 2; center on click
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return setScale((s) => (s > 1 ? 1 : 2));
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    setScale((s) => {
      const next = s > 1 ? 1 : DOUBLE_CLICK_SCALE;
      const ratio = next / s;
      const newTx = (translate.x - offsetX) * ratio + offsetX;
      const newTy = (translate.y - offsetY) * ratio + offsetY;
      const clamped = clampTranslate({ x: newTx, y: newTy }, next, rect);
      setTranslate(clamped);
      return next;
    });
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className || ""} cursor-zoom-in`}
        onClick={openModal}
        onDoubleClick={onDoubleClick}
      />

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 text-white text-2xl z-60"
            onClick={closeModal}
          >
            ✕
          </button>

          <div
            ref={containerRef}
            style={{
              touchAction: "none",
              maxWidth:  isMobile ? "100%" : "50%" ,
              maxHeight: "100%",
            //   overflow: "hidden",
              cursor: scale > 1 ? (isDown ? "grabbing" : "grab") : "auto",
            }}
          >
            <img
              src={src}
              alt={alt}
              draggable={false}
              style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                transition: "transform 0ms",
                willChange: "transform",
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                margin: "0 auto",
                userSelect: "none",
                touchAction: "none",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageZoom;
