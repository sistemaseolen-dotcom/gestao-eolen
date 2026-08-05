# Script para subir a correcao do campo Responsavel do Patrimonio
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\windows\Novo GPO"

Write-Host "=== Enviando alteracoes para o GitHub ===" -ForegroundColor Cyan
git add -A
git commit -m "Patrimonio: campo responsavel como texto livre"
git push

Write-Host ""
Write-Host "=== Push concluido! A Vercel vai publicar sozinha em 1-2 minutos. ===" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER para fechar"
