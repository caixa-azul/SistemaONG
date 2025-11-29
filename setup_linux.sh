#!/bin/bash

echo "=========================================="
echo "🚀 NGO Management System - Setup (Linux/Mac)"
echo "=========================================="
echo ""

# 1. Check Node.js
echo "[1/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado! Por favor, instale o Node.js antes de continuar."
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js encontrado."
echo ""

# 2. Setup .env
echo "[2/4] Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    echo "[AVISO] Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo ""
    echo "==============================================================================="
    echo "[ATENÇÃO] O arquivo .env foi criado!"
    echo "Você PRECISA editar esse arquivo agora e colocar as credenciais do seu banco."
    echo "O script vai pausar. Edite o arquivo .env e salve-o."
    echo "==============================================================================="
    echo ""
    read -p "Pressione ENTER quando tiver configurado o .env..."
else
    echo "[OK] Arquivo .env já existe."
fi

# 2.1 Check .env content
if grep -q "postgresql://postgres:password@localhost:5432/ngo_management" .env; then
    echo ""
    echo "==============================================================================="
    echo "[ERRO] Você ainda não configurou o banco de dados no arquivo .env!"
    echo ""
    echo "O valor de DATABASE_URL ainda é o padrão."
    echo "Por favor, abra o arquivo .env e coloque a URL do seu banco Neon/Postgres."
    echo ""
    echo "Exemplo: postgresql://usuario:senha@ep-xyz.us-east-2.aws.neon.tech/neondb"
    echo "==============================================================================="
    echo ""
    exit 1
fi
echo "[OK] .env parece estar configurado."
echo ""

# 3. Install & Generate
echo "[3/4] Instalando dependências e gerando Prisma Client..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências."
    exit 1
fi

npx prisma generate
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao gerar Prisma Client."
    exit 1
fi
echo ""

# 4. Seed (Optional)
echo "[4/4] Banco de Dados"
read -p "Deseja popular o banco com dados de teste? (s/n): " seed
if [[ "$seed" =~ ^[Ss]$ ]]; then
    echo "Populando banco de dados..."
    npx prisma db seed
    if [ $? -ne 0 ]; then
        echo "[ERRO] Falha ao popular o banco. Verifique suas credenciais no .env."
    else
        echo "[SUCESSO] Banco populado!"
    fi
else
    echo "Pulando etapa de seed."
fi

echo ""
echo "=========================================="
echo "✅ Setup concluído!"
echo "Para rodar o projeto, use: npm run dev"
echo "=========================================="
