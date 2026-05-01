export const onRequestGet: PagesFunction<{ IMAGES: R2Bucket; images: R2Bucket }> = async (context) => {
  const IMAGES = context.env.IMAGES || context.env.images;
  const key = context.params.key as string;

  if (!IMAGES) {
    return new Response('R2 bucket not found', { status: 500 });
  }

  const object = await IMAGES.get(key);

  if (!object) {
    return new Response('Image not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000');

  return new Response(object.body, {
    headers,
  });
};
