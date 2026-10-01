import { useEffect, useRef, useState } from 'react';
import type { ChapterImage } from '../content/types';
import Icon from './Icon';

function Artwork({ image, eager = false }: { image: ChapterImage; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  return failed
    ? <div className="image-unavailable">This image is temporarily unavailable.</div>
    : <img src={image.src} alt={image.alt} loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />;
}

export default function ChapterGallery({ lead, images }: { lead: ChapterImage | null; images: ChapterImage[] }) {
  const [selected, setSelected] = useState<ChapterImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [selected]);

  function open(image: ChapterImage, element: HTMLElement) {
    trigger.current = element;
    setSelected(image);
  }

  function close() {
    setSelected(null);
    trigger.current?.focus();
  }

  if (!lead && !images.length) return null;

  return <section className="chapter-gallery" aria-label="Chapter One images">
    <div className="section-line"><span className="eyebrow">Through the lens</span><span className="quiet-label">Images from Chapter One</span></div>
    {lead && <figure className="lead-artwork">
      <button className="artwork-button" onClick={(event) => open(lead, event.currentTarget)} aria-label={`Enlarge image: ${lead.alt}`}>
        <Artwork image={lead} /><span className="expand-icon"><Icon name="expand" /></span>
      </button>
      {(lead.caption || lead.credit) && <figcaption>{lead.caption}{lead.credit && <span className="image-credit">{lead.credit}</span>}</figcaption>}
    </figure>}
    {!!images.length && <div className="gallery-grid">{images.map((item, index) => <figure key={`${item.src}-${index}`}>
      <button className="artwork-button" onClick={(event) => open(item, event.currentTarget)} aria-label={`Enlarge image: ${item.alt}`}>
        <Artwork image={item} /><span className="expand-icon"><Icon name="expand" /></span>
      </button>
      {(item.caption || item.credit) && <figcaption>{item.caption}{item.credit && <span className="image-credit">{item.credit}</span>}</figcaption>}
    </figure>)}</div>}
    <dialog className="lightbox" ref={dialog} onCancel={(event) => { event.preventDefault(); close(); }} onClose={close} aria-label={selected?.caption || 'Chapter artwork'} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <button className="icon-button lightbox-close" aria-label="Close enlarged image" onClick={close} autoFocus><Icon name="close" /></button>
      {selected && <figure><Artwork image={selected} eager /><figcaption>{selected.caption || selected.alt}{selected.credit && <span className="image-credit">{selected.credit}</span>}</figcaption></figure>}
    </dialog>
  </section>;
}
