export const LETTERS = [
  'A','B','C','D','E','F','G','H','I','J','K','L','M',
  'N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z',
];

export const TOTAL = LETTERS.length; // 27

export const GAME_TIME = 220; // seconds

// Words unsuitable for the game (too common, grammatical, etc.)
export const SKIP_WORDS = new Set([
  'hacer','tener','poder','decir','estar','haber','poner','deber','pasar','llegar',
  'creer','hablar','llevar','dejar','seguir','encontrar','llamar','venir','pensar',
  'salir','volver','tomar','conocer','vivir','sentir','tratar','mirar','contar',
  'empezar','esperar','buscar','existir','entrar','trabajar','escribir','perder',
  'producir','ocurrir','entender','pedir','recibir','recordar','terminar','permitir',
  'aparecer','conseguir','comenzar','servir','sacar','necesitar','mantener','resultar',
  'leer','caer','cambiar','presentar','crear','abrir','considerar','pero','como',
  'para','este','esto','esta','todo','toda','cuando','donde','quien',
  'otro','otra','mismo','misma','cada','algo','nada','mucho',
  'poco','bien','mejor','mayor','menor','parte','tiempo','forma','mano','caso',
  'agua','casa','cosa','mundo','vida','hombre','mujer','hijo','hija',
  'ellos','ella','ellas','nosotros','ustedes','suyo','suya','tuyo','tuya',
  'ninguno','ninguna','varios','varias','algunos','algunas','ambos','ambas',
  'cuyo','cuya','cuanto','cuanta','dicho','dicha','total','simple','joven',
  'solo','sola','cierto','cierta','demás','propio','propia','nuevo','nueva',
  'según','hacia','desde','entre','sobre','contra','durante','mediante',
  'recién','además','apenas','acaso','bastante','demasiado',
  'luego','grande','observa','resulta','suele','vivido','nombrado',
  'familiar','posterior','derecha','elegir','tabla','marina','hotel',
  'junto','junta','antes','ahora','aquí','allí','siempre','nunca',
  'dentro','fuera','arriba','abajo','cerca','lejos','pronto','tarde',
]);
