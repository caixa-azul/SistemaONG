"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { SocialAssessmentPDF } from "./social-assessment-pdf";
import { FileDown } from "lucide-react";

interface DownloadButtonProps {
    beneficiary: {
        name: string;
        cpf: string;
        dateOfBirth: Date;
    };
    assessment: {
        householdSize: number;
        housingType: string;
        housingCondition: string;
        familyIncome: string;
        healthAccess: string[];
        hasSanitation: boolean;
        hasWater: boolean;
        hasSewage: boolean;
        hasGarbageCollection: boolean;
        hasSchoolNearby: boolean;
        schoolName?: string | null;
        hasPublicTransport: boolean;
        socialPrograms: string[];
        consentDate: Date;
        familyMembers?: any[]; // Simplified for now, or match the PDF expectation
    };
}

export function DownloadButton({ beneficiary, assessment }: DownloadButtonProps) {
    // Map props to the structure expected by SocialAssessmentPDF
    const pdfData = {
        beneficiary: {
            fullName: beneficiary.name,
            cpf: beneficiary.cpf,
            dateOfBirth: beneficiary.dateOfBirth,
        },
        householdSize: assessment.householdSize,
        housingType: assessment.housingType,
        housingCondition: assessment.housingCondition,
        familyIncome: assessment.familyIncome,
        healthAccess: assessment.healthAccess,
        hasSanitation: assessment.hasSanitation,
        hasWater: assessment.hasWater,
        hasSewage: assessment.hasSewage,
        hasGarbageCollection: assessment.hasGarbageCollection,
        hasSchoolNearby: assessment.hasSchoolNearby,
        schoolName: assessment.schoolName || undefined,
        hasPublicTransport: assessment.hasPublicTransport,
        socialPrograms: assessment.socialPrograms,
        familyMembers: assessment.familyMembers?.map((m: any) => ({
            name: m.name,
            age: m.age,
            relationship: m.relationship,
            educationLevel: m.educationLevel,
            isStudying: m.isStudying,
            occupation: m.occupation,
            isPCD: m.isPCD,
        })) || [],
        consentDate: assessment.consentDate,
    };

    return (
        <PDFDownloadLink
            document={<SocialAssessmentPDF data={pdfData} />}
            fileName={`avaliacao_${beneficiary.name.replace(/\s+/g, '_').toLowerCase()}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button variant="outline" disabled={loading}>
                    <FileDown className="mr-2 h-4 w-4" />
                    {loading ? "Gerando PDF..." : "Baixar PDF"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
