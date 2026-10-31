import logoNegativo from '../../images/Negativo.svg'

export const Header = () => (

  <header className="bg-header-bg text-white w-full">

    <div className="mx-auto px-4 sm:px-4 md:px-14 lg:px-38 h-13 md:h-16 flex items-center justify-between">

      <img
        src={logoNegativo}
        alt="Conexão Ateliê"
        className="h-[38px] w-auto"
      />
      <span className="hidden md:block text-sm text-gray-300">
        Painel da equipe <span className="text-gray-500 mx-1">·</span> Conexão Ateliê
      </span>

    </div>
  </header>
);