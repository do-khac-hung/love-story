Add-Type -AssemblyName System.IO.Compression.FileSystem

$targetFiles = Get-ChildItem "d:\working\naomi\story\*.sdocx" | Sort-Object Name

foreach ($f in $targetFiles) {
    Write-Host ""
    Write-Host "========== $($f.Name) =========="
    
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f.FullName)
    
    foreach ($entry in $zip.Entries | Where-Object { $_.FullName -like "*.note" }) {
        $stream = $entry.Open()
        $bytes = New-Object byte[] $entry.Length
        $stream.Read($bytes, 0, $bytes.Length) | Out-Null
        $stream.Close()
        
        $sb = New-Object System.Text.StringBuilder
        $i = 0
        
        while ($i -lt ($bytes.Length - 1)) {
            $lo = [int]$bytes[$i]
            $hi = [int]$bytes[$i+1]
            $cp = $hi * 256 + $lo
            
            # Printable: Basic Latin + Latin Extended + Vietnamese block + newline
            if (($cp -ge 32 -and $cp -le 126) -or ($cp -ge 192 -and $cp -le 591) -or ($cp -ge 7680 -and $cp -le 7935) -or $cp -eq 10 -or $cp -eq 13) {
                $null = $sb.Append([char]$cp)
            } else {
                if ($sb.Length -gt 20) {
                    $t = $sb.ToString().Trim()
                    if ($t.Length -gt 20 -and $t -match ' ') {
                        Write-Host $t
                    }
                }
                $null = $sb.Clear()
            }
            $i += 2
        }
        
        if ($sb.Length -gt 20) {
            $t = $sb.ToString().Trim()
            if ($t.Length -gt 20 -and $t -match ' ') {
                Write-Host $t
            }
        }
    }
    
    $zip.Dispose()
}
