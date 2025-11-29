import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { FilteredDistributionResult } from '@/actions/consultas';

// 🧠 STYLES: O React PDF usa um subconjunto do CSS via StyleSheet.create.
// Definimos aqui o layout A4, fontes e bordas para parecer um documento oficial.
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
    },
    // Cabeçalho
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    logoPlaceholder: {
        width: 60,
        height: 60,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    logoText: {
        fontSize: 8,
        color: '#666',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    orgName: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    reportTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    reportSubtitle: {
        fontSize: 10,
        color: '#444',
    },
    orgDetails: {
        fontSize: 8,
        color: '#666',
        marginTop: 4,
    },

    // Seções
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 4,
    },

    // Tabela de Estatísticas (Resumo)
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#000',
    },
    statBox: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#000',
    },
    statLastBox: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 8,
        textTransform: 'uppercase',
        color: '#666',
    },

    // Tabela Principal
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableHeaderRow: {
        margin: 'auto',
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
    },
    tableColDate: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    tableColName: { width: '35%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    tableColProgram: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    tableColItem: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },
    tableColQty: { width: '10%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, borderColor: '#000' },

    tableCellHeader: { margin: 5, fontSize: 9, fontWeight: 'bold' },
    tableCell: { margin: 5, fontSize: 8 },

    // Rodapé
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: '#666',
    },
});

interface ActivityReportProps {
    data: FilteredDistributionResult['data'];
    stats: {
        totalItems: number;
        totalFamilies: number;
        totalDistributions: number;
    };
    filters: {
        startDate?: string;
        endDate?: string;
    };
}

// 📄 COMPONENT: Este componente é renderizado APENAS quando o usuário clica em baixar PDF.
// Ele roda no cliente (navegador) para gerar o arquivo .pdf dinamicamente.
export const ActivityReport: React.FC<ActivityReportProps> = ({ data, stats, filters }) => {
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR');
    const formatDateTime = (date: Date) => `${new Date(date).toLocaleDateString('pt-BR')} ${new Date(date).toLocaleTimeString('pt-BR')}`;

    return (
        <Document>
            {/* 🧠 WRAP: A propriedade 'wrap' permite que o conteúdo quebre para a próxima página automaticamente */}
            <Page size="A4" style={styles.page} wrap>
                {/* Cabeçalho */}
                <View style={styles.headerContainer} fixed>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>LOGO ONG</Text>
                    </View>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.orgName}>Projeto Além dos Olhos</Text>
                        <Text style={styles.reportTitle}>Relatório Mensal de Atividades e Distribuições</Text>
                        <Text style={styles.reportSubtitle}>
                            Período: {filters.startDate ? formatDate(new Date(filters.startDate)) : 'Início'} a {filters.endDate ? formatDate(new Date(filters.endDate)) : 'Hoje'}
                        </Text>
                        <Text style={styles.orgDetails}>CNPJ: 37.591.117/0001-05 | Rua Francisco Jacinto de Melo, Areias, São José - SC</Text>
                    </View>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>ÓRGÃO REG.</Text>
                    </View>
                </View>

                {/* Resumo Estatístico */}
                <Text style={styles.sectionTitle}>Resumo Estatístico</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalDistributions}</Text>
                        <Text style={styles.statLabel}>Atendimentos</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{stats.totalFamilies}</Text>
                        <Text style={styles.statLabel}>Famílias Únicas</Text>
                    </View>
                    <View style={styles.statLastBox}>
                        <Text style={styles.statValue}>{stats.totalItems}</Text>
                        <Text style={styles.statLabel}>Itens Distribuídos</Text>
                    </View>
                </View>

                {/* Detalhamento */}
                <Text style={styles.sectionTitle}>Detalhamento das Distribuições</Text>
                <View style={styles.table}>
                    <View style={styles.tableHeaderRow} fixed>
                        <View style={styles.tableColDate}><Text style={styles.tableCellHeader}>Data</Text></View>
                        <View style={styles.tableColName}><Text style={styles.tableCellHeader}>Beneficiário</Text></View>
                        <View style={styles.tableColProgram}><Text style={styles.tableCellHeader}>Programa</Text></View>
                        <View style={styles.tableColItem}><Text style={styles.tableCellHeader}>CPF</Text></View>
                        <View style={styles.tableColQty}><Text style={styles.tableCellHeader}>Qtd</Text></View>
                    </View>

                    {data.map((item, index) => (
                        <View style={styles.tableRow} key={item.id} wrap={false}>
                            <View style={styles.tableColDate}><Text style={styles.tableCell}>{formatDate(item.deliveryDate)}</Text></View>
                            <View style={styles.tableColName}><Text style={styles.tableCell}>{item.beneficiary.fullName}</Text></View>
                            <View style={styles.tableColProgram}><Text style={styles.tableCell}>{item.program || '-'}</Text></View>
                            <View style={styles.tableColItem}><Text style={styles.tableCell}>{item.beneficiary.cpf}</Text></View>
                            <View style={styles.tableColQty}><Text style={styles.tableCell}>{item.quantity}</Text></View>
                        </View>
                    ))}
                </View>

                {/* Rodapé */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Gerado em: {formatDateTime(new Date())}
                    </Text>
                    <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )} />
                </View>
            </Page>
        </Document>
    );
};
