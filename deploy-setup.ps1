# Script de preparacao do Git + push para o GitHub - Gestao Eolen
# Rode isso com Win+R (veja instrucoes que o Claude te passou)

$ErrorActionPreference = "Stop"
$projectPath = "C:\Users\windows\Novo GPO"

Write-Host "=== Gestao Eolen: preparando repositorio Git ===" -ForegroundColor Cyan
Set-Location $projectPath

# Remove qualquer .git incompleto/travado de uma tentativa anterior
if (Test-Path ".git") {
    Write-Host "Removendo .git anterior (estava incompleto)..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".git"
}

git init
git config user.email "diego.nunes@eolen.com.br"
git config user.name "Diego Nunes"
git add -A
git commit -m "Initial commit: Gestao Eolen"

Write-Host ""
Write-Host "=== Commit local criado com sucesso ===" -ForegroundColor Green
Write-Host ""
Write-Host "Agora abra https://github.com/new no navegador e crie um repositorio VAZIO" -ForegroundColor Cyan
Write-Host "(sem README, sem .gitignore - ja temos um). Exemplo de nome: gestao-eolen" -ForegroundColor Cyan
Write-Host ""

$repoUrl = Read-Host "Cole aqui a URL do repositorio que voce criou (ex: https://github.com/seu-usuario/gestao-eolen.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "Nenhuma URL informada. O commit local ja esta pronto - rode este script de novo quando tiver o repositorio." -ForegroundColor Yellow
} else {
    git remote add origin $repoUrl
    git branch -M main
    git push -u origin main

    Write-Host ""
    Write-Host "=== Push concluido! Codigo no ar no GitHub ===" -ForegroundColor Green
    Write-Host "Agora avise o Claude que o push foi feito para continuar com a Vercel." -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Pressione ENTER para fechar"
