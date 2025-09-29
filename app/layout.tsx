export const metadata = {
  title: "p5.js Mini Editor",
  description: "Editor + live p5 canvas + Bluesky post",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
