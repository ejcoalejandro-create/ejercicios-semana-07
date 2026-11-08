export async function GET() {
  return Response.json({
    abierto: true,
    cafesDisponibles: 4,
    proximaCata: '2026-11-26',
  });
}