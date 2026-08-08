export const config = {
  matcher: '/:path*'
};

export default function middleware(request) {
  const incoming = new URL(request.url);
  const cleanPath = incoming.pathname.replace(/^\/+/, '');
  const target = new URL(cleanPath, 'https://www.norbertbanhalmi.com/hu/');
  target.search = incoming.search;

  return new Response(null, {
    status: 308,
    headers: {
      Location: target.href,
      'Cache-Control': 'public, max-age=0, s-maxage=86400'
    }
  });
}
