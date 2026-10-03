export const getYouTubeId = (url: string): string | null => {
  const match = url
    .trim()
    .match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
    );
  return match ? match[1] : null;
};

export const getYouTubeThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
