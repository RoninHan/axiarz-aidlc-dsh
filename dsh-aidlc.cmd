@echo off
setlocal
rem dsh-aidlc - manage the AI-DLC skill for DeepSeek Harness (Windows).
rem Usage: dsh-aidlc <init|update|remove|status|help>

set "ROOT=%DSH_HOME%"
if not defined ROOT set "ROOT=%USERPROFILE%\.dsh"
set "ROOT=%ROOT%\skills"
set "DEST=%ROOT%\aidlc"
set "SRC=%~dp0skills\aidlc"

if "%~1"=="" goto help
if /i "%~1"=="init" goto init
if /i "%~1"=="update" goto init
if /i "%~1"=="remove" goto remove
if /i "%~1"=="status" goto status
if /i "%~1"=="help" goto help
if /i "%~1"=="-h" goto help
if /i "%~1"=="--help" goto help
echo Unknown command: %~1
goto help

:init
if not exist "%SRC%\SKILL.md" (
  echo Skill source not found at %SRC%
  exit /b 1
)
if not exist "%ROOT%" mkdir "%ROOT%"
if exist "%DEST%" rmdir /s /q "%DEST%"
xcopy "%SRC%" "%DEST%" /E /I /Y /Q >nul
if errorlevel 1 (
  echo Failed to install.
  exit /b 1
)
echo Installed aidlc skill to %DEST%
echo Done. Start a new DSH session (or refresh) and "aidlc" will appear in the skill catalog.
goto :eof

:remove
if exist "%DEST%" (
  rmdir /s /q "%DEST%"
  echo Removed %DEST%
) else (
  echo Not installed at %DEST%
)
goto :eof

:status
echo Skill root : %ROOT%
echo Install dir: %DEST%
if exist "%DEST%\SKILL.md" ( echo Installed  : yes ) else ( echo Installed  : no )
goto :eof

:help
echo dsh-aidlc - manage the AI-DLC skill for DeepSeek Harness
echo.
echo Usage: dsh-aidlc ^<command^>
echo.
echo Commands:
echo   init      Install (or reinstall) the aidlc skill to the user skill root.
echo   update    Alias of init.
echo   remove    Remove the aidlc skill.
echo   status    Show the skill root and whether the skill is installed.
echo   help      Show this help.
goto :eof
