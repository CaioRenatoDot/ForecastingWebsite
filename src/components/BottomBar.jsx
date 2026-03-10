import backBarImage from '../assets/Back.png'
import plusIcon from '../assets/Plus.png'
import subtractImage from '../assets/Subtract.png'

function BottomBar() {
  return (
    <footer className="relative h-[126px]">
      <div className="absolute bottom-0 left-1/2 h-[126px] w-[390px] -translate-x-1/2">
        <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[89px] w-[390px]">
          <img
            src={backBarImage}
            alt="Barra inferior"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[100px] w-[266px] -translate-x-1/2">
          <img
            src={subtractImage}
            alt="Destaque central"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <button
          type="button"
          data-forecast-button="true"
          aria-label="Sem funcionalidade"
          style={{ left: '53.5px', top: '79px' }}
          className="liquid-glass-press absolute z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/28 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.33),rgba(255,255,255,0.09)_52%,rgba(76,84,160,0.24)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_18px_rgba(16,12,56,0.34)] "
        >
          <span className="sr-only">Sem funcionalidade</span>
        </button>

        <button
          type="button"
          data-forecast-button="true"
          aria-label="Sem funcionalidade"
          style={{ left: '292px', top: '79.5px' }}
          className="liquid-glass-press absolute z-20 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/28 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.33),rgba(255,255,255,0.09)_52%,rgba(76,84,160,0.24)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_18px_rgba(16,12,56,0.34)] "
        >
          <span className="sr-only">Sem funcionalidade</span>
        </button>

        <button
          type="button"
          data-forecast-button="true"
          aria-label="Sem funcionalidade"
          className="plus-liquid-glass absolute bottom-[15px] left-1/2 z-30 flex h-16 w-16 -translate-x-1/2 cursor-default items-center justify-center rounded-full border border-white/45 bg-[linear-gradient(180deg,#f3f5fa_0%,#d1d9e8_100%)] text-[#59619f] shadow-[0_8px_20px_rgba(11,10,40,0.45)]"
        >
          <img
            src={plusIcon}
            alt="Adicionar"
            className="plus-liquid-glass-icon h-11 w-11 object-contain"
            loading="lazy"
          />
        </button>
      </div>
    </footer>
  )
}

export default BottomBar
