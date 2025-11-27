"use client";

import { pdf } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface PDFDownloadButtonProps {
    pdfDocument: React.ReactElement;
    filename: string;
    label?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    className?: string;
}

export function PDFDownloadButton({
    pdfDocument,
    filename,
    label = "Baixar PDF",
    variant = "outline",
    className,
}: PDFDownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const blob = await pdf(pdfDocument as any).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            onClick={handleDownload}
            disabled={isGenerating}
            className={className}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PDF...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    {label}
                </>
            )}
        </Button>
    );
}
