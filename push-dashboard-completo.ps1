# Script para subir o Dashboard completo (13 widgets + modal de detalhes)
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\windows\Novo GPO"

Write-Host "=== Enviando alteracoes para o GitHub ===" -ForegroundColor Cyan
git add -A
git commit -m "Dashboard completo: 13 widgets com modal de detalhes (igual ao GPO)"
git push

Write-Host ""
Write-Host "=== Push concluido! A Vercel vai publicar sozinha em 1-2 minutos. ===" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER para fechar"
