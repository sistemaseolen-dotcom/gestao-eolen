# Script para subir a expansao de campos (Pessoas) e correcoes de dados
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\windows\Novo GPO"

Write-Host "=== Enviando alteracoes para o GitHub ===" -ForegroundColor Cyan
git add -A
git commit -m "Pessoas: expandir formulario com todos os campos do GPO (dados pessoais, endereco, documentos, bancario)"
git push

Write-Host ""
Write-Host "=== Push concluido! A Vercel vai publicar sozinha em 1-2 minutos. ===" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione ENTER para fechar"
