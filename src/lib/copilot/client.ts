const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.86;

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Sem conexão com o Charles. Confere a internet e tenta de novo.");
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data ? String(data.error) : null;
    throw new Error(message ?? "Não consegui falar com o Charles agora.");
  }
  return data as T;
}

export async function toJpegDataUrl(source: Blob) {
  const bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Seu navegador não conseguiu abrir a foto.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function urlToJpegDataUrl(url: string) {
  const response = await fetch(url);
  return toJpegDataUrl(await response.blob());
}
