import { BeneficiaryForm } from "@/components/forms/beneficiary-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewBeneficiaryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Novo Beneficiário</h1>
                <p className="text-muted-foreground">
                    Cadastro de novo beneficiário no sistema
                </p>
            </div>

            <BeneficiaryForm />
        </div>
    );
}
