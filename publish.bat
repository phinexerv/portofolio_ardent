@echo off
REM ============================================================
REM  Publikasikan perubahan ke GitHub -> Vercel rilis otomatis
REM  Klik dua kali setelah menyimpan perubahan di VSCode.
REM ============================================================
cd /d "%~dp0"
setlocal

echo.
echo === Cek perubahan berkas ===
git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo Tidak ada perubahan baru. Situs tidak perlu diperbarui.
  goto selesai
)

echo.
echo === Membuat commit ===
git commit -m "update %DATE% %TIME%"
if errorlevel 1 goto gagal

echo.
echo === Mengirim ke GitHub ===
git push
if errorlevel 1 goto gagal

echo.
echo [SELESAI] Perubahan terkirim. Vercel sedang merilis (biasanya 5-60 detik).
echo Buka https://portofolio-ardent.vercel.app dengan Ctrl+F5 agar tidak kena cache.
goto selesai

:gagal
echo.
echo [GAGAL] Ada masalah di atas. Periksa pesannya.

:selesai
echo.
pause
endlocal
