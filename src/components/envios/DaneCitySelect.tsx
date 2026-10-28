import {
    useEffect,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
} from 'react';
import { Loader2, MapPin, X } from 'lucide-react';

import { useDaneCities } from '../../hooks/useDaneCities';
import type { DaneCity } from '../../types';

interface DaneCitySelectProps {
    value: DaneCity | null;
    onChange: (city: DaneCity | null) => void;
    label?: string;
    disabled?: boolean;
}

const DaneCitySelect = ({
    value,
    onChange,
    label = 'Ciudad destino',
    disabled = false,
}: DaneCitySelectProps) => {
    const [query, setQuery] = useState(value?.nombre ?? '');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = useId();
    const { cities, loading, error } = useDaneCities(query);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                containerRef.current
                && !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isOpen]);

    const handleSelect = (city: DaneCity) => {
        onChange(city);
        setQuery(city.nombre);
        setIsOpen(false);
        setActiveIndex(-1);
    };

    const handleClear = () => {
        onChange(null);
        setQuery('');
        setIsOpen(true);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((previous) => Math.min(previous + 1, cities.length - 1));
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
            setActiveIndex((previous) => Math.max(previous - 1, 0));
            return;
        }
        if (event.key === 'Enter') {
            if (isOpen && activeIndex >= 0 && cities[activeIndex]) {
                event.preventDefault();
                handleSelect(cities[activeIndex]);
            }
            return;
        }
        if (event.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <label
                htmlFor={`${listboxId}-input`}
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
            </label>
            <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    ref={inputRef}
                    id={`${listboxId}-input`}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    aria-activedescendant={
                        activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
                    }
                    autoComplete="off"
                    disabled={disabled}
                    value={query}
                    onFocus={() => setIsOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setIsOpen(true);
                        setActiveIndex(-1);
                        if (value && event.target.value !== value.nombre) {
                            onChange(null);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Busca por ciudad o departamento..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 pr-11 text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                />
                {loading ? (
                    <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
                ) : (
                    query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
                            aria-label="Limpiar ciudad"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )
                )}
            </div>

            {value && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    Código DANE: <span className="font-mono">{value.codigo}</span>
                </p>
            )}

            {isOpen && (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-gray-950">
                    <div
                        id={listboxId}
                        role="listbox"
                        className="max-h-64 overflow-y-auto py-1"
                    >
                        {loading && (
                            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                Buscando ciudades...
                            </p>
                        )}
                        {!loading && error && (
                            <p className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>
                        )}
                        {!loading && !error && cities.length === 0 && (
                            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                No encontramos coincidencias.
                            </p>
                        )}
                        {!loading && !error && cities.map((city, index) => (
                            <button
                                key={city.codigo}
                                id={`${listboxId}-option-${index}`}
                                type="button"
                                role="option"
                                aria-selected={value?.codigo === city.codigo}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => handleSelect(city)}
                                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${index === activeIndex
                                    ? 'bg-blue-50 dark:bg-white/10'
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {city.nombre}
                                </span>
                                <span className="font-mono text-xs text-gray-400">
                                    {city.codigo}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DaneCitySelect;
