import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
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
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        width: '40%',
    },
    value: {
        width: '60%',
    },
    table: {
        display: 'flex',
        width: '100%',
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        padding: 5,
        fontWeight: 'bold',
        fontSize: 10,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        fontSize: 9,
    },
    tableCol1: { width: '40%' },
    tableCol2: { width: '30%' },
    tableCol3: { width: '30%' },
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
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 10,
        textAlign: 'center',
    },
});

interface InstitutionalDistributionPDFProps {
    data: {
        institution: {
            name: string;
            cnpj: string;
            contactPersonName: string;
        };
        distributionType: string;
        program?: string;
        deliveryDate: Date;
        items: Array<{
            itemName: string;
            quantity: string;
            observations?: string;
        }>;
        observations?: string;
    };
}

export const InstitutionalDistributionPDF: React.FC<InstitutionalDistributionPDFProps> = ({
    data,
}) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            ALIMENTOS_EVENTOS: 'Alimentos de Eventos',
            ALIMENTOS_REGULARES: 'Alimentos Regulares',
            ALIMENTOS_CONAB: 'Alimentos CONAB',
            FRUTAS_VERDURAS_CONAB: 'Frutas e Verduras CONAB',
        };
        return labels[type] || type;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>COMPROVANTE DE DISTRIBUIÇÃO INSTITUCIONAL</Text>
                    <Text style={styles.subtitle}>Entrega para Instituição Parceira</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>INSTITUIÇÃO DESTINATÁRIA</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome:</Text>
                        <Text style={styles.value}>{data.institution.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CNPJ:</Text>
                        <Text style={styles.value}>{data.institution.cnpj}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Responsável:</Text>
                        <Text style={styles.value}>{data.institution.contactPersonName}</Text>
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
                        <Text style={styles.label}>Data de Entrega:</Text>
                        <Text style={styles.value}>{formatDate(data.deliveryDate)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ITENS DISTRIBUÍDOS</Text>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCol1}>Item</Text>
                            <Text style={styles.tableCol2}>Quantidade</Text>
                            <Text style={styles.tableCol3}>Observações</Text>
                        </View>
                        {data.items.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCol1}>{item.itemName}</Text>
                                <Text style={styles.tableCol2}>{item.quantity}</Text>
                                <Text style={styles.tableCol3}>{item.observations || '-'}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {data.observations && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>OBSERVAÇÕES GERAIS</Text>
                        <Text>{data.observations}</Text>
                    </View>
                )}

                <View style={styles.signatureSection}>
                    <Text>__________________________________________</Text>
                    <Text style={{ marginTop: 5 }}>Assinatura do Responsável pela Instituição</Text>
                </View>

                <View style={styles.footer}>
                    <Text>Data de emissão: {formatDate(new Date())}</Text>
                    <Text>Documento gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
