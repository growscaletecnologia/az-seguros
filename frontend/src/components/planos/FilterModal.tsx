import { FilterIcon, X } from "lucide-react";
import { Checkbox } from "./Checkbox";


export type FilterState = {
  coverageValues: number[];     // valores numéricos de cobertura médica (ex: 10000, 25000)
  covid: ("com" | "sem")[];     // derivado da lista de benefícios
  insurers: string[];           // nomes das seguradoras (provider_name)
  ageGroups: string[];          // ex: "0-17", "18-40", "41-60"
  benefits: string[];           // nomes dos benefícios
};

export const initialFilters: FilterState = {
  coverageValues: [],
  covid: [],
  insurers: [],
  ageGroups: [],
  benefits: [],
};


export function FiltersModal({
	isOpen,
	onClose,
	onApply,
	onClear,
	state,
	setState,
	options,
}: {
	isOpen: boolean;
	onClose: () => void;
	onApply: () => void;
	onClear: () => void;
	state: FilterState;
	setState: React.Dispatch<React.SetStateAction<FilterState>>;
	options: {
  coverageValues: number[];     // pega de QuoteAgeGroup.totalGroupValue
  covid: ("com" | "sem")[];     // ["com", "sem"]
  insurers: string[];           // lista única de provider_name
  ageGroups: string[];          // ["0-17", "18-40", "41-60"]
  benefits: string[];           // lista única de QuoteBenefit.name
};

}) {
	if (!isOpen) return null;

	// helpers toggle
	const toggleNumber = (key: keyof FilterState, value: number) => {
		setState((s) => {
			const arr = s[key] as number[];
			return {
				...s,
				[key]: arr.includes(value)
					? arr.filter((v) => v !== value)
					: [...arr, value],
			};
		});
	};
	const toggleString = <K extends keyof FilterState>(key: K, value: string) => {
		setState((s) => {
			const arr = s[key] as string[];
			return {
				...s,
				[key]: arr.includes(value)
					? arr.filter((v) => v !== value)
					: [...arr, value],
			};
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
			<div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
				{/* Topbar */}
				<div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2 font-semibold">
						<FilterIcon className="w-5 h-5" />
						<span>Filtros</span>
					</div>
					<button
						onClick={onClose}
						className="p-1 rounded hover:bg-blue-600/40"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				{/* Grid opções */}
				<div className="px-6 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
					{/* Cobertura médica */}
<div>
  <h4 className="font-semibold text-gray-900 mb-2">
    Valor de Cobertura Médica
  </h4>
  <div>
    {options.coverageValues.map((v) => (
      <Checkbox
        key={v}
        id={`cov-${v}`}
        checked={state.coverageValues.includes(v)}
        onChange={() => toggleNumber("coverageValues", v)}
        label={`USD $${v.toLocaleString("en-US")}`}
      />
    ))}
  </div>
</div>

{/* Faixa Etária */}
<div>
  <h4 className="font-semibold text-gray-900 mb-2">Faixa Etária</h4>
  <div>
    {options.ageGroups.map((f) => (
      <Checkbox
        key={f}
        id={`age-${f}`}
        checked={state.ageGroups.includes(f)}
        onChange={() => toggleString("ageGroups", f)}
        label={f}
      />
    ))}
  </div>
</div>

{/* Seguradoras */}
<div>
  <h4 className="font-semibold text-gray-900 mb-2">Seguradoras</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
    {options.insurers.map((s) => (
      <Checkbox
        key={s}
        id={`seg-${s}`}
        checked={state.insurers.includes(s)}
        onChange={() => toggleString("insurers", s)}
        label={s}
      />
    ))}
  </div>
</div>

{/* COVID */}
<div>
  <h4 className="font-semibold text-gray-900 mb-2">
    Cobertura COVID-19
  </h4>
  {options.covid.map((c) => (
    <Checkbox
      key={c}
      id={`covid-${c}`}
      checked={state.covid.includes(c)}
      onChange={() => toggleString("covid", c)}
      label={c === "com" ? "Com cobertura" : "Sem cobertura"}
    />
  ))}
</div>

{/* Benefícios */}
<div className="lg:col-span-2">
  <h4 className="font-semibold text-gray-900 mb-2">Benefícios</h4>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
    {options.benefits.map((b) => (
      <Checkbox
        key={b}
        id={`ben-${b}`}
        checked={state.benefits.includes(b)}
        onChange={() => toggleString("benefits", b)}
        label={b}
      />
    ))}
  </div>
</div>

				</div>

				{/* Footer ações */}
				<div className="px-6 py-4 border-t flex items-center justify-end gap-3">
					<button
						onClick={onClear}
						className="px-4 py-2 rounded-lg border text-blue-700 border-blue-700 hover:bg-blue-50 text-sm font-medium"
					>
						Limpar filtros
					</button>
					<button
						onClick={onApply}
						className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-sm font-semibold"
					>
						Aplicar filtros
					</button>
				</div>
			</div>
		</div>
	);
}