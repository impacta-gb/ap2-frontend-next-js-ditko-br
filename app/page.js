export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-xl flex-col items-center justify-between py-16 px-36 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-7xl text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Lost & Found
          </h1>
          <p className="max-w-md text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Sistema de Achados e Perdidos
          </p>
        </div>
      </main>
    </div>
  );
}
