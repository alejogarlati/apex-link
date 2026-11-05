# ============================================================================
# ApexLink — Test de Verificacion y Diagnostico de Base de Datos PostgreSQL
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "==================================================================" -ForegroundColor DarkGray
Write-Host "ApexLink - Verificador de Conexion a Base de Datos PostgreSQL" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor DarkGray

# 1. Comprobar contenedor Docker
Write-Host "`n[1/4] Verificando contenedor Docker 'apexlink-db'..." -ForegroundColor Yellow
$containerStatus = docker inspect --format="{{.State.Status}} (healthy: {{.State.Health.Status}})" apexlink-db 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  [OK] Contenedor activo: $containerStatus" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] El contenedor 'apexlink-db' no esta en ejecucion. Inicia con: docker compose up -d" -ForegroundColor Red
    exit 1
}

# 2. Comprobar socket TCP
Write-Host "`n[2/4] Verificando conectividad de red TCP (localhost:5432)..." -ForegroundColor Yellow
$tcp = Test-NetConnection -Port 5432 -ComputerName localhost -WarningAction SilentlyContinue
if ($tcp.TcpTestSucceeded) {
    Write-Host "  [OK] Puerto 5432 abierto y aceptando sockets TCP." -ForegroundColor Green
} else {
    Write-Host "  [ERROR] No se pudo abrir conexion TCP en localhost:5432." -ForegroundColor Red
    exit 1
}

# 3. Comprobar version y autenticacion
Write-Host "`n[3/4] Probando autenticacion y ejecucion de consulta SELECT..." -ForegroundColor Yellow
$pgVersion = docker exec apexlink-db psql -U postgres -d apexlink -t -A -c "SELECT version();" 2>$null
if ($LASTEXITCODE -eq 0 -and $pgVersion) {
    Write-Host "  [OK] Autenticacion exitosa con base 'apexlink'." -ForegroundColor Green
    Write-Host "       $pgVersion" -ForegroundColor DarkGray
} else {
    Write-Host "  [ERROR] Fallo la autenticacion en PostgreSQL." -ForegroundColor Red
    exit 1
}

# 4. Auditoria de tablas y registros
Write-Host "`n[4/4] Verificando tablas del esquema 3FN y datos semilla..." -ForegroundColor Yellow
docker exec apexlink-db psql -U postgres -d apexlink -c "SELECT 'usuarios' AS tabla, count(*) AS registros FROM usuarios UNION ALL SELECT 'roles', count(*) FROM roles UNION ALL SELECT 'permisos', count(*) FROM permisos UNION ALL SELECT 'sesiones', count(*) FROM sesiones UNION ALL SELECT 'vueltas', count(*) FROM vueltas UNION ALL SELECT 'telemetria_vueltas', count(*) FROM telemetria_vueltas;"

Write-Host "`n--- Usuario Semilla en Base de Datos ---" -ForegroundColor Cyan
docker exec apexlink-db psql -U postgres -d apexlink -c "SELECT id, email, alias_piloto, nombre_completo, activo FROM usuarios;"

Write-Host "`n[EXITO] La base de datos PostgreSQL esta 100% OPERATIVA y lista para recibir telemetria." -ForegroundColor Green
