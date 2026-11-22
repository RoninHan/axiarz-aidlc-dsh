# AI-DLC skill (DeepSeek Harness port) - one-line installer.
# On any machine run:
#   irm https://raw.githubusercontent.com/RoninHan/axiarz-aidlc-dsh/main/install.ps1 | iex
$ErrorActionPreference = 'Stop'

$Repo = 'RoninHan/axiarz-aidlc-dsh'
$Version = 'main'               # a branch name or a tag

$skillRoot = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
$skillDest = Join-Path $skillRoot 'skills\aidlc'

$tmp = Join-Path $env:TEMP ('aidlc-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
try {
  $zip = Join-Path $tmp 'repo.zip'
  $url = "https://github.com/$Repo/archive/$Version.zip"
  Write-Host "Downloading AI-DLC skill from $Repo@$Version ..."
  Invoke-WebRequest -Uri $url -OutFile $zip
  tar -xf $zip -C $tmp
  $root = (Get-ChildItem -Directory $tmp | Select-Object -First 1).FullName

  New-Item -ItemType Directory -Force -Path (Split-Path $skillDest) | Out-Null
  if (Test-Path $skillDest) { Remove-Item $skillDest -Recurse -Force }
  Copy-Item -Recurse (Join-Path $root 'skills\aidlc') $skillDest

  Write-Host "Installed skill -> $skillDest"
  Write-Host 'Done. Start a new DSH session (or refresh) and "aidlc" will appear in the skill catalog.'
}
finally {
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
