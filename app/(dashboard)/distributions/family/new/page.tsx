import { FamilyDistributionForm } from "@/components/forms/family-distribution-form";

export default function NewFamilyDistributionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nova Distribuição Familiar</h1>
                <p className="text-muted-foreground">
                    Registrar entrega de kit de alimentos ou produtos CONAB
                </p>
            </div>

            <FamilyDistributionForm />
        </div>
    );
}
