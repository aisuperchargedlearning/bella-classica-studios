import { useCallback, useRef, useState } from 'react';
import AudioPlayer from './components/AudioPlayer';
import ChapterGallery from './components/ChapterGallery';
import chapterData from './content/chapter-one.json';
import studio from './content/studio.json';
import type { ChapterContent } from './content/types';

const chapter = chapterData as ChapterContent;

function Wordmark({ compact = false }: { compact?: boolean }) {
  return <span className={`wordmark${compact ? ' wordmark--compact' : ''}`}><span>Bella Classica</span><span>Studios</span></span>;
}

export default function App() {
  const audioElements = useRef(new Map<string, HTMLAudioElement>());
  const [heroFailed, setHeroFailed] = useState(false);
  const register = useCallback((id: string, audio: HTMLAudioElement) => {
    audioElements.current.set(id, audio);
    return () => { audio.pause(); audioElements.current.delete(id); };
  }, []);
  const activate = useCallback((id: string) => {
    for (const [otherId, audio] of audioElements.current) if (otherId !== id) audio.pause();
  }, []);

  return <>
    <a className="skip-link" href="#chapter-one">Skip to Chapter One</a>
    <header className="site-header">
      <a href="#home" className="brand" aria-label={`${studio.name} home`}><Wordmark /></a>
      <nav aria-label="Main navigation"><a href="#chapter-one"><span className="nav-desktop-title">The Ferrari Accord</span><span className="nav-mobile-title">Chapter One</span></a><a href="#studio">The Studio</a></nav>
      <span className="header-note">Art · History · Stories</span>
    </header>

    <main id="home">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-art" aria-hidden="true">
          {!heroFailed && <img src={studio.heroImage} alt="" fetchPriority="high" onError={() => setHeroFailed(true)} />}
        </div>
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">Bella Classica Studios presents</p>
          <h1 id="hero-heading">Stories for<br /><em>tomorrow.</em></h1>
          <span className="hero-rule" aria-hidden="true" />
          <p className="hero-description">Art, history, and the human story.<br />Brought to life through words and music.</p>
          <a className="hero-link" href="#chapter-one">Discover the first chapter</a>
        </div>
        <div className="hero-bottom"><span>Old-world depth. A new way to experience it.</span><span className="hero-edition">The Bella Classica Series</span></div>
      </section>

      <section className="chapter-section" id="chapter-one" aria-labelledby="novel-heading">
        <div className="section-line"><p className="eyebrow">A first listen</p><span className="quiet-label">The story begins here</span></div>
        <div className="chapter-layout">
          <div className="chapter-intro">
            <p className="eyebrow series-label">{chapter.series}</p>
            <h2 id="novel-heading">{chapter.novel}</h2>
            <div className="chapter-caption"><span className="chapter-number" aria-hidden="true">01</span><div><p>{chapter.chapterLabel}</p>{chapter.chapterTitle && <p className="chapter-title">{chapter.chapterTitle}</p>}</div></div>
            <p className="chapter-description">{chapter.introduction}</p>
            <p className="listening-note">Choose your listening experience.<br />You can switch between the story and the song at any time.</p>
          </div>
          <div className="chapter-players">
            <AudioPlayer track={chapter.narration} register={register} activate={activate} />
            <AudioPlayer track={chapter.song} register={register} activate={activate} />
          </div>
        </div>
        <ChapterGallery lead={chapter.leadImage} images={chapter.images} />
        <div className="chapter-end" aria-hidden="true"><span /><i>BC</i><span /></div>
      </section>

      <section className="studio-section" id="studio" aria-labelledby="studio-heading">
        <div className="studio-label"><p className="eyebrow">Behind the stories</p><span className="studio-index" aria-hidden="true">B / C</span></div>
        <div className="studio-copy"><h2 id="studio-heading">A cultivated eye.<br /><em>A human perspective.</em></h2><p>{studio.about}</p></div>
      </section>
    </main>
    <footer className="site-footer"><a href="#home" className="brand" aria-label="Return to the top"><Wordmark compact /></a><p>Art. History. Stories for tomorrow.</p><span>© {new Date().getFullYear()} {studio.name}</span></footer>
  </>;
}
