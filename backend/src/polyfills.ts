import * as crypto from 'crypto';

// Node 18 no expone globalThis.crypto (lo usa @nestjs/typeorm). En Node >= 19 ya
// existe como propiedad de solo lectura, así que solo lo definimos si falta.
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = crypto;
}
