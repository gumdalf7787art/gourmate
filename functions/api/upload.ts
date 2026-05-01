export const onRequestPost: PagesFunction<{ IMAGES: R2Bucket; images: R2Bucket; R2_PUBLIC_URL: string }> = async (context) => {
  try {
    const IMAGES = context.env.IMAGES || context.env.images;
    const { R2_PUBLIC_URL } = context.env;
    
    if (!IMAGES) {
      return new Response(JSON.stringify({ error: 'R2 버킷(IMAGES)이 설정되지 않았습니다.' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await context.request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: '파일이 없습니다.' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 파일 확장자 추출
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${crypto.randomUUID()}.${extension}`;

    // R2에 업로드
    await IMAGES.put(filename, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // 공개 URL 생성 (환경 변수가 없으면 일단 파일명만 반환)
    const url = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${filename}` : `/api/images/${filename}`;

    return new Response(JSON.stringify({ 
      success: true, 
      url: url,
      key: filename
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
