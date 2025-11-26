// // middleware.js atau middleware.ts
// import { withAuth } from "next-auth/middleware";

// // Daftar rute yang harus dilindungi. 
// // Pengguna HARUS login untuk mengakses rute-rute ini.
// const protectedRoutes = [
//   "/Home", 
//   "/dashboard", 
//   "/profil",
//   "/"
//   // Tambahkan semua rute privat Anda di sini
// ];

// export default withAuth({
//   // Tentukan halaman login Anda (tempat pengguna akan diarahkan jika tidak login)
//   pages: {
//     signIn: "/login",
//   },
// });

// export const config = {
//   // Gunakan matcher untuk menentukan rute mana yang harus dilewati middleware ini
//   matcher: protectedRoutes,
// };