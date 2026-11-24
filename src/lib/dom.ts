// Crea elementos con texto SIEMPRE vía textContent: nada de innerHTML con datos de usuario.
type Attrs = Record<string, string | boolean | undefined>;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue;
    if (k === "class") el.className = String(v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}

export function $<T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`No existe ${sel}`);
  return el;
}

/** Estilos de los avisos, con el diseño de la web original. */
export const AVISO = {
  info: "rounded-2xl bg-secondary p-4 text-sm",
  error: "rounded-2xl bg-destructive/10 p-4 text-sm text-destructive",
  ok: "rounded-2xl bg-accent p-4 text-sm font-medium text-primary",
} as const;

export function showMessage(el: HTMLElement, text: string, kind: keyof typeof AVISO = "info", extra = "") {
  el.textContent = text;
  el.className = `${AVISO[kind]} ${extra}`.trim();
  el.hidden = !text;
}

/** Confirmación accesible con <dialog> nativo. */
export function confirmar(texto: string, aceptar = "Sí, continuar"): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = h(
      "dialog",
      { class: "confirm" },
      h("p", { class: "leading-relaxed" }, texto),
      h(
        "form",
        { method: "dialog", class: "mt-6 flex flex-wrap justify-end gap-3" },
        h(
          "button",
          { class: "rounded-full border border-border px-5 py-2.5 font-semibold text-muted-foreground hover:bg-accent", value: "no" },
          "Volver",
        ),
        h(
          "button",
          { class: "rounded-full bg-destructive px-5 py-2.5 font-semibold text-destructive-foreground hover:bg-destructive/90", value: "si" },
          aceptar,
        ),
      ),
    );
    document.body.append(dialog);
    dialog.addEventListener("close", () => {
      resolve(dialog.returnValue === "si");
      dialog.remove();
    });
    dialog.showModal();
  });
}
