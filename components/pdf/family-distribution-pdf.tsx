import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        backgroundColor: '#f0f0f0',
        padding: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        fontWeight: 'bold',
        width: '40%',
    },
    value: {
        width: '60%',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
    signatureSection: {
        marginTop: 40,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        textAlign: 'center',
    },
});

interface FamilyDistributionPDFProps {
    data: {
        beneficiary: {
            fullName: string;
            cpf: string;
        };
        distributionType: string;
        program?: string;
        quantity: number;
        deliveryDate: Date;
        observations?: string;
    };
}

export const FamilyDistributionPDF: React.FC<FamilyDistributionPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            KIT_ALIMENTO_GENERICO: 'Kit de Alimentos Genérico',
            KIT_ALIMENTO_FAMILIA: 'Kit de Alimentos para Família',
            KIT_ALIMENTO_ACOLHIMENTO: 'Kit de Alimentos - Acolhimento',
            LEITE_CONAB: 'Leite CONAB',
        };
        return labels[type] || type;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>COMPROVANTE DE DISTRIBUIÇÃO</Text>
                    <Text style={styles.subtitle}>Distribuição Familiar de Alimentos</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>BENEFICIÁRIO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>{data.beneficiary.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CPF:</Text>
                        <Text style={styles.value}>{data.beneficiary.cpf}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DETALHES DA DISTRIBUIÇÃO</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tipo:</Text>
                        <Text style={styles.value}>{getTypeLabel(data.distributionType)}</Text>
                    </View>
                    {data.program && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Programa:</Text>
                            <Text style={styles.value}>{data.program}</Text>
                        </View>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>Quantidade:</Text>
                        <Text style={styles.value}>{data.quantity}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Entrega:</Text>
                        <Text style={styles.value}>{formatDate(data.deliveryDate)}</Text>
                    </View>
                </View>

                {data.observations && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
                        <Text>{data.observations}</Text>
                    </View>
                )}

                <View style={styles.signatureSection}>
                    <Text>__________________________________________</Text>
                    <Text style={{ marginTop: 5 }}>Assinatura do Beneficiário</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Data de emissão: {formatDate(new Date())}</Text>
                    <Text>Documento gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
