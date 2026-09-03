$srcDir = "C:\Users\DELL\Downloads\fashon\src"
$files = Get-ChildItem -Path $srcDir -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.css

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    $changed = $false

    $regex1 = "(from\s+['""]|import\s+['""]|import\(['""])([\./@]+)(utils|config|context|data|styles)(/|['""])"
    $newContent = [regex]::Replace($content, $regex1, "`$1`$2lib/`$3`$4")
    
    if ($content -cne $newContent) {
        $content = $newContent
        $changed = $true
    }

    $regex2 = "(from\s+['""]|import\s+['""]|import\(['""])([\./@]+)features/products/ProductCard"
    $newContent = [regex]::Replace($content, $regex2, "`$1`$2components/shared/ProductCard")
    
    if ($content -cne $newContent) {
        $content = $newContent
        $changed = $true
    }

    if ($changed) {
        [System.IO.File]::WriteAllText($f.FullName, $content)
        Write-Host "Updated $($f.FullName)"
    }
}

Write-Host "Import fix completed."
