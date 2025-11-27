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
        marginBottom: 20,
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
        width: '35%',
    },
    value: {
        width: '65%',
    },
    textBox: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        minHeight: 80,
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
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    signatureLine: {
        width: '45%',
        borderTopWidth: 1,
        borderTopColor: '#000',
        paddingTop: 5,
        textAlign: 'center',
    },
});

interface ImageAuthorizationPDFProps {
    data: {
        beneficiary: {
            fullName: string;
            cpf: string;
            rg: string;
        };
        startDate: Date;
        endDate: Date;
        commercialUse: boolean;
        witnessName?: string;
        signedAt: Date;
    };
}

export const ImageAuthorizationPDF: React.FC<ImageAuthorizationPDFProps> = ({ data }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>AUTORIZAÇÃO DE USO DE IMAGEM</Text>
                    <Text style={styles.subtitle}>Termo de Consentimento</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>DADOS DO AUTORIZANTE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nome Completo:</Text>
                        <Text style={styles.value}>{data.beneficiary.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>CPF:</Text>
                        <Text style={styles.value}>{data.beneficiary.cpf}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>RG:</Text>
                        <Text style={styles.value}>{data.beneficiary.rg}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PERÍODO DE VALIDADE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Início:</Text>
                        <Text style={styles.value}>{formatDate(data.startDate)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Data de Término:</Text>
                        <Text style={styles.value}>{formatDate(data.endDate)}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TERMOS DA AUTORIZAÇÃO</Text>
                    <View style={styles.textBox}>
                        <Text>
                            Eu, {data.beneficiary.fullName}, portador(a) do CPF {data.beneficiary.cpf} e RG {data.beneficiary.rg},
                            AUTORIZO o uso de minha imagem em fotografias e/ou vídeos pela organização,
                            para fins de divulgação das atividades institucionais.
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                            Uso comercial: {data.commercialUse ? 'AUTORIZADO' : 'NÃO AUTORIZADO'}
                        </Text>
                        <Text style={{ marginTop: 10 }}>
                            Esta autorização é válida de {formatDate(data.startDate)} até {formatDate(data.endDate)}.
                        </Text>
                    </View>
                </View>

                {data.witnessName && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>TESTEMUNHA</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Nome da Testemunha:</Text>
                            <Text style={styles.value}>{data.witnessName}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.signatureSection}>
                    <View style={styles.signatureLine}>
                        <Text>Assinatura do Autorizante</Text>
                    </View>
                    {data.witnessName && (
                        <View style={styles.signatureLine}>
                            <Text>Assinatura da Testemunha</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text>Documento assinado em: {formatDate(data.signedAt)}</Text>
                    <Text>Gerado automaticamente pelo Sistema de Gestão da ONG</Text>
                </View>
            </Page>
        </Document>
    );
};
