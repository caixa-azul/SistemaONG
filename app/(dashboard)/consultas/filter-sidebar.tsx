'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

const PROGRAMS = [
    { id: 'CONAB', label: 'CONAB' },
    { id: 'ACOLHIMENTO', label: 'Acolhimento' },
    { id: 'REGULAR', label: 'Regular' },
    { id: 'EVENTO', label: 'Evento' },
];

export function FilterSidebar() {
    // 🧠 HOOKS DE NAVEGAÇÃO:
    // useSearchParams: Lê a URL atual (ex: ?search=maria)
    // usePathname: Lê o caminho atual (ex: /consultas)
    // useRouter: Permite mudar a URL
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // 🧠 USE TRANSITION:
    // Permite que a interface continue responsiva enquanto a URL muda.
    // Sem isso, a tela poderia travar enquanto o Next.js recarrega os dados.
    const [isPending, startTransition] = useTransition();

    // 🧠 LOCAL STATE:
    // Mantemos o estado local para o input responder rápido enquanto o usuário digita.
    // Se dependêssemos só da URL, o input ficaria lento (esperando o servidor).
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
        searchParams.getAll('programs')
    );

    // 🧠 DEBOUNCE:
    // Só atualiza 'debouncedSearch' 500ms depois que o usuário para de digitar.
    const debouncedSearch = useDebounce(search, 500);

    // ⚡ SYNC COM URL:
    // Quando o valor "debounced" muda, atualizamos a URL.
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Resetar para página 1 na nova busca

        startTransition(() => {
            // replace: Substitui a URL atual sem adicionar no histórico (o botão voltar funciona melhor)
            replace(`${pathname}?${params.toString()}`);
        });
    }, [debouncedSearch, pathname, replace]);

    // Função para atualizar datas imediatamente
    const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
        if (type === 'startDate') setStartDate(value);
        else setEndDate(value);

        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(type, value);
        } else {
            params.delete(type);
        }
        params.set('page', '1');
        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    };

    // Função para atualizar programas (Array)
    const handleProgramChange = (programId: string, checked: boolean) => {
        const nextPrograms = checked
            ? [...selectedPrograms, programId]
            : selectedPrograms.filter((p) => p !== programId);

        setSelectedPrograms(nextPrograms);

        const params = new URLSearchParams(searchParams);
        // Removemos todos os programas antigos e adicionamos os novos um por um
        params.delete('programs');
        nextPrograms.forEach((p) => params.append('programs', p));
        params.set('page', '1');

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setSelectedPrograms([]);
        startTransition(() => {
            replace(pathname);
        });
    };

    return (
        <div className="space-y-6 p-4 border rounded-lg bg-white shadow-sm">
            <div>
                <h3 className="font-semibold mb-4 text-lg">Filtros</h3>
                <div className="space-y-4">
                    {/* Text Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Buscar</Label>
                        <Input
                            id="search"
                            placeholder="Nome ou CPF..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <Label>Período</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label htmlFor="startDate" className="text-xs text-gray-500">Início</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="endDate" className="text-xs text-gray-500">Fim</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Programs */}
                    <div className="space-y-2">
                        <Label>Programas</Label>
                        <div className="space-y-2">
                            {PROGRAMS.map((program) => (
                                <div key={program.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`program-${program.id}`}
                                        checked={selectedPrograms.includes(program.id)}
                                        onCheckedChange={(checked) =>
                                            handleProgramChange(program.id, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`program-${program.id}`} className="font-normal cursor-pointer">
                                        {program.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                    >
                        Limpar Filtros
                    </Button>
                </div>
            </div>
        </div>
    );
}
