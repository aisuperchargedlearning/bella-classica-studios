export interface AudioTrack {
  id: string;
  kind: 'narration' | 'song';
  title: string;
  subtitle: string;
  url: string;
  playLabel: string;
}

export interface ChapterImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface ChapterContent {
  series: string;
  novel: string;
  chapterLabel: string;
  chapterTitle: string;
  introduction: string;
  narration: AudioTrack;
  song: AudioTrack;
  leadImage: ChapterImage | null;
  images: ChapterImage[];
}
