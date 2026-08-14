# Script para subir o formulario de Pessoas em 3 abas (copia fiel do GPO)
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\windows\Novo GPO"

Write-Host "=== Enviando alteracoes para o GitHub ===" -ForegroundColor Cyan
git add -A
git commit -m "Pessoas: formulario em 3 abas identico ao GPO (Dados Gerais / Treinamentos e Exames / Informacao Adicional)"
git push

Write-Host ""
Write-Host "=== Push concluido! A Vercel vai publicar sozinha em 1-2 minutos. ===" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER para fechar"
