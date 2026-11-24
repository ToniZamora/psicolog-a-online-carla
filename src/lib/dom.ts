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

export function showMessage(el: HTMLElement, text: string, kind: "ok" | "error" | "info" = "info") {
  el.textContent = text;
  el.className = `notice${kind === "info" ? "" : ` ${kind}`}`;
  el.hidden = !text;
}

/** Confirmación accesible con <dialog> nativo. */
export function confirmar(texto: string, aceptar = "Sí, continuar"): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = h(
      "dialog",
      { class: "confirm" },
      h("p", {}, texto),
      h(
        "form",
        { method: "dialog", class: "btn-row" },
        h("button", { class: "btn btn-outline", value: "no" }, "Volver"),
        h("button", { class: "btn btn-danger", value: "si" }, aceptar),
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
