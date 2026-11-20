@echo off
REM ============================================================
REM  Deploy portofolio ke Vercel (production)
REM  Klik dua kali berkas ini setiap kali isi website diubah.
REM ============================================================
cd /d "%~dp0"

echo.
echo === Deploy portofolio ke https://portofolio-ardent.vercel.app ===
echo.

call vercel deploy --prod

if errorlevel 1 (
  echo.
  echo [GAGAL] Deploy tidak berhasil. Periksa pesan di atas.
) else (
  echo.
  echo [SELESAI] Situs sudah diperbarui. Buka https://portofolio-ardent.vercel.app
)

echo.
pause
