import { SocialAssessmentForm } from "@/components/forms/social-assessment-form";
import { Card } from "@/components/ui/card";

interface PageProps {
    params: {
        id: string;
    };
}

export default function SocialAssessmentPage({ params }: PageProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cadastro Socioeconômico</h1>
                <p className="text-muted-foreground">
                    Avaliação completa da situação familiar
                </p>
            </div>

            <SocialAssessmentForm beneficiaryId={params.id} />
        </div>
    );
}
