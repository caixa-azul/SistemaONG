"use client";

import { useFormState } from "react-dom";
import { createDonation } from "@/actions/donation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DonationType, FinancialMethod, UnitOfMeasure } from "@/types";
import { useState } from "react";

const initialState = {
    message: "",
    errors: {},
};

export function DonationForm() {
    const [state, dispatch] = useFormState(createDonation, initialState);
    const [type, setType] = useState<DonationType>("FINANCIAL");

    return (
        <form action={dispatch} className="space-y-4 max-w-md">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipo
                </label>
                <select
                    id="type"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as DonationType)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {Object.values(DonationType).map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">
                    Nome do Doador
                </label>
                <Input id="donorName" name="donorName" placeholder="Nome do Doador" />
            </div>

            <div className="flex items-center space-x-2">
                <input type="checkbox" id="anonymous" name="anonymous" value="true" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                    Anônimo
                </label>
            </div>

            {type === "FINANCIAL" && (
                <>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Valor
                        </label>
                        <Input id="amount" name="amount" type="number" step="0.01" placeholder="0.00" />
                    </div>
                    <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                            Método
                        </label>
                        <select
                            id="method"
                            name="method"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {Object.values(FinancialMethod).map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {type === "MATERIAL" && (
                <>
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                            Nome do Item
                        </label>
                        <Input id="itemName" name="itemName" placeholder="ex: Arroz" />
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            Quantidade
                        </label>
                        <Input id="quantity" name="quantity" type="number" step="0.1" placeholder="0" />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                            Unidade
                        </label>
                        <select
                            id="unit"
                            name="unit"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            {Object.values(UnitOfMeasure).map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <Button type="submit">Registrar Doação</Button>
            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}
        </form>
    );
}
