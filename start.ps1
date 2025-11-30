#!/usr/bin/env pwsh
# Script per avviare backend e frontend contemporaneamente

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Avvio Gestione Corsi ITS" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Funzione per verificare se una porta è in uso
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Verifica MongoDB
Write-Host "[1/4] Verifica MongoDB..." -ForegroundColor Yellow
if (Test-Port 27017) {
    Write-Host "  ✓ MongoDB è attivo sulla porta 27017" -ForegroundColor Green
} else {
    Write-Host "  ⚠ MongoDB non sembra attivo sulla porta 27017" -ForegroundColor Red
    Write-Host "    Assicurati che MongoDB sia in esecuzione prima di continuare." -ForegroundColor Red
    Write-Host "    Premi CTRL+C per annullare o INVIO per continuare comunque..." -ForegroundColor Yellow
    Read-Host
}

# Avvia Backend
Write-Host ""
Write-Host "[2/4] Avvio Backend Flask..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
$pythonExe = Join-Path $backendPath ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Host "  ✗ Virtual environment Python non trovato in $pythonExe" -ForegroundColor Red
    Write-Host "  Installa le dipendenze prima: cd backend; python -m venv .venv; .venv\Scripts\pip install -r requirements.txt" -ForegroundColor Red
    exit 1
}

$backendJob = Start-Job -ScriptBlock {
    param($path, $python)
    Set-Location $path
    & $python run.py
} -ArgumentList $backendPath, $pythonExe

Write-Host "  ✓ Backend avviato (Job ID: $($backendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

# Avvia Frontend
Write-Host ""
Write-Host "[3/4] Avvio Frontend Vite..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "  ⚠ node_modules non trovato. Installo dipendenze..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Errore durante l'installazione delle dipendenze" -ForegroundColor Red
        Stop-Job $backendJob
        Remove-Job $backendJob
        exit 1
    }
}

$frontendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev
} -ArgumentList $frontendPath

Write-Host "  ✓ Frontend avviato (Job ID: $($frontendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

# Mostra informazioni
Write-Host ""
Write-Host "[4/4] Applicazione avviata con successo!" -ForegroundColor Green
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  URLs Applicazione" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "            (o porta alternativa se 5173 è occupata)" -ForegroundColor Gray
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Premi CTRL+C per fermare tutti i servizi" -ForegroundColor Yellow
Write-Host ""

# Monitora i job e mostra output
try {
    while ($true) {
        # Controlla se i job sono ancora in esecuzione
        if ($backendJob.State -ne 'Running') {
            Write-Host "⚠ Backend si è fermato" -ForegroundColor Red
            Receive-Job $backendJob
            break
        }
        
        if ($frontendJob.State -ne 'Running') {
            Write-Host "⚠ Frontend si è fermato" -ForegroundColor Red
            Receive-Job $frontendJob
            break
        }
        
        # Mostra output dei job
        $backendOutput = Receive-Job $backendJob 2>&1
        if ($backendOutput) {
            Write-Host "[Backend] " -ForegroundColor Magenta -NoNewline
            Write-Host $backendOutput
        }
        
        $frontendOutput = Receive-Job $frontendJob 2>&1
        if ($frontendOutput) {
            Write-Host "[Frontend] " -ForegroundColor Cyan -NoNewline
            Write-Host $frontendOutput
        }
        
        Start-Sleep -Milliseconds 500
    }
}
finally {
    # Cleanup: ferma i job quando lo script viene interrotto
    Write-Host ""
    Write-Host "Arresto servizi..." -ForegroundColor Yellow
    
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -Force -ErrorAction SilentlyContinue
    
    Write-Host "✓ Tutti i servizi sono stati arrestati" -ForegroundColor Green
}
