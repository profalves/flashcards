export default function MainContainer({children}: {children: React.ReactNode}) {
  return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">{children}</div>;
}