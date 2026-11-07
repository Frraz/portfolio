// Aplica o tema salvo antes da primeira pintura, para evitar flash. Sem identificadores.
// O Fósforo só vale se estiver liberado (flags completas ou comando `matrix`).
(function () {
  try {
    var salvo = localStorage.getItem("tema");
    var livre = ["rubro", "claro"];
    if (localStorage.getItem("fosforo") === "1") livre.push("fosforo");
    var tema = livre.indexOf(salvo) >= 0 ? salvo : matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "rubro";
    document.documentElement.dataset.tema = tema;
  } catch (e) {}
  document.documentElement.classList.add("js");
})();
