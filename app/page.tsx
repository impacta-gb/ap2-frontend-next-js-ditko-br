type HomeCopy = {
  title: string;
  subtitle: string;
};

const homeCopy: HomeCopy = {
  title: "Lost & Found",
  subtitle: "Sistema de Achados e Perdidos",
};

import Menu from './menu/page'

export default function Home(): React.JSX.Element {
  return (
    <><header>
      <Menu />
    </header><div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex flex-1 w-full max-w-xl flex-col items-center justify-between py-12 px-36 bg-white dark:bg-black sm:items-start">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-7xl text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              {homeCopy.title}
            </h1>
            <p className="max-w-md text-xl leading-8 text-zinc-600 dark:text-zinc-400">
              {homeCopy.subtitle}
            </p>
          </div>
        </main>
      </div></>
  );
}