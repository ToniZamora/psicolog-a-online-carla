import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMERO = "34746068771";
const WHATSAPP_MENSAJE =
  "Hola, me gustaría pedir una primera cita. ¿Me puedes dar más información?";
export const whatsappUrl = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAJE)}`;

const EMAIL = "carla.psicologia.ij@gmail.com";
const EMAIL_ASUNTO = "Consulta desde la web";
const EMAIL_CUERPO = "Hola, Carla: me gustaría hacerte una consulta.";
export const emailUrl = `mailto:carlatupsico@gmail.com?subject=${encodeURIComponent(EMAIL_ASUNTO)}&body=${encodeURIComponent(EMAIL_CUERPO)}`;

export function WhatsAppButton() {
  return (
    <Button asChild className="h-auto whitespace-normal px-6 py-4">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-5" />
        Escríbeme por WhatsApp
      </a>
    </Button>
  );
}

export function GmailButton() {
  return (
    <Button asChild variant="outline" className="h-auto whitespace-normal px-6 py-4">
      <a href={emailUrl}>
        <Mail className="size-5" />
        Escríbeme por correo
      </a>
    </Button>
  );
}
