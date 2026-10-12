# Regenera todo un caso SOIH a partir de datos\caso.js:
#   1) motor (validacion, confianza, metricas, bucles, arquetipos, CSV, mapa y esquema)
#   2) imagenes del esquema (Edge sin ventana)
#   3) documento Word y PDF
# Uso: pwsh -File construir_caso.ps1 -Caso "<carpeta del caso>" -Plantilla "<plantilla.html>"
# Solo ASCII en este script.
param(
    [Parameter(Mandatory)][string]$Caso,
    [Parameter(Mandatory)][string[]]$Plantilla   # una o varias plantillas; cada una da un Word y un PDF
)
$ErrorActionPreference = 'Stop'
$aqui = $PSScriptRoot
$Caso = (Resolve-Path $Caso).Path
$Plantilla = @($Plantilla | ForEach-Object { (Resolve-Path $_).Path })

& node (Join-Path $aqui 'soih_engine.js') $Caso | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'El motor ha fallado: revisar datos\caso.js' }
$res = Get-Content (Join-Path $Caso 'datos/resumen.json') -Raw | ConvertFrom-Json
"Motor: $($res.variables) variables; $($res.conApoyo) relaciones con apoyo, $($res.contables) contables, $($res.conjeturas) conjeturas, $($res.hipotesis) hipotesis sin usar; $($res.buclesSinConjeturas) bucles con apoyo"

$edge = @("${env:ProgramFiles(x86)}/Microsoft/Edge/Application/msedge.exe", "$env:ProgramFiles/Microsoft/Edge/Application/msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'No se encuentra Microsoft Edge' }
$img = Join-Path $Caso 'imagenes'
New-Item -ItemType Directory -Force $img | Out-Null
$url = ([uri](Join-Path $Caso 'Esquema_del_sistema.html')).AbsoluteUri
$vistas = @('') + @($res.arquetipos | ForEach-Object { $_.id })
foreach ($a in $vistas) {
    $nombre = if ($a) { $a } else { 'completo' }
    $out = Join-Path $img "esquema_$nombre.png"
    $u = $url + '?e=1' + $(if ($a) { "&a=$a" } else { '' })
    Start-Process -FilePath $edge -ArgumentList '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1440,985', "--screenshot=`"$out`"", "`"$u`"" -Wait -WindowStyle Hidden
    if (-not (Test-Path $out)) { throw "No se genero la imagen $nombre" }
}
$sim = Join-Path $Caso 'Simulador_de_tendencias.html'
if (Test-Path $sim) {
    $out = Join-Path $img 'simulador_esc0.png'
    $u = ([uri]$sim).AbsoluteUri + '?esc=0'
    Start-Process -FilePath $edge -ArgumentList '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1900,1150', "--screenshot=`"$out`"", "`"$u`"" -Wait -WindowStyle Hidden
}
"Imagenes: $($vistas.Count) del esquema y 1 del simulador"

foreach ($pl in $Plantilla) {
    $html = $pl -replace '\.plantilla\.html$', '.html'
    & node (Join-Path $aqui 'montar_documento.js') $pl $Caso $html
    if ($LASTEXITCODE -ne 0) { throw "No se pudo montar el documento $pl" }
    & (Join-Path (Split-Path $pl -Parent) 'html_a_word.ps1') -Html $html -Destino $Caso -Apaisado
}
