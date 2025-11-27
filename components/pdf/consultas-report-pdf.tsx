import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { FilteredDistributionResult } from '@/actions/consultas';

// 🧠 STYLES: O React PDF não usa CSS normal, usa esse objeto StyleSheet.
// É parecido com React Native.
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#666',
    },
    // 🧠 TABELA MANUAL: O React PDF não tem tag <table>.
    // Temos que desenhar a tabela usando Views (divs) e Flexbox.
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColLarge: {
        width: '30%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColSmall: {
        width: '10%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 5,
        fontSize: 9,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
});

interface ConsultasReportPDFProps {
    data: FilteredDistributionResult['data'];
    filters: {
        startDate?: string;
        endDate?: string;
        program?: string[];
    };
}

export const ConsultasReportPDF: React.FC<ConsultasReportPDFProps> = ({ data, filters }) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Cabeçalho do Relatório */}
                <View style={styles.header}>
                    <Text style={styles.title}>Relatório de Distribuições</Text>
                    <Text style={styles.subtitle}>
                        Gerado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    </Text>
                    {filters.startDate && filters.endDate && (
                        <Text style={styles.subtitle}>
                            Período: {new Date(filters.startDate).toLocaleDateString('pt-BR')} a {new Date(filters.endDate).toLocaleDateString('pt-BR')}
                        </Text>
                    )}
                </View>

                {/* Tabela de Dados */}
                <View style={styles.table}>
                    {/* Linha de Cabeçalho */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellHeader}>Data</Text>
                        </View>
                        <View style={styles.tableColLarge}>
                            <Text style={styles.tableCellHeader}>Beneficiário</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellHeader}>CPF</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCellHeader}>Programa</Text>
                        </View>
                        <View style={styles.tableColSmall}>
                            <Text style={styles.tableCellHeader}>Qtd</Text>
                        </View>
                    </View>

                    {data.map((item) => (
                        <View style={styles.tableRow} key={item.id}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{formatDate(item.deliveryDate)}</Text>
                            </View>
                            <View style={styles.tableColLarge}>
                                <Text style={styles.tableCell}>{item.beneficiary.fullName}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{item.beneficiary.cpf}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{item.program || '-'}</Text>
                            </View>
                            <View style={styles.tableColSmall}>
                                <Text style={styles.tableCell}>{item.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text>Sistema de Gestão da ONG - Relatório de Inteligência</Text>
                </View>
            </Page>
        </Document>
    );
};
