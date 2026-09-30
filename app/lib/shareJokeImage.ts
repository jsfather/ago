import type { JokeResponse } from '../components/JokeComponent';

/** Render the same warm card palette and typeface in downloaded/shared images. */
export async function shareJokeImage(joke: JokeResponse) {
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const family = getComputedStyle(document.body).fontFamily;
  const tokens = getComputedStyle(document.documentElement);
  const color = (name: string) => tokens.getPropertyValue(name).trim();
  const wrap = (text: string) =>
    text.split('\n').flatMap((paragraph) => {
      const lines: string[] = [];
      let line = '';
      for (const word of paragraph.split(' ')) {
        const next = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(next).width > 376) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      return [...lines, line];
    });
  ctx.font = `18px ${family}`;
  const setup = wrap(
    joke.type === 'single' ? (joke.joke ?? '') : (joke.setup ?? '')
  );
  const delivery = joke.type === 'twopart' ? wrap(joke.delivery ?? '') : [];
  const flags = Object.keys(joke.flags).filter((flag) => joke.flags[flag]);
  const flagLines = flags.length ? wrap(flags.join(' · ')) : [];
  const height =
    190 +
    (setup.length + delivery.length + flagLines.length) * 32 +
    (delivery.length ? 32 : 0);
  canvas.width = 960;
  canvas.height = height * 2;
  ctx.scale(2, 2);
  ctx.fillStyle = color('--primary-bg');
  ctx.fillRect(0, 0, 480, height);
  ctx.fillStyle = color('--surface');
  ctx.beginPath();
  ctx.roundRect(20, 20, 440, height - 40, 24);
  ctx.fill();
  ctx.strokeStyle = color('--border');
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.font = `14px ${family}`;
  ctx.fillStyle = color('--text-secondary');
  ctx.fillText(joke.category, 240, 65);
  ctx.font = `18px ${family}`;
  ctx.direction = joke.lang === 'fa' ? 'rtl' : 'ltr';
  ctx.fillStyle = color('--text-primary');
  let y = 108;
  setup.forEach((line) => {
    ctx.fillText(line, 240, y, 376);
    y += 32;
  });
  if (delivery.length) {
    ctx.fillStyle = color('--surface-muted');
    ctx.beginPath();
    ctx.roundRect(40, y - 10, 400, delivery.length * 32 + 20, 12);
    ctx.fill();
    y += 14;
    ctx.fillStyle = color('--text-primary');
    delivery.forEach((line) => {
      ctx.fillText(line, 240, y, 376);
      y += 32;
    });
    y += 18;
  }
  ctx.fillStyle = color('--text-secondary');
  ctx.font = `12px ${family}`;
  ctx.direction = 'ltr';
  flagLines.forEach((line) => {
    ctx.fillText(line, 240, y, 376);
    y += 32;
  });
  ctx.font = 'bold 22px Georgia';
  ctx.fillStyle = color('--accent');
  ctx.fillText('ago.', 240, height - 46);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value ? resolve(value) : reject(new Error('Image export failed')),
      'image/png'
    )
  );
  const file = new File([blob], `ago-joke-${joke.id}.png`, {
    type: 'image/png',
  });
  const shareData = {
    files: [file],
    title: 'ago',
    text:
      joke.type === 'single' ? joke.joke : `${joke.setup}\n${joke.delivery}`,
  };
  if (navigator.canShare?.(shareData) && navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
