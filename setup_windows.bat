@echo off
setlocal
chcp 65001 > nul

echo ==========================================
echo 🚀 Sistema de Gestão de ONGs - Setup (Windows)
echo ==========================================
echo.

:: 1. Check Node.js
echo [1/4] Verificando Node.js...
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado! Por favor, instale o Node.js antes de continuar.
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado.
echo.

:: 2. Setup .env
echo [2/4] Configurando variaveis de ambiente...
if not exist .env (
    echo [AVISO] Arquivo .env nao encontrado. Criando a partir do exemplo...
    copy .env.example .env > nul
    echo.
    echo ===============================================================================
    echo [ATENCAO] O arquivo .env foi criado!
    echo Voce PRECISA editar esse arquivo agora e colocar as credenciais do seu banco.
    echo O script vai pausar. Edite o arquivo .env e salve-o.
    echo ===============================================================================
    echo.
    pause
) else (
    echo [OK] Arquivo .env ja existe.
)

:: 2.1 Check .env content
findstr "postgresql://postgres:password@localhost:5432/ngo_management" .env > nul
if %errorlevel% equ 0 (
    echo.
    echo ===============================================================================
    echo [ERRO] Voce ainda nao configurou o banco de dados no arquivo .env!
    echo.
    echo O valor de DATABASE_URL ainda eh o padrao.
    echo Por favor, abra o arquivo .env e coloque a URL do seu banco Neon/Postgres.
    echo.
    echo Exemplo: postgresql://usuario:senha@ep-xyz.us-east-2.aws.neon.tech/neondb
    echo ===============================================================================
    echo.
    pause
    exit /b 1
)
echo [OK] .env parece estar configurado.
echo.

:: 3. Install & Generate
echo [3/4] Instalando dependencias e gerando Prisma Client...
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias.
    pause
    exit /b 1
)

call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao gerar Prisma Client.
    pause
    exit /b 1
)
echo.

:: 4. Seed (Optional)
echo [4/4] Banco de Dados
set /p seed="Deseja popular o banco com dados de teste? (S/N): "
if /i "%seed%"=="S" (
    echo Populando banco de dados...
    call npx prisma db seed
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao popular o banco. Verifique suas credenciais no .env.
    ) else (
        echo [SUCESSO] Banco populado!
    )
) else (
    echo Pulasndo etapa de seed.
)

echo.
echo ==========================================
echo ✅ Setup concluido!
echo Para rodar o projeto, use: npm run dev
echo ==========================================
pause
