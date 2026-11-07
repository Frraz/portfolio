// Aplica o tema salvo antes da primeira pintura, para evitar flash. Sem identificadores.
// O Fósforo só vale com os nove selos do CTF reunidos (src/ctf/progresso.ts guarda a lista em "selos").
(function () {
  try {
    var salvo = localStorage.getItem("tema");
    var livre = ["rubro", "claro"];
    var selos = JSON.parse(localStorage.getItem("selos") || "[]");
    if (Array.isArray(selos) && selos.length >= 9) livre.push("fosforo");
    var tema = livre.indexOf(salvo) >= 0 ? salvo : matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "rubro";
    document.documentElement.dataset.tema = tema;
  } catch (e) {}
  document.documentElement.classList.add("js");
})();
