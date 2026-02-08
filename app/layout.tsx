import "./globals.css";

export const metadata = {
  title: "Controle Financeiro",
  description: "App financeiro pessoal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
