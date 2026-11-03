import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";
import { getPermissionsAsync, requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions";
import { scheduleNotificationAsync } from "expo-notifications/build/scheduleNotificationAsync";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import { cancelScheduledNotificationAsync } from "expo-notifications/build/cancelScheduledNotificationAsync";


setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export const solicitarPermisosNotificaciones = async () => {
  try {
    const { status: statusActual } = await getPermissionsAsync();
    let statusFinal = statusActual;

    if (statusActual !== "granted") {
      const { status } = await requestPermissionsAsync();
      statusFinal = status;
    }
    return statusFinal === "granted";
  } catch (error) {
    console.log("fallo al pedir permisos: ", error);
    return false;
  }
};


const convertirFechaHora = (fechaStr, horaStr) => {
  if (!fechaStr || !horaStr) return null;
  
  const [dia, mes, anio] = fechaStr.split("-").map(Number);
  const match = horaStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  
  if (!match) return null;

  let [, horas, minutos, periodo] = match;
  horas = Number(horas);
  minutos = Number(minutos);

  if (periodo) {
    periodo = periodo.toUpperCase();
    if (periodo === "PM" && horas < 12) horas += 12;
    if (periodo === "AM" && horas === 12) horas = 0;
  }

  return new Date(anio, mes - 1, dia, horas, minutos, 0);
};


export const programarRecordatorioReserva = async (reservaId, nombreServicio, fecha, hora) => {
  try {
    const hayPermiso = await solicitarPermisosNotificaciones();
    if (!hayPermiso) {
      Alert.alert(
        "Permisos denegados",
        "Ve a los ajustes de tu celular y activa las notificaciones para Expo Go."
      );
      return null;
    }

    const nombreServ = nombreServicio || "el servicio";
    const fechaReserva = convertirFechaHora(fecha, hora);
    
    if (!fechaReserva) return null;
    
    const tiempoFaltante = fechaReserva.getTime() - Date.now();
    const unDiaMs = 24 * 60 * 60 * 1000; 
    
    
    if (tiempoFaltante <= unDiaMs) {
      console.log('Falta menos de 1 dia, ignorando notificacion');
      return null;
    }
    
    
    const segundosParaDisparo = Math.floor((tiempoFaltante - unDiaMs) / 1000);

    const idNoti = await scheduleNotificationAsync({
      content: {
        title: "Recordatorio de reserva ",
        body: `Tu reserva para ${nombreServ} es manana (${fecha} a las ${hora}).`,
        sound: true,
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: segundosParaDisparo,
        repeats: false,
      },
    });

    
    if (reservaId && idNoti) {
      await AsyncStorage.setItem(`notif_reserva_${reservaId}`, idNoti);
    }

    return idNoti;
  } catch (err) {
    console.log("Error creando la notificacion: ", err);
    return null;
  }
};


export const cancelarRecordatorioReserva = async (reservaId) => {
  try {
    const key = `notif_reserva_${reservaId}`;
    const idNoti = await AsyncStorage.getItem(key);

    if (idNoti) {
      await cancelScheduledNotificationAsync(idNoti);
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.log("Error al intentar borrar la noti:", error);
  }
};