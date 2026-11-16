export const loadFont = async ({ family, url, weight }: { family: string; url: string; weight?: string }) => {
  const f = new FontFace(family, `url(${url})`, { weight: weight ?? "400" });
  await f.load();
  (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
};
