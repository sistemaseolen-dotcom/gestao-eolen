# Script para subir o Dashboard, migracao de treinamentos e demais correcoes de campos
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\windows\Novo GPO"

Write-Host "=== Enviando alteracoes para o GitHub ===" -ForegroundColor Cyan
git add -A
git commit -m "Dashboard com indicadores reais + campos completos em Empresas"
git push

Write-Host ""
Write-Host "=== Push concluido! A Vercel vai publicar sozinha em 1-2 minutos. ===" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER para fechar"
