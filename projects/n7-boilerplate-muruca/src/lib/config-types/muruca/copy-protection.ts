export interface ConfigMrCopyProtection {
  /** abilitare la copia con attribuzione */
  enabled: boolean;
  /** testo aggiunto in coda al contenuto copiato (plain text, fallback) */
  message: string;
  /** versione HTML del messaggio, supporta <strong>, <em>, <a href="..."> */
  htmlMessage?: string;
}
