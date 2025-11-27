import { NutritionistReferralForm } from "@/components/forms/nutritionist-referral-form";

interface PageProps {
    params: {
        id: string;
    };
}

export default function NutritionistReferralPage({ params }: PageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Encaminhamento ao Nutricionista</h1>
                <p className="text-muted-foreground">
                    Registrar encaminhamento para especialidade
                </p>
            </div>

            <NutritionistReferralForm beneficiaryId={params.id} />
        </div>
    );
}
