import { SocialAssessmentFormDemo } from "@/components/forms/social-assessment-form-demo";

export default function FormsDemoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Demonstração de Formulários</h2>
                <p className="text-muted-foreground">
                    Visualize e teste os formulários sem conexão com o banco de dados.
                </p>
            </div>

            <SocialAssessmentFormDemo />
        </div>
    );
}
