# Convierte un HTML fuente en .docx y .pdf con Word (COM).
# Uso: pwsh -File html_a_word.ps1 -Html <ruta.html> -Destino <carpeta> [-Apaisado]
# Solo ASCII en este script: asi no depende del BOM.
param(
    [Parameter(Mandatory)][string]$Html,
    [Parameter(Mandatory)][string]$Destino,
    [switch]$Apaisado
)
$ErrorActionPreference = 'Stop'
$base = [IO.Path]::GetFileNameWithoutExtension($Html)
$docx = Join-Path $Destino ($base + '.docx')
$pdf  = Join-Path $Destino ($base + '.pdf')
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($Html, $false, $true)
    $ps = $doc.PageSetup
    if ($Apaisado) { $ps.Orientation = 1 }
    $ps.TopMargin = 62; $ps.BottomMargin = 62; $ps.LeftMargin = 62; $ps.RightMargin = 62
    $doc.ActiveWindow.View.Type = 3
    foreach ($t in $doc.Tables) { $t.AllowAutoFit = $true; $t.PreferredWidthType = 2; $t.PreferredWidth = 100 }
    # Las imagenes del HTML entran enlazadas: se incrustan para que el .docx no dependa de ellas
    foreach ($s in $doc.InlineShapes) { if ($s.LinkFormat) { $s.LinkFormat.SavePictureWithDocument = $true; $s.LinkFormat.BreakLink() } }
    # Word no respeta el ancho del HTML: se fija aqui (en puntos) para que titulo e imagen quepan en una pagina
    # y ademas deforma la imagen (toma el ancho del HTML y el alto original): se iguala la escala antes
    foreach ($s in $doc.InlineShapes) { $s.LockAspectRatio = 0; $s.ScaleHeight = $s.ScaleWidth; $s.LockAspectRatio = -1; if ($s.Width -gt 560) { $s.Width = 560 } }
    $doc.SaveAs2($docx, 16)
    $doc.SaveAs2($pdf, 17)
    $pag = $doc.ComputeStatistics(2)
    $doc.Close($false)
    "OK  $base  paginas=$pag"
} finally {
    $word.Quit()
    [void][Runtime.InteropServices.Marshal]::ReleaseComObject($word)
}
