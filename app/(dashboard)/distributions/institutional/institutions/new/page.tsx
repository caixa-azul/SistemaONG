import { InstitutionForm } from "@/components/forms/institution-form";

export default function NewInstitutionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nova Instituição Parceira</h1>
                <p className="text-muted-foreground">
                    Cadastrar nova organização para distribuições institucionais
                </p>
            </div>

            <InstitutionForm />
        </div>
    );
}
