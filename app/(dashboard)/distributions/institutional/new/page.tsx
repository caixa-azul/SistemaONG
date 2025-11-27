import { InstitutionalDistributionForm } from "@/components/forms/institutional-distribution-form";

export default function NewInstitutionalDistributionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nova Distribuição Institucional</h1>
                <p className="text-muted-foreground">
                    Registrar entrega de alimentos para instituição parceira
                </p>
            </div>

            <InstitutionalDistributionForm />
        </div>
    );
}
