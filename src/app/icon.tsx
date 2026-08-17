import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 48,
  height: 48,
};
export const contentType = 'image/png';
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d4af37', // gold-500
          border: '3px solid #d4af37',
          borderRadius: '50%',
          fontWeight: 'bold',
          fontFamily: 'serif',
        }}
      >
        SWC
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
