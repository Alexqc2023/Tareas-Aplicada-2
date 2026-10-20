export default {
  expo: {
    name: "SistemaReservas",
    slug: "sistema-reservas",
    version: "1.0.0",
    scheme: "sistemareservas",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.38:3000"
    }
  }
};